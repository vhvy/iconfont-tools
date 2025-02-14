<template>
  <dialog class="dialog-preview" @click="handleCloseDialog" ref="dialogRef" @close="handleCloseDialog">
    <div class="dialog-preview-content">
      <div class="dialog-preview-canvas-wrapper">
        <canvas :width="defaultImgSize" :height="defaultImgSize" class="dialog-preview-canvas" ref="canvasRef"></canvas>
      </div>
      <div class="dialog-preview-icon-setting">
        <div class="form-item">
          <label>Square Img: </label>
          <input is="ui-checkbox" type="checkbox" :checked="iconSetting.isSquareImg" v-model="iconSetting.isSquareImg">
        </div>
        <div v-if="iconSetting.isSquareImg" class="form-item">
          <label for="">Img size: </label>
          <input class="ui-input" type="number" min="1" v-model="iconSetting.imgSize">
        </div>
        <template v-else>
          <div class="form-item">
            <label for="">Img width: </label>
            <input class="ui-input" type="number" min="1" v-model="iconSetting.imgWidth">
            <br />
          </div>
          <div class="form-item">
            <label for="">Img height: </label>
            <input class="ui-input" type="number" min="1" v-model="iconSetting.imgHeight">
          </div>
        </template>

        <div class="form-item">
          <label for="">Font size: </label>
          <input class="ui-input" type="number" min="1" v-model="iconSetting.size">
        </div>

        <div class="form-item">
          <label for="">Font color: </label>
          <input is="ui-color" type="color" v-model="iconSetting.textColor">
        </div>

        <div class="form-item">
          <label for="">Transparent bg: </label>
          <input is="ui-checkbox" type="checkbox" :checked="iconSetting.transparentBg"
            v-model="iconSetting.transparentBg">
        </div>

        <div class="form-item" v-if="!iconSetting.transparentBg">
          <label for="">bg color: </label>
          <input is="ui-color" type="color" v-model="iconSetting.bgColor">
        </div>

        <button class="ui-button" data-type="primary" @click="handleStartExport">Download</button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import "jszip";

const defaultImgSize = 128;

const dialogRef = ref<HTMLDialogElement | null>(null);
const dialogIsVisible = ref(false);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const currentIconUnicode = ref();
const iconSetting = reactive({
  size: 40,
  imgSize: defaultImgSize,
  textColor: "#000000",
  transparentBg: true,
  bgColor: "#ffffff",

  isSquareImg: true,
  imgWidth: defaultImgSize,
  imgHeight: defaultImgSize,
});

const drawIcon = () => {
  if (!canvasRef.value) return;

  const unicode = String.fromCharCode(parseInt(currentIconUnicode.value, 16));

  let canvasWidth = iconSetting.isSquareImg ? iconSetting.imgSize : iconSetting.imgWidth;
  let canvasHeight = iconSetting.isSquareImg ? iconSetting.imgSize : iconSetting.imgHeight;

  canvasRef.value.style.width = `${canvasWidth}px`;
  canvasRef.value.style.height = `${canvasHeight}px`;
  canvasRef.value.width = canvasWidth;
  canvasRef.value.height = canvasHeight;
  const ctx = canvasRef.value.getContext("2d");
  if (!ctx) return;
  ctx.reset();

  if (!iconSetting.transparentBg) {
    ctx.fillStyle = iconSetting.bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  ctx.font = `${iconSetting.size}px iconfont`;
  ctx.fillStyle = iconSetting.textColor;

  const textMetrics = ctx.measureText(unicode);
  const textLeft = (canvasWidth - textMetrics.width) / 2;
  const textTop = (canvasHeight + (textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent)) / 2;
  ctx.textBaseline = "bottom";
  ctx.fillText(unicode, textLeft, textTop);
}

const emit = defineEmits(["startExport"]);


const openDialog = (iconUnicode: string) => {
  dialogRef.value?.showModal();
  currentIconUnicode.value = iconUnicode;
  dialogIsVisible.value = true;
}

const _handleCloseDialog = () => {
  dialogIsVisible.value = false;
  dialogRef.value?.close();
}

const handleCloseDialog = (e: Event) => {
  if (!(e.target instanceof HTMLDialogElement)) return;
  _handleCloseDialog();
}

const handleStartExport = () => {
  emit("startExport", { ...iconSetting });
  _handleCloseDialog();
}

defineExpose({
  openDialog
});

watch(
  [
    currentIconUnicode,
    iconSetting
  ],
  drawIcon
);

watch(dialogIsVisible, (value) => {
  const hiddenClass = "overhidden";
  if (value) {
    document.body.classList.add(hiddenClass);
  } else {
    document.body.classList.remove(hiddenClass);
  }
}, { immediate: true });

</script>

<style scoped>
.dialog-preview {
  position: fixed;
  inset: 0px;
  width: 100vw;
  height: 100vh;
  border: none;
  background-color: rgba(0, 0, 0, .4);
  z-index: 10;
  justify-content: center;
  align-items: center;
  display: none;

  &[open] {
    display: flex;
  }

  &:focus-visible {
    outline: none;
  }
}

.dialog-preview-content {
  background-color: #fff;
  display: flex;
  border-radius: 10px !important;
  overflow: hidden !important;
}

.dialog-preview-canvas-wrapper {
  width: 440px;
  height: 440px;
  position: relative;
}

.dialog-preview-canvas {
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.dialog-preview-icon-setting {
  padding: 20px;
}

.form-item {
  display: flex;
  width: 280px;

  &+& {
    margin-top: 10px;
  }

  label {
    width: 140px;
  }

  .ui-input {
    flex: 1;
    min-width: 0;
  }


  &+.ui-button {
    margin-top: 20px;
  }
}
</style>
