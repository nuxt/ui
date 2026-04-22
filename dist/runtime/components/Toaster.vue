<script>
import theme from "#build/ui/toaster";
export default {
  name: "Toaster"
};
</script>

<script setup>
import { ref, computed, toRef, provide } from "vue";
import { ToastProvider, ToastViewport, ToastPortal, useForwardProps } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useToast, toastMaxInjectionKey } from "../composables/useToast";
import { usePortal } from "../composables/usePortal";
import { omit } from "../utils";
import { tv } from "../utils/tv";
import UToast from "./Toast.vue";
const props = defineProps({
  position: { type: null, required: false },
  expand: { type: Boolean, required: false, default: true },
  progress: { type: Boolean, required: false, default: true },
  portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
  max: { type: Number, required: false, default: 5 },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  label: { type: String, required: false },
  duration: { type: Number, required: false, default: 5e3 },
  disableSwipe: { type: Boolean, required: false },
  swipeThreshold: { type: Number, required: false }
});
defineSlots();
const { toasts, remove } = useToast();
const appConfig = useAppConfig();
const uiProp = useComponentUI("toaster", props);
provide(toastMaxInjectionKey, toRef(() => props.max));
const providerProps = useForwardProps(reactivePick(props, "duration", "label", "swipeThreshold", "disableSwipe"));
const portalProps = usePortal(toRef(() => props.portal));
const swipeDirection = computed(() => {
  switch (props.position) {
    case "top-center":
      return "up";
    case "top-right":
    case "bottom-right":
      return "right";
    case "bottom-center":
      return "down";
    case "top-left":
    case "bottom-left":
      return "left";
  }
  return "right";
});
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.toaster || {} })({
  position: props.position,
  swipeDirection: swipeDirection.value
}));
function onUpdateOpen(value, id) {
  if (value) {
    return;
  }
  remove(id);
}
const hovered = ref(false);
const expanded = computed(() => props.expand || hovered.value);
const refs = ref([]);
const height = computed(() => refs.value.reduce((acc, { height: height2 }) => acc + height2 + 16, 0));
const frontHeight = computed(() => refs.value[refs.value.length - 1]?.height || 0);
function getOffset(index) {
  return refs.value.slice(index + 1).reduce((acc, { height: height2 }) => acc + height2 + 16, 0);
}
</script>

<template>
  <ToastProvider :swipe-direction="swipeDirection" v-bind="providerProps">
    <slot />

    <UToast
      v-for="(toast, index) of toasts"
      :key="toast.id"
      ref="refs"
      :progress="progress"
      v-bind="omit(toast, ['id', 'close', '_duplicate', '_updated'])"
      :close="toast.close"
      :data-expanded="expanded"
      :data-front="!expanded && index === toasts.length - 1"
      :data-pulsing="toast._duplicate ? toast._duplicate % 2 === 0 ? 'even' : 'odd' : void 0"
      :style="{
  '--index': index - toasts.length + toasts.length,
  '--before': toasts.length - 1 - index,
  '--offset': getOffset(index),
  '--scale': expanded ? '1' : 'calc(1 - var(--before) * var(--scale-factor))',
  '--translate': expanded ? 'calc(var(--offset) * var(--translate-factor))' : 'calc(var(--before) * var(--gap))',
  '--transform': 'translateY(var(--translate)) scale(var(--scale))'
}"
      data-slot="base"
      :class="ui.base({ class: [uiProp?.base, toast.onClick ? 'cursor-pointer' : void 0] })"
      @update:open="onUpdateOpen($event, toast.id)"
      @click="toast.onClick && toast.onClick(toast)"
    />

    <ToastPortal v-bind="portalProps">
      <ToastViewport
        :data-expanded="expanded"
        data-slot="viewport"
        :class="ui.viewport({ class: [uiProp?.viewport, props.class] })"
        :style="{
  '--scale-factor': '0.05',
  '--translate-factor': position?.startsWith('top') ? '1px' : '-1px',
  '--gap': position?.startsWith('top') ? '16px' : '-16px',
  '--front-height': `${frontHeight}px`,
  '--height': `${height}px`
}"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
      />
    </ToastPortal>
  </ToastProvider>
</template>
