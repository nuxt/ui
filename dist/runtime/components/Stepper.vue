<script>
import theme from "#build/ui/stepper";
</script>

<script setup>
import { computed } from "vue";
import { StepperRoot, StepperItem, StepperTrigger, StepperIndicator, StepperSeparator, StepperTitle, StepperDescription } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useForwardProps } from "../composables/useForwardProps";
import { tv } from "../utils/tv";
import { get } from "../utils";
import UIcon from "./Icon.vue";
const _props = defineProps({
  as: { type: null, required: false },
  items: { type: Array, required: true },
  size: { type: null, required: false },
  color: { type: null, required: false },
  orientation: { type: null, required: false, default: "horizontal" },
  valueKey: { type: null, required: false, default: "value" },
  defaultValue: { type: [String, Number], required: false },
  disabled: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  linear: { type: Boolean, required: false, default: true }
});
const emits = defineEmits(["next", "prev"]);
const slots = defineSlots();
const props = useComponentProps("stepper", _props);
const modelValue = defineModel({ type: [String, Number] });
const appConfig = useAppConfig();
const rootProps = useForwardProps(reactivePick(props, "as", "linear"));
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.stepper || {} })({
  orientation: props.orientation,
  size: props.size,
  color: props.color
}));
const currentStepIndex = computed({
  get() {
    const value = modelValue.value ?? props.defaultValue;
    return (typeof value === "string" ? props.items.findIndex((item) => get(item, props.valueKey) === value) : value) ?? 0;
  },
  set(value) {
    modelValue.value = get(props.items?.[value], props.valueKey) ?? value;
  }
});
const currentStep = computed(() => props.items?.[currentStepIndex.value]);
const hasNext = computed(() => currentStepIndex.value < props.items?.length - 1);
const hasPrev = computed(() => currentStepIndex.value > 0);
defineExpose({
  next() {
    if (hasNext.value) {
      currentStepIndex.value += 1;
      emits("next", currentStep.value);
    }
  },
  prev() {
    if (hasPrev.value) {
      currentStepIndex.value -= 1;
      emits("prev", currentStep.value);
    }
  },
  hasNext,
  hasPrev
});
</script>

<template>
  <StepperRoot v-bind="rootProps" v-model="currentStepIndex" :orientation="props.orientation" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div data-slot="header" :class="ui.header({ class: props.ui?.header })">
      <StepperItem
        v-for="(item, count) in props.items"
        :key="count"
        :step="count"
        :disabled="item.disabled || props.disabled"
        data-slot="item"
        :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class] })"
      >
        <div data-slot="container" :class="ui.container({ class: [props.ui?.container, item.ui?.container] })">
          <StepperTrigger data-slot="trigger" :class="ui.trigger({ class: [props.ui?.trigger, item.ui?.trigger] })">
            <StepperIndicator data-slot="indicator" :class="ui.indicator({ class: [props.ui?.indicator, item.ui?.indicator] })">
              <slot name="indicator" :item="item" :ui="ui">
                <UIcon v-if="item.icon" :name="item.icon" data-slot="icon" :class="ui.icon({ class: [props.ui?.icon, item.ui?.icon] })" />
                <template v-else>
                  {{ count + 1 }}
                </template>
              </slot>
            </StepperIndicator>
          </StepperTrigger>

          <StepperSeparator
            v-if="count < props.items.length - 1"
            data-slot="separator"
            :class="ui.separator({ class: [props.ui?.separator, item.ui?.separator] })"
          />
        </div>

        <div data-slot="wrapper" :class="ui.wrapper({ class: [props.ui?.wrapper, item.ui?.wrapper] })">
          <slot :name="item.slot ? `${item.slot}-wrapper` : 'wrapper'" :item="item">
            <StepperTitle v-if="item.title || !!slots[item.slot ? `${item.slot}-title` : 'title']" as="div" data-slot="title" :class="ui.title({ class: [props.ui?.title, item.ui?.title] })">
              <slot :name="item.slot ? `${item.slot}-title` : 'title'" :item="item">
                {{ item.title }}
              </slot>
            </StepperTitle>
            <StepperDescription v-if="item.description || !!slots[item.slot ? `${item.slot}-description` : 'description']" as="div" data-slot="description" :class="ui.description({ class: [props.ui?.description, item.ui?.description] })">
              <slot :name="item.slot ? `${item.slot}-description` : 'description'" :item="item">
                {{ item.description }}
              </slot>
            </StepperDescription>
          </slot>
        </div>
      </StepperItem>
    </div>

    <div v-if="currentStep?.content || !!slots.content || currentStep?.slot && !!slots[currentStep.slot]" data-slot="content" :class="ui.content({ class: props.ui?.content })">
      <slot
        :name="currentStep?.slot || 'content'"
        :item="currentStep"
      >
        {{ currentStep?.content }}
      </slot>
    </div>
  </StepperRoot>
</template>
