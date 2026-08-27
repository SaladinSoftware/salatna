import type { FlexStyle } from "react-native";

import { useI18n } from "@/features/i18n";

type ColumnKey = "name" | "adhan" | "status";
/** Where the cell content sits inside its column, in reading order. */
type Edge = "start" | "center" | "end";

const COLUMNS: { key: ColumnKey; flex: number; edge: Edge }[] = [
  { key: "name", flex: 2.4, edge: "start" },
  { key: "adhan", flex: 2.6, edge: "center" },
  { key: "status", flex: 2, edge: "end" },
];

export type Column = {
  key: ColumnKey;
  /** Spread onto the cell wrapper — same box in the header and in every row. */
  style: FlexStyle;
  /** Spread onto the text inside, so labels and values land on the same edge. */
  text: { textAlign: "left" | "center" | "right" };
};

/** One source of truth for the table geometry: the header maps it, the rows map it. */
export function useColumns(): Column[] {
  const { isRTL } = useI18n();

  return COLUMNS.map(({ key, flex, edge }) => {
    const side = edge === "center" ? "center" : edge === "start" ? "flex-start" : "flex-end";
    const textSide = edge === "center" ? "center" : edge === "start" ? "left" : "right";

    return {
      key,
      style: { flex, alignItems: isRTL ? flipAlign(side) : side },
      text: { textAlign: isRTL ? flipText(textSide) : textSide },
    };
  });
}

function flipAlign(side: "flex-start" | "center" | "flex-end") {
  if (side === "flex-start") return "flex-end" as const;
  if (side === "flex-end") return "flex-start" as const;
  return "center" as const;
}

function flipText(side: "left" | "center" | "right") {
  if (side === "left") return "right" as const;
  if (side === "right") return "left" as const;
  return "center" as const;
}
