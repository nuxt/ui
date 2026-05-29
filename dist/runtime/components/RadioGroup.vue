<script>
import theme from "#build/ui/radio-group";
</script>

<script setup>
import { computed, useId } from "vue";
import { RadioGroupRoot, RadioGroupItem as RRadioGroupItem, RadioGroupIndicator, Label } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useForwardProps } from "../composables/useForwardProps";
import { useFormField } from "../composables/useFormField";
import { get } from "../utils";
import { tv } from "../utils/tv";
const _props = defineProps({
  as: { type: null, required: false },
  legend: { type: String, required: false },
  valueKey: { type: null, required: false, default: "value" },
  labelKey: { type: null, required: false, default: "label" },
  descriptionKey: { type: null, required: false, default: "description" },
  items: { type: null, required: false },
  modelValue: { type: null, required: false },
  defaultValue: { type: null, required: false },
  size: { type: null, required: false },
  variant: { type: null, required: false },
  color: { type: null, required: false },
  highlight: { type: Boolean, required: false },
  orientation: { type: null, required: false, default: "vertical" },
  indicator: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  disabled: { type: Boolean, required: false },
  loop: { type: Boolean, required: false },
  name: { type: String, required: false },
  required: { type: Boolean, required: false }
});
const emits = defineEmits(["change", "update:modelValue"]);
const slots = defineSlots();
const props = useComponentProps("radioGroup", _props);
const appConfig = useAppConfig();
const rootProps = useForwardProps(reactivePick(props, "as", "loop", "required"), emits);
const { emitFormChange, emitFormInput, color, name, size, highlight, id: _id, disabled, ariaAttrs } = useFormField(_props, { bind: false });
const id = _id.value ?? useId();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.radioGroup || {} })({
  size: size.value ?? props.size,
  color: color.value ?? props.color,
  highlight: highlight.value ?? props.highlight,
  disabled: disabled.value,
  required: props.required,
  orientation: props.orientation,
  variant: props.variant,
  indicator: props.indicator
}));
function normalizeItem(item) {
  if (item === null) {
    return {
      id: `${id}:null`,
      value: void 0,
      label: void 0
    };
  }
  if (typeof item === "string" || typeof item === "number" || typeof item === "bigint") {
    return {
      id: `${id}:${item}`,
      value: String(item),
      label: String(item)
    };
  }
  const value = get(item, props.valueKey);
  const label = get(item, props.labelKey);
  const description = get(item, props.descriptionKey);
  return {
    ...item,
    value,
    label,
    description,
    id: `${id}:${value}`
  };
}
const normalizedItems = computed(() => {
  if (!props.items) {
    return [];
  }
  return props.items.map(normalizeItem);
});
function onUpdate(value) {
  const event = new Event("change", { target: { value } });
  emits("change", event);
  emitFormChange();
  emitFormInput();
}
</script>

<template>
  <RadioGroupRoot
    :id="id"
    v-bind="rootProps"
    :model-value="props.modelValue"
    :default-value="props.defaultValue"
    :orientation="props.orientation"
    :name="name"
    :disabled="disabled"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @update:model-value="onUpdate"
  >
    <fieldset data-slot="fieldset" :class="ui.fieldset({ class: props.ui?.fieldset })" v-bind="ariaAttrs">
      <legend v-if="props.legend || !!slots.legend" data-slot="legend" :class="ui.legend({ class: props.ui?.legend })">
        <slot name="legend">
          {{ props.legend }}
        </slot>
      </legend>

      <component :is="!props.variant || props.variant === 'list' ? 'div' : Label" v-for="item in normalizedItems" :key="item.value" data-slot="item" :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class], disabled: item.disabled || disabled })">
        <div data-slot="container" :class="ui.container({ class: [props.ui?.container, item.ui?.container] })">
          <RRadioGroupItem
            :id="item.id"
            :value="item.value"
            :disabled="item.disabled || disabled"
            data-slot="base"
            :class="ui.base({ class: [props.ui?.base, item.ui?.base], disabled: item.disabled || disabled })"
          >
            <RadioGroupIndicator data-slot="indicator" :class="ui.indicator({ class: [props.ui?.indicator, item.ui?.indicator] })" />
          </RRadioGroupItem>
        </div>

        <div v-if="item.label || !!slots.label || (item.description || !!slots.description)" data-slot="wrapper" :class="ui.wrapper({ class: [props.ui?.wrapper, item.ui?.wrapper] })">
          <component :is="!props.variant || props.variant === 'list' ? Label : 'p'" v-if="item.label || !!slots.label" :for="item.id" data-slot="label" :class="ui.label({ class: [props.ui?.label, item.ui?.label], disabled: item.disabled || disabled })">
            <slot name="label" :item="item" :model-value="props.modelValue">
              {{ item.label }}
            </slot>
          </component>
          <p v-if="item.description || !!slots.description" data-slot="description" :class="ui.description({ class: [props.ui?.description, item.ui?.description], disabled: item.disabled || disabled })">
            <slot name="description" :item="item" :model-value="props.modelValue">
              {{ item.description }}
            </slot>
          </p>
        </div>
      </component>
    </fieldset>
  </RadioGroupRoot>
</template>
