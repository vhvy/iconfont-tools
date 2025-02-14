<template>
  <div class="scroll-bar-container"
    :style="{ '--indicator-percent': `${indicatorPercent * 100}%`, '--scroll-percent': `${scrollPercent * 100}%` }"
    v-show="indicatorPercent < 1">
    <div class="scroll-bar-indicator" ref="indicatorRef"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from "vue";

const scrollTop = ref(0);
const scrollHeight = ref(0);
const windowHeight = ref(0);
const indicatorRef = ref<HTMLDivElement | null>(null);
const isMouseDown = ref(false);
const lastMousePosY = ref(0);

const indicatorPercent = computed(() => {
  return windowHeight.value / scrollHeight.value;
});

const scrollPercent = computed(() => {
  return scrollTop.value / scrollHeight.value;
});

const handleScroll = () => {
  scrollTop.value = document.documentElement.scrollTop;
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isMouseDown.value) return;
  const { clientY } = e as MouseEvent;
  const offset = clientY - lastMousePosY.value;
  lastMousePosY.value = clientY;
  const absOffset = Math.abs(offset);

  // mouse move distance percentage of scrollable distance
  const movePercent = absOffset / ((1 - indicatorPercent.value) * windowHeight.value);

  // scroll offset based on move percent
  const scrollOffset = (scrollHeight.value - windowHeight.value) * movePercent * (offset > 0 ? 1 : -1);
  document.documentElement.scrollTo(0, document.documentElement.scrollTop + scrollOffset);
}

const handleIndicatorMouseUp = () => {
  isMouseDown.value = false;
}

const handleIndicatorMouseDown = (e: MouseEvent) => {
  console.log(isMouseDown.value);
  isMouseDown.value = true;
  const { clientY } = e;
  lastMousePosY.value = clientY;
}

const instance = new ResizeObserver(() => {
  scrollHeight.value = document.documentElement.scrollHeight;
  windowHeight.value = window.innerHeight;
});

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  indicatorRef.value?.addEventListener("mousedown", handleIndicatorMouseDown);
  window.addEventListener("mouseup", handleIndicatorMouseUp);
  window.addEventListener("mousemove", handleMouseMove);
  instance.observe(document.documentElement);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  indicatorRef.value?.removeEventListener("mousedown", handleIndicatorMouseDown);
  window.removeEventListener("mouseup", handleIndicatorMouseUp);
  window.removeEventListener("mousemove", handleMouseMove);
  instance.unobserve(document.documentElement);
});
</script>

<style scoped>
.scroll-bar-container {
  --radius: 0px;
  --bar-width: min(15px, 2vw);

  width: var(--bar-width);
  position: fixed;
  top: 2px;
  bottom: 2px;
  right: 2px;
  background-color: #f1f1f1;
  border-radius: var(--radius);
}

.scroll-bar-indicator {
  position: absolute;
  right: 0;
  top: var(--scroll-percent);
  height: var(--indicator-percent);
  width: 100%;
  background-color: #a8a8a8;
  border-radius: var(--radius);
  cursor: pointer;
  transition: width 0.3s ease-in-out;
}
</style>
