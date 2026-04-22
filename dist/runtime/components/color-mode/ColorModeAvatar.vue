<script>

</script>

<script setup>
import { useForwardProps } from "reka-ui";
import { reactiveOmit } from "@vueuse/core";
import UAvatar from "../Avatar.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  light: { type: String, required: true },
  dark: { type: String, required: true },
  as: { type: null, required: false },
  alt: { type: String, required: false },
  icon: { type: null, required: false },
  text: { type: String, required: false },
  size: { type: null, required: false },
  chip: { type: [Boolean, Object], required: false },
  class: { type: null, required: false },
  style: { type: null, required: false },
  ui: { type: Object, required: false }
});
const avatarProps = useForwardProps(reactiveOmit(props, "light", "dark"));
</script>

<template>
  <UAvatar v-bind="{ ...avatarProps, ...$attrs }" :src="light" class="dark:hidden" />
  <UAvatar v-bind="{ ...avatarProps, ...$attrs }" :src="dark" class="hidden dark:block" />
</template>
