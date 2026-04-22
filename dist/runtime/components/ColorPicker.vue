<script>
import theme from "#build/ui/color-picker";
function HSLtoHSV(hsl) {
  const x = hsl.S * (hsl.L < 50 ? hsl.L : 100 - hsl.L);
  const v = hsl.L + x / 100;
  return {
    h: hsl.H,
    s: hsl.L === 0 ? hsl.S : 2 * x / v,
    v
  };
}
function HSVtoHSL(hsv) {
  const x = (200 - hsv.s) * hsv.v / 100;
  return {
    H: hsv.h,
    S: x === 0 || x === 200 ? 0 : Math.round(hsv.s * hsv.v / (x <= 100 ? x : 200 - x)),
    L: x / 2
  };
}
</script>

<script setup>
import { ref, nextTick, computed, toValue } from "vue";
import { Primitive } from "reka-ui";
import { useEventListener, useElementBounding, watchThrottled, watchPausable } from "@vueuse/core";
import { isClient } from "@vueuse/shared";
import { ColorTranslator } from "colortranslator";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { tv } from "../utils/tv";
const props = defineProps({
  as: { type: null, required: false },
  throttle: { type: Number, required: false, default: 50 },
  disabled: { type: Boolean, required: false },
  defaultValue: { type: String, required: false, default: "#FFFFFF" },
  format: { type: String, required: false, default: "hex" },
  size: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const modelValue = defineModel({ type: String, ...void 0 });
const appConfig = useAppConfig();
const uiProp = useComponentUI("colorPicker", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.colorPicker || {} })({
  size: props.size
}));
const pickedColor = computed({
  get() {
    try {
      const color = new ColorTranslator(modelValue.value || props.defaultValue);
      return HSLtoHSV(color.HSLObject);
    } catch (_) {
      return { h: 0, s: 0, v: 100 };
    }
  },
  set(value) {
    const color = new ColorTranslator(HSVtoHSL(value), {
      labUnit: "percent",
      cmykUnit: "percent",
      cmykFunction: "cmyk"
    });
    switch (props.format) {
      case "rgb":
        modelValue.value = color.RGB;
        break;
      case "hsl":
        modelValue.value = color.HSL;
        break;
      case "cmyk":
        modelValue.value = color.CMYK;
        break;
      case "lab":
        modelValue.value = color.CIELab;
        break;
      case "hex":
      default:
        modelValue.value = color.HEX;
    }
  }
});
function useColorDraggable(targetElement, containerElement, axis = "both", initialPosition = { x: 0, y: 0 }, disabled2) {
  const position = ref(initialPosition);
  const pressedDelta = ref();
  const targetRect = useElementBounding(targetElement);
  const containerRect = useElementBounding(containerElement);
  function start(event) {
    if (toValue(disabled2)) return event.preventDefault();
    const container = toValue(containerElement);
    pressedDelta.value = {
      x: event.clientX - (container ? event.clientX - containerRect.left.value + container.scrollLeft : targetRect.left.value),
      y: event.clientY - (container ? event.clientY - containerRect.top.value + container.scrollTop : targetRect.top.value)
    };
    move(event);
  }
  function move(event) {
    if (!pressedDelta.value) return;
    const container = toValue(containerElement);
    let { x, y } = position.value;
    if (container && (axis === "x" || axis === "both")) {
      x = Math.min(Math.max(0, (event.clientX - pressedDelta.value.x) / container.scrollWidth * 100), 100);
    }
    if (container && (axis === "y" || axis === "both")) {
      y = Math.min(Math.max(0, (event.clientY - pressedDelta.value.y) / container.scrollHeight * 100), 100);
    }
    position.value = { x, y };
  }
  function end() {
    if (!pressedDelta.value) {
      return;
    }
    pressedDelta.value = void 0;
  }
  if (isClient) {
    useEventListener(containerElement, "pointerdown", start);
    useEventListener(window, "pointermove", move);
    useEventListener(window, "pointerup", end);
  }
  return {
    position
  };
}
function normalizeHue(hue, dir = "left") {
  if (dir === "right") {
    return hue * 100 / 360;
  }
  return hue / 100 * 360;
}
function normalizeBrightness(brightness) {
  return 100 - brightness;
}
const selectorRef = ref(null);
const selectorThumbRef = ref(null);
const trackRef = ref(null);
const trackThumbRef = ref(null);
const disabled = computed(() => props.disabled);
const { position: selectorThumbPosition } = useColorDraggable(selectorThumbRef, selectorRef, "both", {
  x: pickedColor.value.s,
  y: normalizeBrightness(pickedColor.value.v)
}, disabled);
const { position: trackThumbPosition } = useColorDraggable(trackThumbRef, trackRef, "y", {
  x: 0,
  y: normalizeHue(pickedColor.value.h, "right")
}, disabled);
const { pause: pauseWatchColor, resume: resumeWatchColor } = watchPausable(pickedColor, (hsb) => {
  selectorThumbPosition.value = {
    x: hsb.s,
    y: normalizeBrightness(hsb.v)
  };
  trackThumbPosition.value = {
    x: 0,
    y: normalizeHue(hsb.h, "right")
  };
});
watchThrottled([selectorThumbPosition, trackThumbPosition], () => {
  pauseWatchColor();
  pickedColor.value = {
    h: normalizeHue(trackThumbPosition.value.y),
    s: selectorThumbPosition.value.x,
    v: normalizeBrightness(selectorThumbPosition.value.y)
  };
  nextTick(resumeWatchColor);
}, { throttle: () => props.throttle });
const trackThumbColor = computed(() => new ColorTranslator(HSVtoHSL({
  h: normalizeHue(trackThumbPosition.value.y),
  s: 100,
  v: 100
})).HEX);
const selectorStyle = computed(() => ({
  backgroundColor: trackThumbColor.value
}));
const selectorThumbStyle = computed(() => ({
  backgroundColor: new ColorTranslator(modelValue.value || props.defaultValue).HEX,
  left: `${selectorThumbPosition.value.x}%`,
  top: `${selectorThumbPosition.value.y}%`
}));
const trackThumbStyle = computed(() => ({
  backgroundColor: trackThumbColor.value,
  top: `${trackThumbPosition.value.y}%`
}));
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })" :data-disabled="disabled ? true : void 0">
    <div data-slot="picker" :class="ui.picker({ class: uiProp?.picker })">
      <div
        ref="selectorRef"
        data-slot="selector"
        :class="ui.selector({ class: uiProp?.selector })"
        :style="selectorStyle"
      >
        <div data-slot="selectorBackground" :class="ui.selectorBackground({ class: uiProp?.selectorBackground })" data-color-picker-background>
          <div
            ref="selectorThumbRef"
            data-slot="selectorThumb"
            :class="ui.selectorThumb({ class: uiProp?.selectorThumb })"
            :style="selectorThumbStyle"
            :data-disabled="disabled ? true : void 0"
          />
        </div>
      </div>
      <div
        ref="trackRef"
        data-slot="track"
        :class="ui.track({ class: uiProp?.track })"
        data-color-picker-track
      >
        <div
          ref="trackThumbRef"
          data-slot="trackThumb"
          :class="ui.trackThumb({ class: uiProp?.trackThumb })"
          :style="trackThumbStyle"
          :data-disabled="disabled ? true : void 0"
        />
      </div>
    </div>
  </Primitive>
</template>

<style scoped>
[data-color-picker-background]{background-image:linear-gradient(0deg,#000 0,transparent),linear-gradient(90deg,#fff 0,hsla(0,0%,100%,0))}[data-color-picker-track]{background-image:linear-gradient(0deg,red,#f0f 17%,#00f 33%,#0ff 50%,#0f0 67%,#ff0 83%,red)}
</style>
