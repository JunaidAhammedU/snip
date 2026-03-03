import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type PropsWithChildren,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/lib/constants";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
    theme: Theme;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: PropsWithChildren) {
    const systemColorScheme = useSystemColorScheme();
    const [theme, setThemeState] = useState<Theme>("system");
    const [isLoaded, setIsLoaded] = useState(false);

    const resolvedTheme: ResolvedTheme =
        theme === "system" ? (systemColorScheme ?? "light") : theme;

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEYS.THEME).then((stored) => {
            if (stored === "light" || stored === "dark" || stored === "system") {
                setThemeState(stored);
            }
            setIsLoaded(true);
        });
    }, []);

    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        AsyncStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(resolvedTheme === "light" ? "dark" : "light");
    }, [resolvedTheme, setTheme]);

    if (!isLoaded) return null;

    return (
        <ThemeContext.Provider
            value={{ theme, resolvedTheme, setTheme, toggleTheme }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
