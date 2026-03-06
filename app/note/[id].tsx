import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useNotes } from "@/hooks/use-notes";
import { useTheme } from "@/hooks/use-theme";
import { COLORS } from "@/lib/constants";
import { success, warning } from "@/lib/haptics";
import type { Note } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";

export default function NoteDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const colors = COLORS[resolvedTheme];
    const { notes, updateNote, removeNote } = useNotes();

    const [note, setNote] = useState<Note | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const initialised = useRef(false);

    // Load note once
    useEffect(() => {
        const found = notes.find((n) => n.id === id);
        if (found && !initialised.current) {
            setNote(found);
            setTitle(found.title);
            setContent(found.content);
            initialised.current = true;
        }
    }, [id, notes]);

    const handleSave = async () => {
        if (!note) return;
        const finalTitle = title.trim() || "Untitled";
        await updateNote({ ...note, title: finalTitle, content: content });
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

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

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

            {/* Meta info */}
            <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
                <Text variant="caption">
                    {formatDate(note.updatedAt)} · {wordCount} words
                </Text>
            </View>

            <View className="flex-1 px-4 gap-2">
                <Input
                    variant="ghost"
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                    className="text-3xl font-extrabold"
                />
                <Input
                    variant="ghost"
                    placeholder="Start writing…"
                    value={content}
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                    className="flex-1 text-base"
                />
            </View>
        </KeyboardAvoidingView>
    );
}
