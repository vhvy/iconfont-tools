<template>
  <div class="icon-action-wrapper" v-if="props.glyph.unicode">
    <button class="action-btn ui-button" data-type="primary" :data-event="EVENT_ENUM.TOGGLE_ITEM_SELECT" :data-icon-name="props.glyph.name"
      :data-icon-unicode="props.glyph.unicode.toString(16)" :data-index="props.index">Toggle Select</button>
    <button class="action-btn ui-button" data-type="primary" :data-event="EVENT_ENUM.COPY_ICON_NAME" :data-icon-name="props.glyph.name"
      :data-icon-unicode="props.glyph.unicode.toString(16)" :data-index="props.index">Copy icon name</button>
    <button class="action-btn ui-button" data-type="primary" :data-event="EVENT_ENUM.COPY_ICON_VALUE" :data-icon-name="props.glyph.name"
      :data-icon-unicode="props.glyph.unicode.toString(16)" :data-index="props.index">Copy icon value</button>
    <button class="action-btn ui-button" data-type="primary" :data-event="EVENT_ENUM.COPY_ICON_CLASS" :data-icon-name="props.glyph.name"
      :data-icon-unicode="props.glyph.unicode.toString(16)" :data-index="props.index">Copy icon class</button>
    <button class="action-btn ui-button" data-type="primary" :data-event="EVENT_ENUM.CONVERT_TO_IMG" :data-icon-name="props.glyph.name"
      :data-icon-unicode="props.glyph.unicode.toString(16)" :data-index="props.index">Convert to img</button>
  </div>
</template>

<script setup lang="ts">
import type { GlyphParseResult } from "../types";
import { EVENT_ENUM } from "../constants";

const props = defineProps<{
  glyph: GlyphParseResult;
  index: number;
}>();

</script>

<style scoped >
.icon-action-wrapper {
  position: absolute;
  inset: 0px;
  background-color: rgba(0, 0, 0, .4);
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  gap: 6px;
  transform: translateY(-100%);
  opacity: 0;
  transition: all ease .2s;


  .action-btn {
    --ui-button-height: 20px;
  }
}
</style>
