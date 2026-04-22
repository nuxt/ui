<script>
import { computed } from "vue";
import { provideThemeContext } from "../composables/useComponentUI";
</script>

<script setup>
const props = defineProps({
  ui: { type: null, required: true }
});
provideThemeContext({
  ui: computed(() => props.ui)
});
</script>

<template>
  <slot />
</template>
