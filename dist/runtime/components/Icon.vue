<script>

</script>

<script setup>
import { useForwardProps } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import NuxtIcon from "@nuxt/icon/runtime/components/index.js";
const props = defineProps({
  name: { type: null, required: true },
  mode: { type: String, required: false },
  size: { type: [String, Number], required: false },
  customize: { type: [Function, Boolean, null], required: false }
});
const iconProps = useForwardProps(reactivePick(props, "mode", "size", "customize"));
</script>

<template>
  <NuxtIcon v-if="typeof name === 'string'" :name="name" v-bind="iconProps" />
  <component :is="name" v-else />
</template>
