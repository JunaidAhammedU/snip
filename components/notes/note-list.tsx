import { FlatList } from "react-native";
import { NoteCard } from "./note-card";
import { EmptyState } from "./empty-state";
import type { NotePreview } from "@/lib/types";

interface Props {
    notes: NotePreview[];
    onNotePress: (id: string) => void;
    onRefresh?: () => void;
    refreshing?: boolean;
}

export function NoteList({ notes, onNotePress, onRefresh, refreshing }: Props) {
    return (
        <FlatList
            data={notes}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
                <NoteCard note={item} index={index} onPress={onNotePress} />
            )}
            contentContainerClassName="p-4 gap-3"
            contentContainerStyle={notes.length === 0 ? { flex: 1 } : undefined}
            ListEmptyComponent={<EmptyState />}
            onRefresh={onRefresh}
            refreshing={refreshing}
            showsVerticalScrollIndicator={false}
        />
    );
}
