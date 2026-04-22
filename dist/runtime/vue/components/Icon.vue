<script>

</script>

<script setup>
import { computed } from "vue";
import { Icon as IconifyIcon } from "@iconify/vue";
import { useAppConfig } from "#imports";
const props = defineProps({
  name: { type: null, required: true },
  mode: { type: String, required: false },
  size: { type: [String, Number], required: false },
  customize: { type: [Function, Boolean, null], required: false }
});
const appConfig = useAppConfig();
function resolveCustomizeFn(customize2, globalCustomize) {
  if (customize2 === false) return void 0;
  if (customize2 === true || customize2 === null) return globalCustomize;
  return customize2;
}
const mode = computed(() => {
  const mode2 = props.mode || appConfig.icon?.mode;
  if (mode2 === "css") return "style";
  return mode2;
});
const size = computed(() => props.size || appConfig.icon?.size);
const customize = computed(() => resolveCustomizeFn(props.customize, appConfig.icon?.customize));
</script>

<template>
  <IconifyIcon
    v-if="typeof name === 'string'"
    :icon="name.replace(/^i-/, '')"
    :mode="mode"
    :width="size"
    :height="size"
    :customise="customize"
  />
  <component :is="name" v-else />
</template>
