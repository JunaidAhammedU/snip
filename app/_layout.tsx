import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "@/providers/theme-provider";
import { COLORS } from "@/lib/constants";

function App() {
  const { resolvedTheme } = useTheme();
  const colors = COLORS[resolvedTheme];

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
            fontWeight: "700",
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
