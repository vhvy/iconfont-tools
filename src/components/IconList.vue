<template>
  <div class="icon-wrapper">
    <template v-for="(item, index) in props.list" :key="item.name">
      <div v-if="item.unicode" :class="getIconItemClass(item, index)" ref="iconItemRef"
        :data-unicode="item.unicode.toString(16)" :data-name="item.name">
        <span class="icon-name" :title="item.name || ''">{{ item.name }}</span>
        <span class="icon-value">{{ item.unicode.toString(16) }}</span>
        <ItemAction :glyph="item" :index="index" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, inject } from "vue";
import ItemAction from "./ItemAction.vue";
import { hasIntersection } from "../utils";
import type { GlyphParseResult, SelectIconContext } from "../types";




const props = defineProps<{
  list: GlyphParseResult[]
}>();

const iconItemRef = ref<HTMLElement[]>([]);
const { selectAreaStyle, selectIconIndexSet, handleAddSelectIcon, handleRemoveSelectIcon } = inject("select-icon") as SelectIconContext;

watch(
  selectAreaStyle,
  () => {
    if (Object.keys(selectAreaStyle.value).length) {
      iconItemRef.value.forEach((item, index) => {
        let rect = item.getBoundingClientRect().toJSON();

        rect.top += window.scrollY;
        rect.left += window.scrollX;

        if (hasIntersection(rect, selectAreaStyle.value)) {
          handleAddSelectIcon(index);
        } else {
          handleRemoveSelectIcon(index);
        }
      });
    }
  }
)

const getIconItemClass = (glyph: GlyphParseResult, index: number) => {
  const classList = [`icon-${glyph.name}`, "icon-item"];

  if (selectIconIndexSet.value.has(index)) {
    classList.push("selected");
  }

  return classList;
}
</script>

<style scoped>
.icon-wrapper {
  --count: 12;
  --inline-gap: 2;
  --size: calc(((100 - var(--inline-gap) * 2) * 1vw - 1px) / var(--count));
  --inline-size: calc(var(--inline-gap) * 1vw);

  display: flex;
  flex-flow: row wrap;
  margin: var(--inline-size);
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}

.icon-item {
  font-family: "iconfont";
  font-size: 32px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  user-select: none;
  contain: content;
}

.icon-item {
  flex: 0 1 var(--size);
  height: var(--size);
  overflow: hidden;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  position: relative;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  position: relative;
  padding-top: calc(var(--size) / 3.5);

  &.selected::before {
    color: red;
  }
}

body:not(.box-selection-active) .icon-item:hover {
  .icon-action-wrapper {
    opacity: 1;
    transform: translateY(0);
  }
}

.icon-value,
.icon-name {
  font-size: 12px;
  white-space: nowrap;
  max-width: 90%;
  text-align: center;
  padding-inline: 1em;
  margin-top: 1em;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
