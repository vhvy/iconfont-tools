<template>
  <div class="box-selection" :style="styleByPx"></div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, inject } from "vue";
import { useEvent } from "../hooks/useEvent";
import { PROVIDER_ENUM } from "../constants";
import type { Point, ScrollInfo, SelectIconContext } from "../types";

const { handleUpdateSelectAreaStyle } = inject(PROVIDER_ENUM.SELECT_ICON) as SelectIconContext;
const isMouseDown = ref(false);
const isMouseMove = ref(false);
const startPointInfo = reactive<Point>({
  x: 0,
  y: 0
});
const currentPointInfo = reactive<Point>({
  x: 0,
  y: 0
});
const scrollInfo = reactive<ScrollInfo>({
  isScroll: false,
  originEndY: 0,
  beforeScrollTop: 0,
});

const handleMouseDown = (e: MouseEvent) => {
  if (!(e.target as HTMLElement).closest(".icon-wrapper")) return;
  startPointInfo.x = e.pageX;
  startPointInfo.y = e.pageY;
  isMouseDown.value = true;
}

const handleMouseUp = () => {
  if (!isMouseDown.value) return;
  isMouseDown.value = false;
  isMouseMove.value = false;
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isMouseDown.value) return;
  isMouseMove.value = true;
  if (scrollInfo.isScroll) {
    scrollInfo.isScroll = false;
  }

  currentPointInfo.x = e.pageX;
  currentPointInfo.y = e.pageY;
}

const handleScroll = () => {
  if (!isMouseDown.value) return;
  if (!scrollInfo.isScroll) {
    scrollInfo.isScroll = true;
    scrollInfo.originPageY = currentPointInfo.y;
    scrollInfo.beforeScrollTop = document.documentElement.scrollTop;
  }

  const scrollTop = document.documentElement.scrollTop;
  currentPointInfo.y = scrollTop - scrollInfo.beforeScrollTop + (scrollInfo.originPageY || 0);
}

const styles = computed(() => {
  if (!isMouseDown.value || !isMouseMove.value) return {};
  let { x: startX, y: startY } = startPointInfo;
  let { x: endX, y: endY } = currentPointInfo;

  if (startX > endX) {
    [startX, endX] = [endX, startX];
  }

  if (startY > endY) {
    [startY, endY] = [endY, startY];
  }

  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  const MIN_SIZE = 3;

  if (width < MIN_SIZE || height < MIN_SIZE) return {};

  const style = {
    top: startY,
    left: startX,
    width,
    height
  };

  handleUpdateSelectAreaStyle(style);

  return style;
});

const styleByPx = computed(() => {
  return Object.entries(styles.value).reduce((result, [key, value]) => {
    result[key] = `${value}px`;
    return result;
  }, {} as Record<string, string>);
});

useEvent("mousedown", handleMouseDown);
useEvent("mouseup", handleMouseUp);
useEvent("mousemove", handleMouseMove);
useEvent("scroll", handleScroll);

</script>

<style scoped>
.box-selection {
  border: 1px solid rgba(0, 175, 255, 0.4);
  background-color: rgba(0, 175, 255, 0.2);
  position: absolute;
  z-index: 10;
  pointer-events: none;
}
</style>
