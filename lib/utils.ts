import { NOTE_EXCERPT_LENGTH } from "./constants";
import type { Note, NotePreview, Folder } from "./types";

export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function createFolder(name: string, order: number): Folder {
    const now = Date.now();
    return { id: generateId(), name, order, createdAt: now, updatedAt: now };
}

export function createNote(
    folderId: string,
    title: string = "",
    content: string = "",
    colorTag: Note["colorTag"] = "default"
): Note {
    const now = Date.now();
    return {
        id: generateId(),
        folderId,
        title,
        content,
        colorTag,
        isPinned: false,
        createdAt: now,
        updatedAt: now,
    };
}

export function toPreview(note: Note): NotePreview {
    return {
        id: note.id,
        title: note.title || "Untitled",
        updatedAt: note.updatedAt,
        colorTag: note.colorTag,
        isPinned: note.isPinned,
        excerpt:
            note.content.length > NOTE_EXCERPT_LENGTH
                ? note.content.substring(0, NOTE_EXCERPT_LENGTH) + "…"
                : note.content || "No content",
    };
}

export function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
        const day = date.toLocaleDateString(undefined, { weekday: "short" });
        const time = date.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
        });
        return `${day}, ${time}`;
    }
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
}

export function padNumber(n: number): string {
    return n.toString().padStart(2, "0");
}
