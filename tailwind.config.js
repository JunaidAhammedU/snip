/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./lib/**/*.{js,jsx,ts,tsx}",
        "./providers/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: "var(--color-background)",
                foreground: "var(--color-foreground)",
                card: "var(--color-card)",
                "card-foreground": "var(--color-card-foreground)",
                "card-dark": "var(--color-card-dark)",
                "card-dark-foreground": "var(--color-card-dark-foreground)",
                border: "var(--color-border)",
                muted: "var(--color-muted)",
                "muted-foreground": "var(--color-muted-foreground)",
                primary: "var(--color-primary)",
                "primary-foreground": "var(--color-primary-foreground)",
                destructive: "var(--color-destructive)",
                "destructive-foreground": "var(--color-destructive-foreground)",
                "accent-yellow": "var(--color-accent-yellow)",
                "accent-purple": "var(--color-accent-purple)",
                accent: "var(--color-accent)",
                "accent-foreground": "var(--color-accent-foreground)",
                surface: "var(--color-surface)",
                "surface-foreground": "var(--color-surface-foreground)",
            },
        },
    },
    plugins: [],
};
