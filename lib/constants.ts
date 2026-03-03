export const APP_NAME = "Snip";

export const STORAGE_KEYS = {
    NOTES: "@snip/notes",
    FOLDERS: "@snip/folders",
    THEME: "@snip/theme",
} as const;

export const NOTE_EXCERPT_LENGTH = 80;

export const COLORS = {
    light: {
        background: "#ffffff",
        foreground: "#000000",
        card: "#ffffff",
        cardDark: "#1a1a1a",
        border: "#e5e5e5",
        muted: "#f5f5f5",
        mutedForeground: "#737373",
        accentYellow: "#E2DE7E",
        accentPurple: "#C7A6E9",
    },
    dark: {
        background: "#000000",
        foreground: "#ffffff",
        card: "#1a1a1a",
        cardDark: "#111111",
        border: "#2a2a2a",
        muted: "#1a1a1a",
        mutedForeground: "#a3a3a3",
        accentYellow: "#E2DE7E",
        accentPurple: "#C7A6E9",
    },
} as const;
