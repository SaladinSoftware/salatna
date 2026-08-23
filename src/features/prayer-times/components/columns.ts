import { useLayout } from "@/theme";

/** Shared column widths so the header and the rows stay aligned. */
export function useColumns() {
  const { isCompact } = useLayout();

  return {
    /** Iqamah is the first thing to go when the screen is too narrow. */
    showIqamah: !isCompact,
    name: { flex: 2 },
    adhan: { flex: 2 },
    iqamah: { flex: 2 },
    // Wider than the rest so "UPCOMING" fits on one line.
    status: { flex: isCompact ? 2.2 : 2.6 },
  };
}
