<script>
import theme from "#build/ui/avatar";
</script>

<script setup>
import { ref, computed, watch } from "vue";
import { Primitive, Slot } from "reka-ui";
import { defu } from "defu";
import { useAppConfig } from "#imports";
import ImageComponent from "#build/ui-image-component";
import { useComponentUI } from "../composables/useComponentUI";
import { useAvatarGroup } from "../composables/useAvatarGroup";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
import UChip from "./Chip.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  src: { type: String, required: false },
  alt: { type: String, required: false },
  icon: { type: null, required: false },
  text: { type: String, required: false },
  size: { type: null, required: false },
  chip: { type: [Boolean, Object], required: false },
  class: { type: null, required: false },
  style: { type: null, required: false },
  ui: { type: Object, required: false }
});
const as = computed(() => {
  if (typeof props.as === "string" || typeof props.as?.render === "function") {
    return { root: props.as };
  }
  return defu(props.as, { root: "span" });
});
const fallback = computed(() => props.text || (props.alt || "").split(" ").map((word) => word.charAt(0)).join("").substring(0, 2));
const appConfig = useAppConfig();
const uiProp = useComponentUI("avatar", props);
const { size } = useAvatarGroup(props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.avatar || {} })({
  size: size.value
}));
const rootClass = computed(() => ui.value.root({ class: [uiProp.value?.root, props.class] }));
const sizePx = computed(() => {
  const sizeClass = rootClass.value.split(" ").find((c) => /^size-\d+$/.test(c));
  if (sizeClass) {
    const num = Number.parseFloat(sizeClass.split("-")[1] ?? "");
    if (!Number.isNaN(num)) return num * 4;
  }
  return null;
});
const error = ref(false);
watch(() => props.src, () => {
  if (error.value) {
    error.value = false;
  }
});
function onError() {
  error.value = true;
}
</script>

<template>
  <component
    :is="props.chip ? UChip : Primitive"
    :as="as.root"
    v-bind="props.chip ? typeof props.chip === 'object' ? { inset: true, ...props.chip } : { inset: true } : {}"
    data-slot="root"
    :class="rootClass"
    :style="props.style"
  >
    <component
      :is="as.img || ImageComponent"
      v-if="src && !error"
      :src="src"
      :alt="alt"
      :width="sizePx"
      :height="sizePx"
      v-bind="$attrs"
      data-slot="image"
      :class="ui.image({ class: uiProp?.image })"
      @error="onError"
    />

    <Slot v-else v-bind="$attrs">
      <slot>
        <UIcon v-if="icon" :name="icon" data-slot="icon" :class="ui.icon({ class: uiProp?.icon })" />
        <span v-else data-slot="fallback" :class="ui.fallback({ class: uiProp?.fallback })">{{ fallback || "\xA0" }}</span>
      </slot>
    </Slot>
  </component>
</template>
