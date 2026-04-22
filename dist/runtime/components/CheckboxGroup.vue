<script>
import theme from "#build/ui/checkbox-group";
</script>

<script setup>
import { computed, useId } from "vue";
import { CheckboxGroupRoot, useForwardProps, useForwardPropsEmits } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useFormField } from "../composables/useFormField";
import { get, omit } from "../utils";
import { tv } from "../utils/tv";
import UCheckbox from "./Checkbox.vue";
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
  orientation: { type: null, required: false, default: "vertical" },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  disabled: { type: Boolean, required: false },
  loop: { type: Boolean, required: false },
  name: { type: String, required: false },
  required: { type: Boolean, required: false },
  color: { type: null, required: false },
  indicator: { type: null, required: false },
  icon: { type: null, required: false }
});
const emits = defineEmits(["change", "update:modelValue"]);
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("checkboxGroup", props);
const rootProps = useForwardPropsEmits(reactivePick(props, "as", "modelValue", "defaultValue", "orientation", "loop", "required"), emits);
const checkboxProps = useForwardProps(reactivePick(props, "variant", "indicator", "icon"));
const getProxySlots = () => omit(slots, ["legend"]);
const { emitFormChange, emitFormInput, color, name, size, id: _id, disabled, ariaAttrs } = useFormField(props, { bind: false });
const id = _id.value ?? useId();
const ui = computed(() => tv({ extend: theme, ...appConfig.ui?.checkboxGroup || {} })({
  size: size.value,
  required: props.required,
  orientation: props.orientation,
  color: props.color,
  variant: props.variant,
  disabled: disabled.value
}));
function normalizeItem(item) {
  if (item === null) {
    return {
      id: `${id}:null`,
      value: void 0,
      label: void 0
    };
  }
  if (typeof item === "string" || typeof item === "number") {
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
  <CheckboxGroupRoot
    :id="id"
    v-bind="rootProps"
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

      <UCheckbox
        v-for="item in normalizedItems"
        :key="item.value"
        v-bind="{ ...item, ...checkboxProps }"
        :color="color"
        :size="size"
        :name="name"
        :disabled="item.disabled || disabled"
        :ui="{ ...uiProp ? omit(uiProp, ['root']) : void 0, ...item.ui || {} }"
        data-slot="item"
        :class="ui.item({ class: [uiProp?.item, item.ui?.item, item.class], disabled: item.disabled || disabled })"
      >
        <template v-for="(_, name) in getProxySlots()" #[name]>
          <slot :name="name" :item="item" />
        </template>
      </UCheckbox>
    </fieldset>
  </CheckboxGroupRoot>
</template>
