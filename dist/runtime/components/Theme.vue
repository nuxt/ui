<script>
import { computed } from "vue";
import defu from "defu";
import { injectThemeContext, provideThemeContext } from "../composables/useComponentProps";
</script>

<script setup>
const _props = defineProps({
  props: { type: Object, required: false },
  ui: { type: null, required: false }
});
defineSlots();
const parent = injectThemeContext();
const NAMESPACES = /* @__PURE__ */ new Set(["prose"]);
function normalizeUi(ui) {
  if (!ui) return {};
  const result = {};
  for (const [key, value] of Object.entries(ui)) {
    if (!value || typeof value !== "object") continue;
    if (NAMESPACES.has(key)) {
      const nested = {};
      for (const [childKey, childValue] of Object.entries(value)) {
        if (childValue && typeof childValue === "object") {
          nested[childKey] = { ui: childValue };
        }
      }
      result[key] = nested;
    } else {
      result[key] = { ui: value };
    }
  }
  return result;
}
provideThemeContext({
  defaults: computed(() => defu(
    _props.props ?? {},
    normalizeUi(_props.ui),
    parent.defaults.value
  ))
});
</script>

<template>
  <slot />
</template>
