<script>
import theme from "#build/ui/radio-group";
</script>

<script setup>
import { computed, useId } from "vue";
import { RadioGroupRoot, RadioGroupItem as RRadioGroupItem, RadioGroupIndicator, Label, useForwardPropsEmits } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useResolvedVariants } from "../composables/useResolvedVariants";
import { useFormField } from "../composables/useFormField";
import { get } from "../utils";
import { tv } from "../utils/tv";
const props = defineProps({
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
const appConfig = useAppConfig();
const uiProp = useComponentUI("radioGroup", props);
const rootProps = useForwardPropsEmits(reactivePick(props, "as", "loop", "required"), emits);
const { emitFormChange, emitFormInput, color, name, size, id: _id, disabled, ariaAttrs } = useFormField(props, { bind: false });
const id = _id.value ?? useId();
const { variant } = useResolvedVariants("radioGroup", props, theme, ["variant"]);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.radioGroup || {} })({
  size: size.value,
  color: color.value,
  disabled: disabled.value,
  required: props.required,
  orientation: props.orientation,
  variant: variant.value,
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
    :model-value="modelValue"
    :default-value="defaultValue"
    :orientation="orientation"
    :name="name"
    :disabled="disabled"
    data-slot="root"
    :class="ui.root({ class: [uiProp?.root, props.class] })"
    @update:model-value="onUpdate"
  >
    <fieldset data-slot="fieldset" :class="ui.fieldset({ class: uiProp?.fieldset })" v-bind="ariaAttrs">
      <legend v-if="legend || !!slots.legend" data-slot="legend" :class="ui.legend({ class: uiProp?.legend })">
        <slot name="legend">
          {{ legend }}
        </slot>
      </legend>

      <component :is="variant === 'list' ? 'div' : Label" v-for="item in normalizedItems" :key="item.value" data-slot="item" :class="ui.item({ class: [uiProp?.item, item.ui?.item, item.class], disabled: item.disabled || disabled })">
        <div data-slot="container" :class="ui.container({ class: [uiProp?.container, item.ui?.container] })">
          <RRadioGroupItem
            :id="item.id"
            :value="item.value"
            :disabled="item.disabled || disabled"
            data-slot="base"
            :class="ui.base({ class: [uiProp?.base, item.ui?.base], disabled: item.disabled || disabled })"
          >
            <RadioGroupIndicator data-slot="indicator" :class="ui.indicator({ class: [uiProp?.indicator, item.ui?.indicator] })" />
          </RRadioGroupItem>
        </div>

        <div v-if="item.label || !!slots.label || (item.description || !!slots.description)" data-slot="wrapper" :class="ui.wrapper({ class: [uiProp?.wrapper, item.ui?.wrapper] })">
          <component :is="variant === 'list' ? Label : 'p'" v-if="item.label || !!slots.label" :for="item.id" data-slot="label" :class="ui.label({ class: [uiProp?.label, item.ui?.label], disabled: item.disabled || disabled })">
            <slot name="label" :item="item" :model-value="modelValue">
              {{ item.label }}
            </slot>
          </component>
          <p v-if="item.description || !!slots.description" data-slot="description" :class="ui.description({ class: [uiProp?.description, item.ui?.description], disabled: item.disabled || disabled })">
            <slot name="description" :item="item" :model-value="modelValue">
              {{ item.description }}
            </slot>
          </p>
        </div>
      </component>
    </fieldset>
  </RadioGroupRoot>
</template>
