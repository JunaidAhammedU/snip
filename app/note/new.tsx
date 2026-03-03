import { useState } from "react";
import { View, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useNotes } from "@/hooks/use-notes";
import { success } from "@/lib/haptics";
import type { Note } from "@/lib/types";

const COLOR_OPTIONS: { label: string; value: Note["colorTag"]; color: string }[] = [
    { label: "Default", value: "default", color: "bg-card border border-border" },
    { label: "Yellow", value: "yellow", color: "bg-accent-yellow" },
    { label: "Purple", value: "purple", color: "bg-accent-purple" },
];

export default function NewNoteScreen() {
    const router = useRouter();
    const { folderId } = useLocalSearchParams<{ folderId: string }>();
    const { addNote } = useNotes(folderId);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [colorTag, setColorTag] = useState<Note["colorTag"]>("default");

    const handleSave = async () => {
        if (!folderId) return;
        await addNote(title.trim(), content.trim(), colorTag);
        success();
        router.back();
    };

    return (
        <View className="flex-1 bg-background p-5 gap-4">
            <Input
                variant="ghost"
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                className="text-3xl font-extrabold"
                autoFocus
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

            {/* Color tag selector */}
            <View className="flex-row items-center gap-3 py-2">
                <Text variant="caption" className="mr-1">
                    Color:
                </Text>
                {COLOR_OPTIONS.map((opt) => (
                    <Pressable
                        key={opt.value}
                        className={`h-8 w-8 rounded-full ${opt.color} ${colorTag === opt.value ? "border-2 border-primary" : ""}`}
                        onPress={() => setColorTag(opt.value)}
                    />
                ))}
            </View>

            <Button
                label="Save Note"
                onPress={handleSave}
                disabled={!title.trim() && !content.trim()}
                size="lg"
            />
        </View>
    );
}
