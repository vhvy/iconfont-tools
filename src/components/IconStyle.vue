<template>
  <component is="style">
    {{ props.styles }}
  </component>
</template>

<script setup lang="ts">

const props = defineProps<{
  styles: string;
}>();

</script>

<style scoped></style>
