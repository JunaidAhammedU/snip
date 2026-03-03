import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import {
    RichText,
    Toolbar,
    useEditorBridge,
    useEditorContent,
    TenTapStartKit,
    darkEditorCss,
    editorHtml,
} from "@10play/tentap-editor";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/hooks/use-notes";
import { useFolders } from "@/hooks/use-folders";
import { success } from "@/lib/haptics";
import { COLORS } from "@/lib/constants";
import { useTheme } from "@/hooks/use-theme";
import { extractFirstLine, createNote } from "@/lib/utils";
import * as storage from "@/lib/storage";

function buildCustomSource(isDark: boolean, colors: typeof COLORS["light"] | typeof COLORS["dark"]) {
    const customCss = `
        body {
            background-color: ${colors.background} !important;
            color: ${colors.foreground} !important;
            font-family: 'Lato', -apple-system, sans-serif !important;
            font-size: 16px;
            padding: 16px;
            margin: 0;
            line-height: 1.6;
        }
        * { background-color: ${colors.background}; }
        h1 { font-size: 2rem; font-weight: 900; margin: 0 0 8px; color: ${colors.foreground}; background: transparent; }
        h2 { font-size: 1.5rem; font-weight: 700; margin: 0 0 8px; color: ${colors.foreground}; background: transparent; }
        h3 { font-size: 1.2rem; font-weight: 700; margin: 0 0 8px; color: ${colors.foreground}; background: transparent; }
        p { margin: 0 0 4px; color: ${colors.foreground}; background: transparent; }
        ul, ol { padding-left: 1.2em; }
        li { color: ${colors.foreground}; background: transparent; }
        code { background: ${isDark ? "#2a2a2a" : "#f0f0f0"} !important; border-radius: 4px; padding: 2px 6px; font-size: 0.9em; }
        blockquote { border-left: 3px solid ${colors.border}; margin: 0; padding-left: 1em; color: ${colors.mutedForeground}; background: transparent; }
        strong { font-family: 'Lato', sans-serif; font-weight: 700; }
        em { font-family: 'Lato', sans-serif; font-style: italic; }
    `;
    const base = isDark ? editorHtml.replace("</style>", `${darkEditorCss}</style>`) : editorHtml;
    return base.replace("</style>", `${customCss}</style>`);
}

export default function NewNoteScreen() {
    const router = useRouter();
    const { folderId } = useLocalSearchParams<{ folderId?: string }>();
    const { resolvedTheme } = useTheme();
    const colors = COLORS[resolvedTheme];
    const isDark = resolvedTheme === "dark";

    const { addNote } = useNotes(folderId ?? undefined);
    const { addFolder } = useFolders();

    const editor = useEditorBridge({
        autofocus: true,
        avoidIosKeyboard: true,
        initialContent: "",
        bridgeExtensions: TenTapStartKit,
        customSource: buildCustomSource(isDark, colors),
        theme: {
            toolbar: {
                toolbarBody: {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                    borderTopWidth: StyleSheet.hairlineWidth,
                },
                toolbarButton: {
                    tintColor: colors.foreground,
                } as any,
            },
            webview: {
                backgroundColor: colors.background,
            },
        },
    });

    const htmlContent = useEditorContent(editor, { type: "html", debounceInterval: 300 });

    const handleSave = async () => {
        const html = htmlContent ?? "";
        const empty = !html || html === "<p></p>" || html === "<p><br></p>";
        if (empty) { router.back(); return; }

        const title = extractFirstLine(html) || "Untitled";

        if (folderId) {
            await addNote(title, html, "default");
        } else {
            const folder = await addFolder(title);
            const note = createNote(folder.id, title, html);
            await storage.saveNote(note);
        }

        success();
        router.back();
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.background }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Stack.Screen
                options={{
                    title: "New Note",
                    headerBackTitle: "BACK",
                    headerRight: () => (
                        <Button
                            label="SAVE"
                            variant="ghost"
                            size="sm"
                            onPress={handleSave}
                        />
                    ),
                }}
            />

            <RichText editor={editor} style={{ flex: 1 }} />

            <Toolbar editor={editor} />
        </KeyboardAvoidingView>
    );
}
