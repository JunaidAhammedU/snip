import { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useNotes } from "@/hooks/use-notes";
import { formatDate } from "@/lib/utils";
import { success, warning } from "@/lib/haptics";
import { COLORS } from "@/lib/constants";
import { useTheme } from "@/hooks/use-theme";
import type { Note } from "@/lib/types";

export default function NoteDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const colors = COLORS[resolvedTheme];
    const { notes, updateNote, removeNote } = useNotes();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [note, setNote] = useState<Note | null>(null);

    useEffect(() => {
        const found = notes.find((n) => n.id === id);
        if (found) {
            setNote(found);
            setTitle(found.title);
            setContent(found.content);
        }
    }, [id, notes]);

    const handleSave = async () => {
        if (!note) return;
        await updateNote({
            ...note,
            title: title.trim(),
            content: content.trim(),
        });
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
            <View className="flex-1 bg-background items-center justify-center">
                <Text variant="caption">Note not found.</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            <Stack.Screen
                options={{
                    headerBackTitle: "BACK",
                    headerRight: () => (
                        <Button
                            label="DONE"
                            variant="ghost"
                            size="sm"
                            onPress={handleSave}
                            disabled={!title.trim() && !content.trim()}
                        />
                    ),
                }}
            />

            <Animated.View
                entering={FadeIn.duration(400)}
                className="flex-1 px-5"
            >
                {/* Meta info bar */}
                <View className="flex-row items-center justify-between mb-4">
                    <Text variant="caption">
                        {formatDate(note.updatedAt)} · {note.content.length}
                    </Text>
                </View>

                <Input
                    variant="ghost"
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                    className="text-3xl font-extrabold"
                />

                {/* Color tag badge */}
                {note.isPinned && (
                    <View className="self-start mt-1 px-3 py-1 rounded-md bg-primary">
                        <Text className="text-xs font-semibold text-primary-foreground">
                            Pinned
                        </Text>
                    </View>
                )}

                <Input
                    variant="ghost"
                    placeholder="Start writing…"
                    value={content}
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                    className="flex-1 text-base mt-3"
                />

                {/* Bottom action bar */}
                <View className="flex-row items-center justify-center gap-3 pb-8 pt-3">
                    <Button
                        label="Save"
                        onPress={handleSave}
                        className="flex-1"
                        size="lg"
                        disabled={!title.trim() && !content.trim()}
                    />
                    <Button
                        label="Delete"
                        variant="destructive"
                        onPress={handleDelete}
                        size="lg"
                        className="w-24"
                    />
                </View>
            </Animated.View>
        </View>
    );
}
