<template>
  <div class="icon-wrapper">
    <template v-for="(item, index) in props.list" :key="item.name">
      <div v-if="item.unicode" :class="getIconItemWrapperClass(index)" ref="iconItemRef"
        :data-icon-unicode="item.unicode.toString(16)" :data-icon-name="item.name" :data-index="index" :data-event="EVENT_ENUM.TOGGLE_ITEM_SELECT">
        <span :class="['icon-item', `icon-${item.name}`]" :data-event="EVENT_ENUM.COPY_ICON_CLASS" title="copy icon class" />
        <span class="icon-name" :data-event="EVENT_ENUM.COPY_ICON_NAME" title="copy icon name">{{ item.name }}</span>
        <span class="icon-value" :data-event="EVENT_ENUM.COPY_ICON_VALUE" title="copy icon value">{{ item.unicode.toString(16) }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, inject } from "vue";
import { hasIntersection } from "../utils";
import { EVENT_ENUM, PROVIDER_ENUM } from "../constants";
import type { GlyphParseResult, SelectIconContext } from "../types";




const props = defineProps<{
  list: GlyphParseResult[]
}>();

const iconItemRef = ref<HTMLElement[]>([]);
const { selectAreaStyle, selectIconIndexSet, handleAddSelectIcon, handleRemoveSelectIcon } = inject(PROVIDER_ENUM.SELECT_ICON) as SelectIconContext;

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

const getIconItemWrapperClass = (index: number) => {
  const classList = ["icon-item-wrapper"];

  if (selectIconIndexSet.value.has(index)) {
    classList.push("selected");
  }

  return classList;
}
</script>

<style scoped>
.icon-wrapper {
  --count: 12;
  /* 每行显示的图标数量 */

  --inline-size: 1.5vw;
  /* margin 水平宽度 */

  --size: calc((100vw - (var(--inline-size) * 2) - 1px) / var(--count));
  /* 每个图标的大小 */

  display: flex;
  flex-flow: row wrap;
  margin: var(--inline-size);
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;


  @media (max-width: 1400px) {
    --count: 10;
  }

  @media (max-width: 1200px) {
    --count: 8;
  }

  @media (max-width: 992px) {
    --count: 6;
  }

  @media (max-width: 768px) {
    --count: 4;
  }
}

.icon-item-wrapper {
  flex: 0 1 var(--size);
  height: var(--size);
  overflow: hidden;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  position: relative;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding-top: calc(var(--size) / 3.5);
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #f0f0f0;
  }

  &.selected {
    background-color: #edeff2;
  }
}

.icon-item {
  font-family: "iconfont";
  font-size: 32px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  user-select: none;
  contain: content;
  cursor: pointer;
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
  cursor: pointer;
}
</style>
