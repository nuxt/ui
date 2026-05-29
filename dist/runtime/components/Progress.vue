<script>
import theme from "#build/ui/progress";
</script>

<script setup>
import { computed } from "vue";
import { Primitive, ProgressRoot, ProgressIndicator } from "reka-ui";
import { useForwardProps } from "../composables/useForwardProps";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useLocale } from "../composables/useLocale";
import { tv } from "../utils/tv";
const _props = defineProps({
  as: { type: null, required: false },
  max: { type: [Number, Array], required: false },
  status: { type: Boolean, required: false },
  inverted: { type: Boolean, required: false, default: false },
  size: { type: null, required: false },
  color: { type: null, required: false },
  orientation: { type: null, required: false, default: "horizontal" },
  animation: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  getValueLabel: { type: Function, required: false },
  getValueText: { type: Function, required: false },
  modelValue: { type: [Number, null], required: false, default: null }
});
const emits = defineEmits(["update:modelValue", "update:max"]);
const slots = defineSlots();
const props = useComponentProps("progress", _props);
const { dir } = useLocale();
const appConfig = useAppConfig();
const rootProps = useForwardProps(reactivePick(props, "getValueLabel", "getValueText", "modelValue"), emits);
const isIndeterminate = computed(() => rootProps.value.modelValue === null);
const hasSteps = computed(() => Array.isArray(props.max));
const realMax = computed(() => {
  if (isIndeterminate.value || !props.max) {
    return void 0;
  }
  if (Array.isArray(props.max)) {
    return props.max.length - 1;
  }
  return Number(props.max);
});
const percent = computed(() => {
  if (isIndeterminate.value) {
    return void 0;
  }
  switch (true) {
    case rootProps.value.modelValue < 0:
      return 0;
    case rootProps.value.modelValue > (realMax.value ?? 100):
      return 100;
    default:
      return Math.round(rootProps.value.modelValue / (realMax.value ?? 100) * 100);
  }
});
const indicatorStyle = computed(() => {
  if (percent.value === void 0) {
    return;
  }
  if (props.orientation === "vertical") {
    return {
      transform: `translateY(${props.inverted ? "" : "-"}${100 - percent.value}%)`
    };
  } else {
    if (dir.value === "rtl") {
      return {
        transform: `translateX(${props.inverted ? "-" : ""}${100 - percent.value}%)`
      };
    } else {
      return {
        transform: `translateX(${props.inverted ? "" : "-"}${100 - percent.value}%)`
      };
    }
  }
});
const statusStyle = computed(() => {
  const value = `${Math.max(percent.value ?? 0, 0)}%`;
  return props.orientation === "vertical" ? { height: value } : { width: value };
});
function isActive(index) {
  return index === Number(props.modelValue);
}
function isFirst(index) {
  return index === 0;
}
function isLast(index) {
  return index === realMax.value;
}
function stepVariant(index) {
  index = Number(index);
  if (isActive(index) && !isFirst(index)) {
    return "active";
  }
  if (isFirst(index) && isActive(index)) {
    return "first";
  }
  if (isLast(index) && isActive(index)) {
    return "last";
  }
  return "other";
}
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.progress || {} })({
  animation: props.animation,
  size: props.size,
  color: props.color,
  orientation: props.orientation,
  inverted: props.inverted
}));
</script>

<template>
  <Primitive :as="props.as" :data-orientation="props.orientation" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="!isIndeterminate && (props.status || !!slots.status)" data-slot="status" :class="ui.status({ class: props.ui?.status })" :style="statusStyle">
      <slot name="status" :percent="percent">
        {{ percent }}%
      </slot>
    </div>

    <ProgressRoot v-bind="rootProps" :max="realMax" data-slot="base" :class="ui.base({ class: props.ui?.base })" style="transform: translateZ(0)">
      <ProgressIndicator data-slot="indicator" :class="ui.indicator({ class: props.ui?.indicator })" :style="indicatorStyle" />
    </ProgressRoot>

    <div v-if="hasSteps" data-slot="steps" :class="ui.steps({ class: props.ui?.steps })">
      <div v-for="(step, index) in props.max" :key="index" data-slot="step" :class="ui.step({ class: props.ui?.step, step: stepVariant(index) })">
        <slot :name="`step-${index}`" :step="step">
          {{ step }}
        </slot>
      </div>
    </div>
  </Primitive>
</template>
