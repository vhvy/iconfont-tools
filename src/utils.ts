import type { GlyphParseResult, IconSetting } from "./types";
import JSZip from "jszip";

export const buildIconItemStyle = (name: string | null, unicode: string, prefix = "icon-"): string => {
  if (!name) return "";
  return `.${prefix}${name}:before { content: "\\${unicode}";}`;
}

export const buildIconStyle = (list: GlyphParseResult[], prefix?: string): string => {
  return list.map(glyph => buildIconItemStyle(glyph.name, glyph.unicodeHex, prefix)).join("\n");
}

export const hasIntersection = (rect1: DOMRect, rect2: Record<string, number>): boolean => {
  const { top: top1, left: left1, width: width1, height: height1 } = rect1;
  const { top: top2, left: left2, width: width2, height: height2 } = rect2;

  const maxX = Math.max(left1 + width1, left2 + width2);
  const minX = Math.min(left1, left2);
  const maxY = Math.max(top1 + height1, top2 + height2);
  const minY = Math.min(top1, top2);

  return maxX - minX <= (width1 + width2) && maxY - minY <= (height1 + height2);
}

export const iconToBase64ByCanvas = async (iconList: GlyphParseResult[], setting: IconSetting): Promise<Array<GlyphParseResult & { blob: Blob }>> => {
  const { size, imgSize, textColor, transparentBg, bgColor, isSquareImg, imgWidth, imgHeight } = setting;

  const canvasWidth = isSquareImg ? imgSize : imgWidth;
  const canvasHeight = isSquareImg ? imgSize : imgHeight;

  const canvas = new OffscreenCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Failed to get canvas context");

  const iconInfoList = [];

  for (let icon of iconList) {
    ctx.reset();
    if (!transparentBg) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
    ctx.font = `${size}px iconfont`;
    ctx.fillStyle = textColor;
    const unicode = String.fromCharCode(parseInt(icon.unicodeHex, 16));
    const textMetrics = ctx.measureText(unicode);
    const textLeft = (canvasWidth - textMetrics.width) / 2;
    const textTop = (canvasHeight + (textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent)) / 2;
    ctx.fillText(unicode, textLeft, textTop);
    const blob = await canvas.convertToBlob({ type: "image/png" });
    iconInfoList.push({
      ...icon,
      blob
    });
  }

  return iconInfoList;
}

export const exportIcon = async (iconList: GlyphParseResult[], setting: IconSetting): Promise<void> => {
  window.LightTip.success("Exporting...");
  const iconInfoList = await iconToBase64ByCanvas(iconList, setting);
  const zip = new JSZip();
  iconInfoList.forEach(icon => {
    zip.file(icon.name + ".png", icon.blob, { binary: true });
  });
  window.LightTip.success("Compressing...");
  const zipBlob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "iconfont.zip";
  
  document.body.appendChild(a);
  window.LightTip.success("Downloading...");
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
} 