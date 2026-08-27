import { router } from "expo-router";
import { useEffect } from "react";
import { Image, View } from "react-native";

import { useThemedStyles, type Palette } from "@/theme";

const SPLASH_DURATION_MS = 2000;

export default function SplashScreen() {
  const styles = useThemedStyles(createStyles);

  useEffect(() => {
    const timer = setTimeout(() => router.replace("/prayer-times"), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.screen}>
      <Image
        source={require("../../assets/images/logo-glow.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const createStyles = (colors: Palette) => ({
  screen: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: colors.surface,
  },
  logo: {
    width: 260,
    height: 260,
  },
});
