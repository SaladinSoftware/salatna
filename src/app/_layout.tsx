import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { LocationProvider } from "@/features/location";
import { ThemeProvider, useTheme } from "@/theme";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LocationProvider>
        <RootNavigator />
      </LocationProvider>
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { mode, colors } = useTheme();

  return (
    <>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.surface },
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="prayer-times" />
        <Stack.Screen name="pick-location" options={{ presentation: "modal" }} />
      </Stack>
    </>
  );
}
