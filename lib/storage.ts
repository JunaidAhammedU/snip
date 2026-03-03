import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./constants";
import type { Folder, Note } from "./types";

// ── Folders ──────────────────────────────────────────────

export async function loadFolders(): Promise<Folder[]> {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.FOLDERS);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export async function saveFolders(folders: Folder[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
}

export async function saveFolder(folder: Folder): Promise<Folder[]> {
    const folders = await loadFolders();
    const index = folders.findIndex((f) => f.id === folder.id);
    if (index >= 0) {
        folders[index] = { ...folder, updatedAt: Date.now() };
    } else {
        folders.push(folder);
    }
    await saveFolders(folders);
    return folders;
}

export async function deleteFolder(id: string): Promise<Folder[]> {
    const folders = await loadFolders();
    const filtered = folders.filter((f) => f.id !== id);
    await saveFolders(filtered);
    // Also delete notes in this folder
    const notes = await loadNotes();
    const remainingNotes = notes.filter((n) => n.folderId !== id);
    await saveNotes(remainingNotes);
    return filtered;
}

// ── Notes ────────────────────────────────────────────────

export async function loadNotes(): Promise<Note[]> {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export async function saveNotes(notes: Note[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
}

export async function saveNote(note: Note): Promise<Note[]> {
    const notes = await loadNotes();
    const index = notes.findIndex((n) => n.id === note.id);
    if (index >= 0) {
        notes[index] = { ...note, updatedAt: Date.now() };
    } else {
        notes.unshift(note);
    }
    await saveNotes(notes);
    return notes;
}

export async function deleteNote(id: string): Promise<Note[]> {
    const notes = await loadNotes();
    const filtered = notes.filter((n) => n.id !== id);
    await saveNotes(filtered);
    return filtered;
}

export async function loadNotesForFolder(folderId: string): Promise<Note[]> {
    const notes = await loadNotes();
    return notes.filter((n) => n.folderId === folderId);
}
