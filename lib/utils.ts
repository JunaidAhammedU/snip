import { NOTE_EXCERPT_LENGTH } from "./constants";
import type { Note, NotePreview, Folder } from "./types";

/** Strip HTML tags and decode common entities to plain text */
export function htmlToPlainText(html: string): string {
    return html
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .replace(/\s{2,}/g, " ")
        .trim();
}

/** Extract the first non-empty line from HTML as a plain-text title */
export function extractFirstLine(html: string): string {
    // Match content inside the first block-level tag
    const match = html.match(/<(?:h[1-6]|p)[^>]*>(.*?)<\/(?:h[1-6]|p)>/i);
    if (match) {
        return htmlToPlainText(match[1]).trim();
    }
    return htmlToPlainText(html).split(/\n/)[0].trim();
}

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
    const plain = htmlToPlainText(note.content);
    return {
        id: note.id,
        title: note.title || "Untitled",
        updatedAt: note.updatedAt,
        colorTag: note.colorTag,
        isPinned: note.isPinned,
        excerpt:
            plain.length > NOTE_EXCERPT_LENGTH
                ? plain.substring(0, NOTE_EXCERPT_LENGTH) + "…"
                : plain || "No content",
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
