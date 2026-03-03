import { useCallback, useEffect, useState } from "react";
import type { Folder, FolderWithCount } from "@/lib/types";
import * as storage from "@/lib/storage";
import { createFolder } from "@/lib/utils";

export function useFolders() {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        const loaded = await storage.loadFolders();
        setFolders(loaded.sort((a, b) => a.order - b.order));
        setIsLoading(false);
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const addFolder = useCallback(
        async (name: string) => {
            const folder = createFolder(name, folders.length);
            const updated = await storage.saveFolder(folder);
            setFolders(updated.sort((a, b) => a.order - b.order));
            return folder;
        },
        [folders.length]
    );

    const updateFolder = useCallback(async (folder: Folder) => {
        const updated = await storage.saveFolder(folder);
        setFolders(updated.sort((a, b) => a.order - b.order));
    }, []);

    const removeFolder = useCallback(async (id: string) => {
        const updated = await storage.deleteFolder(id);
        setFolders(updated.sort((a, b) => a.order - b.order));
    }, []);

    const getFoldersWithCounts = useCallback(async (): Promise<
        FolderWithCount[]
    > => {
        const allNotes = await storage.loadNotes();
        return folders.map((f) => ({
            ...f,
            noteCount: allNotes.filter((n) => n.folderId === f.id).length,
        }));
    }, [folders]);

    return {
        folders,
        isLoading,
        refresh,
        addFolder,
        updateFolder,
        removeFolder,
        getFoldersWithCounts,
    };
}
