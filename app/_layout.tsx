import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "@/providers/theme-provider";
import { COLORS } from "@/lib/constants";
import { useFonts } from "@expo-google-fonts/lato";
import {
  Lato_400Regular,
  Lato_400Regular_Italic,
  Lato_700Bold,
  Lato_700Bold_Italic,
  Lato_900Black,
} from "@expo-google-fonts/lato";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

function App() {
  const { resolvedTheme } = useTheme();
  const colors = COLORS[resolvedTheme];

  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_400Regular_Italic,
    Lato_700Bold,
    Lato_700Bold_Italic,
    Lato_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
          headerBackTitle: "BACK",
          headerTitleStyle: {
            fontFamily: "Lato_700Bold",
            fontSize: 16,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="folder/[id]"
          options={{ title: "" }}
        />
        <Stack.Screen
          name="note/new"
          options={{
            title: "New Note",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="note/[id]"
          options={{ title: "" }}
        />
      </Stack>
      <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
