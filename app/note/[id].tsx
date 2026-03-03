import { useEffect, useRef, useState } from "react";
import { View, Alert, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
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
import { Text } from "@/components/ui/text";
import { useNotes } from "@/hooks/use-notes";
import { formatDate, extractFirstLine } from "@/lib/utils";
import { success, warning } from "@/lib/haptics";
import { COLORS } from "@/lib/constants";
import { useTheme } from "@/hooks/use-theme";
import type { Note } from "@/lib/types";

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

export default function NoteDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const colors = COLORS[resolvedTheme];
    const isDark = resolvedTheme === "dark";
    const { notes, updateNote, removeNote } = useNotes();

    const [note, setNote] = useState<Note | null>(null);
    const initialised = useRef(false);

    const editor = useEditorBridge({
        autofocus: false,
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

    useEffect(() => {
        const found = notes.find((n) => n.id === id);
        if (found && !initialised.current) {
            setNote(found);
            initialised.current = true;
            setTimeout(() => {
                editor.setContent(found.content);
            }, 150);
        }
    }, [id, notes]);

    const handleSave = async () => {
        if (!note) return;
        const html = htmlContent ?? note.content;
        const title = extractFirstLine(html) || note.title || "Untitled";
        await updateNote({ ...note, title, content: html });
        success();
        router.back();
    };

    const handleDelete = () => {
        warning();
        Alert.alert(
            "Delete Note",
            "Are you sure you want to delete this note?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await removeNote(id!);
                        router.back();
                    },
                },
            ]
        );
    };

    if (!note) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
                <Text variant="caption">Loading…</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.background }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Stack.Screen
                options={{
                    headerBackTitle: "BACK",
                    headerRight: () => (
                        <View style={{ flexDirection: "row", gap: 8 }}>
                            <Button
                                label="DELETE"
                                variant="ghost"
                                size="sm"
                                onPress={handleDelete}
                            />
                            <Button
                                label="DONE"
                                variant="ghost"
                                size="sm"
                                onPress={handleSave}
                            />
                        </View>
                    ),
                }}
            />

            <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
                <Text variant="caption">
                    {formatDate(note.updatedAt)}
                </Text>
            </View>

            <RichText editor={editor} style={{ flex: 1 }} />

            <Toolbar editor={editor} />
        </KeyboardAvoidingView>
    );
}
