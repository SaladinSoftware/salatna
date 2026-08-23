import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

/** Design width the spacing/typography scale was drawn at. */
const BASE_WIDTH = 390;

export type Layout = {
  width: number;
  height: number;
  /** Small phones — the table drops its least important column. */
  isCompact: boolean;
  /** Tablets and landscape — the card stops stretching edge to edge. */
  isWide: boolean;
  /** Clamped width ratio: multiply font sizes and paddings by this. */
  scale: number;
  /** Horizontal page padding for the current width. */
  gutter: number;
  /** Widest the content is ever allowed to get. */
  maxContentWidth: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Everything screen-size dependent in one place, so components stay declarative. */
export function useLayout(): Layout {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isWide = width >= 700;
    return {
      width,
      height,
      isCompact: width < 360,
      isWide,
      scale: clamp(width / BASE_WIDTH, 0.85, 1.15),
      gutter: width < 360 ? 12 : isWide ? 32 : 16,
      maxContentWidth: 640,
    };
  }, [width, height]);
}

/** Rounds a scaled size so borders and text stay crisp. */
export function scaled(size: number, scale: number): number {
  return Math.round(size * scale);
}
