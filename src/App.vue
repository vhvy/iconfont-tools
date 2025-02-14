<template>
  <div @click="handleGlobalClick">
    <div class="action-wrapper">
      <div class="btn-group">
        <label>Font file:</label>
        <input class="ui-input" v-model="inputFontUrl" type="url" placeholder="please input iconfont http(s) url"
          pattern="https?:\/\/.+" @keyup.enter="handleFontUrlChange" />
        <button data-type="primary" class="ui-button" @click="handleFontUrlChange">Load</button>
        <span>&nbsp;or&nbsp;</span>
        <input class="ui-input" type="file" accept=".ttf,.woff,.woff2" @change="handleFontFileChange" />
      </div>

      <div class="btn-group">
        <label>Icon prefix:</label>
        <input v-model="iconPrefix" class="ui-input" type="text" placeholder="please input icon prefix" />
        <button class="ui-button" @click="handleCopyAllIconCSS">Copy All Icon CSS</button>
        <button class="ui-button" @click="handleConvertAllIconfontToImg">Convert all iconfont to img</button>
        <template v-if="hasSelectIcon">
          <button class="ui-button" data-type="success" @click="handleCopySelectedIconCSS">Copy Selected Icon CSS</button>
          <button class="ui-button" data-type="success" @click="handleConvertSelectedIconfontToImg">Convert selected iconfont to
            img</button>
        </template>
      </div>
    </div>

    <IconStyle :styles="styles" />
    <IconList :list="glyphList" />
    <BoxSelection />
    <IconPreviewDialog ref="dialogRef" @startExport="handleStartExport" />
    <ScrollBar />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, computed } from 'vue';
import IconStyle from './components/IconStyle.vue';
import IconList from './components/IconList.vue';
import IconPreviewDialog from './components/IconPreviewDialog.vue';
import BoxSelection from './components/BoxSelection.vue';
import ScrollBar from './components/ScrollBar.vue';
import { useSelectIcon } from './hooks/useSelectIcon';
import { useFontFile } from './hooks/useFontFile';

import { EVENT_ENUM, PROVIDER_ENUM } from './constants';
import { buildIconStyle, buildIconItemStyle, exportIcon } from './utils';
import type { GlyphParseResult, IconSetting } from "./types";

const iconPrefix = ref("icon-");
const dialogRef = ref<typeof IconPreviewDialog | null>(null);

const { selectIconIndexSet, handleAddSelectIcon, handleRemoveSelectIcon } = useSelectIcon();
const { inputFontUrl, glyphList, styles, handleFontUrlChange, handleFontFileChange } = useFontFile();
const waitProcessGlyphList = ref<GlyphParseResult[]>([]);

const selectIconGlyphList = computed(() => {
  return glyphList.value.filter((_, index) => selectIconIndexSet.value.has(index));
});

const hasSelectIcon = computed(() => {
  return selectIconIndexSet.value.size > 0;
});

const handleSetClipboard = (text: string) => {
  if (!text) return;
  navigator.clipboard.writeText(text)
    .then(() => window.LightTip.success("Copy successfully"))
    .catch(() => window.LightTip.error("Copy failed"));
}

const handleToggleSelectItem = (dataset: DOMStringMap) => {
  const index = Number(dataset.index);
  if (selectIconIndexSet.value.has(index)) {
    handleRemoveSelectIcon(index);
  } else {
    handleAddSelectIcon(index);
  }
}

const handleCopyIconName = (dataset: DOMStringMap) => {
  handleSetClipboard(iconPrefix.value + dataset.iconName);
}

const handleCopyIconValue = (dataset: DOMStringMap) => {
  handleSetClipboard("\\" + dataset.iconUnicode);
}

const handleCopyIconClass = (dataset: DOMStringMap) => {
  if (!dataset.iconName || !dataset.iconUnicode) return;
  const classContent = buildIconItemStyle(dataset.iconName, dataset.iconUnicode, iconPrefix.value);
  handleSetClipboard(classContent);
}

const handleConvertToImg = (dataset: DOMStringMap) => {
  const index = Number(dataset.index);
  const glyph = glyphList.value[index];
  if (!glyph) return;
  waitProcessGlyphList.value = [glyph];
  handlePreviewIcon(glyph.unicodeHex);
}

const handlePreviewIcon = (unicodeHex: string) => {
  dialogRef.value?.openDialog(unicodeHex);
}

const handlerMap = {
  [EVENT_ENUM.COPY_ICON_CLASS]: handleCopyIconClass,
  [EVENT_ENUM.COPY_ICON_NAME]: handleCopyIconName,
  [EVENT_ENUM.COPY_ICON_VALUE]: handleCopyIconValue,
  [EVENT_ENUM.TOGGLE_ITEM_SELECT]: handleToggleSelectItem,
  [EVENT_ENUM.CONVERT_TO_IMG]: handleConvertToImg
}

const handleGlobalClick = (e: MouseEvent) => {
  if (e !== null && e.target instanceof HTMLElement) {
    let dataset = e.target.dataset;
    let event = dataset.event;
    if (!event || !Object.values(EVENT_ENUM).includes(event as EVENT_ENUM)) return;

    const dataKey = "data-icon-unicode";

    if (!e.target.hasAttribute(dataKey)) {
      const parentEl = e.target.closest(`[${dataKey}]`);
      if (!parentEl || !(parentEl instanceof HTMLElement)) return;
      dataset = parentEl.dataset;
    }

    handlerMap[event as EVENT_ENUM]?.(dataset);
  }
}

const handleCopyAllIconCSS = () => {
  const classContent = buildIconStyle(glyphList.value, iconPrefix.value);
  handleSetClipboard(classContent);
}

const handleCopySelectedIconCSS = () => {
  const classContent = buildIconStyle(selectIconGlyphList.value, iconPrefix.value);
  handleSetClipboard(classContent);
}

const handleConvertAllIconfontToImg = () => {
  if (!glyphList.value.length) return;
  waitProcessGlyphList.value = glyphList.value;
  handlePreviewIcon(waitProcessGlyphList.value[0].unicodeHex);
}

const handleConvertSelectedIconfontToImg = () => {
  if (!selectIconGlyphList.value.length) return;
  waitProcessGlyphList.value = selectIconGlyphList.value;
  handlePreviewIcon(waitProcessGlyphList.value[0].unicodeHex);
}

provide(PROVIDER_ENUM.GLOBAL_STATE, {
  iconPrefix,
});


const handleStartExport = (iconSetting: IconSetting) => {
  exportIcon(waitProcessGlyphList.value, iconSetting);
}

</script>

<style>
.overhidden {
  overflow: hidden;
}
</style>

<style scoped>
.action-wrapper {
  position: sticky;
  top: 0;

  padding: 2vw;
  z-index: 20;
  background-color: rgba(255, 255, 255, .5);
  backdrop-filter: blur(5px);
  box-shadow: 0 0 10px rgba(0, 0, 0, .1);
}

.btn-group {
  display: flex;
  align-items: center;

  &+& {
    margin-top: 2vw;
  }

  &>*:nth-child(n+3) {
    margin-left: 10px;
  }

  input:invalid {
    border: 1px solid red;
  }
}

.btn-group label {
  font-size: 14px;
  min-width: 80px;
}
</style>
