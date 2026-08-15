import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import MapView, { Marker, type MapPressEvent } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import { describePlace, useLocation } from "@/features/location";
import type { Coordinates } from "@/features/prayer-times";
import { radius, spacing, useTheme, useThemedStyles, type Palette } from "@/theme";

/** How much of the map is visible around the pin, in degrees. */
const ZOOM = { latitudeDelta: 0.4, longitudeDelta: 0.4 };

export default function PickLocationScreen() {
  const { place, selectPlace } = useLocation();
  const [picked, setPicked] = useState<Coordinates>(place.coordinates);
  const [isSaving, setIsSaving] = useState(false);
  const { mode, colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  function handlePress(event: MapPressEvent) {
    setPicked(event.nativeEvent.coordinate);
  }

  async function handleConfirm() {
    setIsSaving(true);
    const label = await describePlace(picked);
    selectPlace({ coordinates: picked, label });
    router.back();
  }

  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      <MapView
        style={styles.map}
        userInterfaceStyle={mode}
        initialRegion={{ ...place.coordinates, ...ZOOM }}
        onPress={handlePress}>
        <Marker coordinate={picked} />
      </MapView>

      <View style={styles.panel}>
        <Text style={styles.hint}>Tap anywhere on the map to choose a location.</Text>
        <Text style={styles.coordinates}>
          {picked.latitude.toFixed(4)}, {picked.longitude.toFixed(4)}
        </Text>

        <Pressable style={styles.confirm} onPress={handleConfirm} disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator color={colors.onAccent} />
          ) : (
            <Text style={styles.confirmText}>Use this location</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: Palette) => ({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  map: {
    flex: 1,
  },
  panel: {
    padding: spacing.xl,
    gap: spacing.md,
    alignItems: "center" as const,
  },
  hint: {
    fontSize: 14,
    color: colors.textMuted,
  },
  coordinates: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.textPrimary,
  },
  confirm: {
    alignSelf: "stretch" as const,
    alignItems: "center" as const,
    backgroundColor: colors.accent,
    paddingVertical: spacing.lg,
    borderRadius: radius.pill,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.onAccent,
  },
  cancel: {
    fontSize: 15,
    color: colors.textMuted,
  },
});
