import { ref, shallowRef, computed, watch } from "vue";
import type { Ref } from "vue";
import { buildIconStyle } from "../utils";
import { parse } from "opentype.js";
import type { Glyph } from "opentype.js";
import type { GlyphParseResult } from "../types";

export const useArrayBufferByFontUrl = (urlRef: Ref<string>) => {
  const arrayBuffer = shallowRef<ArrayBuffer | null>(null);

  const fetchFontBuffer = async () => {
    if (urlRef.value) {
      try {
        const res = await fetch(urlRef.value);
        if (res.status !== 200) {
          throw new Error(res.statusText);
        }
        const buffer = await res.arrayBuffer();
        arrayBuffer.value = buffer;
        window.LightTip.success("Font loaded successfully");
        history.replaceState({}, "", location.pathname + `?${URL_PARAM}=` + encodeURIComponent(urlRef.value));
      } catch (e: any) {
        window.LightTip.error("Failed to load font: " + e.message);
      }
    } else {
      arrayBuffer.value = null;
    }
  }

  watch(
    urlRef,
    fetchFontBuffer,
    {
      immediate: true
    }
  )

  return arrayBuffer;
}

export const useFontByArrayBuffer = (arrayBufferRef: Ref<ArrayBuffer | null>) => {
  const glyphList = computed<GlyphParseResult[]>(() => {
    if (!arrayBufferRef.value) return [];
    try {
      const parseResult = parse(arrayBufferRef.value);
      return Object.values((parseResult.glyphs as any).glyphs as Glyph[]).reduce((list: GlyphParseResult[], glyph) => {
        if (!glyph.unicode || !glyph.name) return list;

        const { unicode, name } = glyph;
        list.push({
          unicode,
          name,
          unicodeHex: unicode.toString(16),
        });

        return list;
      }, []);
    } catch (err: any) {
      window.LightTip.error("Failed to parse font: " + err.message);
      return [];
    }
  });

  const styles = computed(() => {
    return buildIconStyle(glyphList.value);
  });

  watch(
    arrayBufferRef,
    async (arrayBuffer) => {
      if (!arrayBuffer) return;
      const fontFace = new FontFace("iconfont", arrayBuffer);
      await fontFace.load();
      document.fonts.add(fontFace);
    },
    {
      immediate: true
    }
  )

  return {
    glyphList,
    styles
  };
};

const URL_PARAM = "iconurl";

export const useFontFile = () => {
  const fontUrl = ref("");
  const inputFontUrl = ref("");

  const arrayBufferByUrl = useArrayBufferByFontUrl(fontUrl);
  const arrayBufferByFile = shallowRef<ArrayBuffer | null>(null);

  const arrayBuffer = computed(() => {
    return arrayBufferByFile.value || arrayBufferByUrl.value;
  });

  const { glyphList, styles } = useFontByArrayBuffer(arrayBuffer);

  const handleFontUrlChange = () => {
    if (!inputFontUrl.value) return;
    if (!/https?:\/\/([A-Za-z0-9-]+\.)+[A-Za-z]{2,}/.test(inputFontUrl.value.trim())) {
      window.LightTip.error("Invalid font url");
      return;
    }
    fontUrl.value = inputFontUrl.value;
  }

  const handleFontFileChange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    fontUrl.value = "";
    const arrayBuffer = await file.arrayBuffer();
    arrayBufferByFile.value = arrayBuffer;
    window.LightTip.success("Font file loaded successfully");
  }

  const searchParams = new URLSearchParams(location.search);
  if (searchParams.size && searchParams.has(URL_PARAM)) {
    inputFontUrl.value = searchParams.get(URL_PARAM) || "";
    handleFontUrlChange();
  }

  watch(
    arrayBufferByUrl,
    () => {
      if (arrayBufferByFile.value) {
        arrayBufferByFile.value = null;
      }
    }
  )

  return {
    glyphList,
    styles,
    inputFontUrl,
    handleFontUrlChange,
    handleFontFileChange
  };
} 