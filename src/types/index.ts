import type { Ref } from 'vue';
import type { Glyph } from "opentype.js";

export interface GlyphParseResult extends Pick<Glyph, "name" | "unicode"> {
  unicodeHex: string;
}

export interface IconSetting {
  size: number;
  imgSize: number;
  textColor: string;
  transparentBg: boolean;
  bgColor: string;
  isSquareImg: boolean;
  imgWidth: number;
  imgHeight: number;
}

export interface SelectIconContext {
  selectAreaStyle: Ref<Record<string, number>>;
  selectIconIndexSet: Ref<Set<number>>;
  handleUpdateSelectAreaStyle: (style: Record<string, number>) => void;
  handleAddSelectIcon: (index: number) => void;
  handleRemoveSelectIcon: (index: number) => void;
}

export interface Point {
  x: number;
  y: number;
}

export interface ScrollInfo {
  isScroll: boolean;
  originEndY: number;
  beforeScrollTop: number;
  originPageY?: number;
} 