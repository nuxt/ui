<script>
import theme from "#build/ui/prose/code-icon";
</script>

<script setup>
import { computed } from "vue";
import { defu } from "defu";
import { useAppConfig } from "#imports";
import UIcon from "../Icon.vue";
const props = defineProps({
  icon: { type: null, required: false },
  filename: { type: String, required: false }
});
const appConfig = useAppConfig();
const icons = computed(() => defu(appConfig.ui?.prose?.codeIcon || {}, theme));
const icon = computed(() => {
  if (props.icon) {
    return props.icon;
  }
  if (!props.filename) {
    return;
  }
  const cleanFilename = props.filename.replace(/\s*\(.*\)\s*$/, "");
  const extension = cleanFilename.includes(".") && cleanFilename.split(".").pop();
  const name = cleanFilename.split("/").pop();
  return (name && icons.value[name.toLowerCase()]) ?? (extension && (icons.value[extension] ?? `i-vscode-icons-file-type-${extension}`));
});
</script>

<template>
  <UIcon v-if="icon" :name="icon" />
</template>
