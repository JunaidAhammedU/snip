export interface Folder {
    id: string;
    name: string;
    order: number;
    createdAt: number;
    updatedAt: number;
}

export interface Note {
    id: string;
    folderId: string;
    title: string;
    content: string;
    colorTag: "yellow" | "purple" | "default";
    isPinned: boolean;
    createdAt: number;
    updatedAt: number;
}

export type NotePreview = Pick<
    Note,
    "id" | "title" | "updatedAt" | "colorTag" | "isPinned"
> & {
    excerpt: string;
};

export type FolderWithCount = Folder & {
    noteCount: number;
};
