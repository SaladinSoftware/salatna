import { StyleSheet } from "react-native";

/** Shared column widths so the header and the rows stay aligned. */
export const columns = StyleSheet.create({
  name: { flex: 2 },
  adhan: { flex: 2 },
  iqamah: { flex: 2 },
  // Wider than the rest so "UPCOMING" fits on one line.
  status: { flex: 2.6 },
});
