import { View, ScrollView } from "react-native";
import { NoteCard } from "./note-card";
import { EmptyState } from "./empty-state";
import type { NotePreview } from "@/lib/types";

interface Props {
    notes: NotePreview[];
    onNotePress: (id: string) => void;
    onRefresh?: () => void;
    refreshing?: boolean;
}

export function BentoGrid({
    notes,
    onNotePress,
    onRefresh,
    refreshing,
}: Props) {
    if (notes.length === 0) {
        return <EmptyState />;
    }

    // Split notes into two columns for masonry layout
    const leftColumn: { note: NotePreview; index: number }[] = [];
    const rightColumn: { note: NotePreview; index: number }[] = [];

    notes.forEach((note, index) => {
        if (index % 2 === 0) {
            leftColumn.push({ note, index });
        } else {
            rightColumn.push({ note, index });
        }
    });

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerClassName="px-4 pt-2 pb-24"
        >
            <View className="flex-row gap-3">
                <View className="flex-1 gap-3">
                    {leftColumn.map(({ note, index }) => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            index={index}
                            onPress={onNotePress}
                        />
                    ))}
                </View>
                <View className="flex-1 gap-3">
                    {rightColumn.map(({ note, index }) => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            index={index}
                            onPress={onNotePress}
                        />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
