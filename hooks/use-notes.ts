import { useCallback, useEffect, useState } from "react";
import type { Note } from "@/lib/types";
import * as storage from "@/lib/storage";
import { createNote } from "@/lib/utils";

export function useNotes(folderId?: string) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        if (folderId) {
            const loaded = await storage.loadNotesForFolder(folderId);
            setNotes(loaded);
        } else {
            const loaded = await storage.loadNotes();
            setNotes(loaded);
        }
        setIsLoading(false);
    }, [folderId]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const addNote = useCallback(
        async (
            title?: string,
            content?: string,
            colorTag?: Note["colorTag"]
        ) => {
            if (!folderId) throw new Error("folderId is required to add a note");
            const note = createNote(folderId, title, content, colorTag);
            const updated = await storage.saveNote(note);
            setNotes(
                folderId
                    ? updated.filter((n) => n.folderId === folderId)
                    : updated
            );
            return note;
        },
        [folderId]
    );

    const updateNote = useCallback(
        async (note: Note) => {
            const updated = await storage.saveNote(note);
            setNotes(
                folderId
                    ? updated.filter((n) => n.folderId === folderId)
                    : updated
            );
        },
        [folderId]
    );

    const removeNote = useCallback(
        async (id: string) => {
            const updated = await storage.deleteNote(id);
            setNotes(
                folderId
                    ? updated.filter((n) => n.folderId === folderId)
                    : updated
            );
        },
        [folderId]
    );

    return { notes, isLoading, refresh, addNote, updateNote, removeNote };
}
