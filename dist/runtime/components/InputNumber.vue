<script>
import theme from "#build/ui/input-number";
</script>

<script setup>
import { onMounted, computed, useTemplateRef, toRef } from "vue";
import { NumberFieldRoot, NumberFieldInput, NumberFieldDecrement, NumberFieldIncrement, useForwardPropsEmits } from "reka-ui";
import { reactivePick, useVModel } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useFieldGroup } from "../composables/useFieldGroup";
import { useFormField } from "../composables/useFormField";
import { useLocale } from "../composables/useLocale";
import { tv } from "../utils/tv";
import UButton from "./Button.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  placeholder: { type: String, required: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  highlight: { type: Boolean, required: false },
  fixed: { type: Boolean, required: false },
  orientation: { type: null, required: false, default: "horizontal" },
  increment: { type: [Boolean, Object], required: false, default: true },
  incrementIcon: { type: null, required: false },
  incrementDisabled: { type: Boolean, required: false },
  decrement: { type: [Boolean, Object], required: false, default: true },
  decrementIcon: { type: null, required: false },
  decrementDisabled: { type: Boolean, required: false },
  autofocus: { type: Boolean, required: false },
  autofocusDelay: { type: Number, required: false },
  defaultValue: { type: null, required: false },
  modelValue: { type: null, required: false },
  modelModifiers: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  min: { type: Number, required: false },
  max: { type: Number, required: false },
  step: { type: Number, required: false },
  stepSnapping: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false },
  required: { type: Boolean, required: false },
  id: { type: String, required: false },
  name: { type: String, required: false },
  formatOptions: { type: null, required: false },
  disableWheelChange: { type: Boolean, required: false },
  invertWheelChange: { type: Boolean, required: false },
  readonly: { type: Boolean, required: false },
  focusOnChange: { type: Boolean, required: false }
});
const emits = defineEmits(["update:modelValue", "blur", "change"]);
defineSlots();
const modelValue = useVModel(props, "modelValue", emits, { defaultValue: props.defaultValue });
const { t } = useLocale();
const appConfig = useAppConfig();
const uiProp = useComponentUI("inputNumber", props);
const rootProps = useForwardPropsEmits(reactivePick(props, "as", "stepSnapping", "formatOptions", "disableWheelChange", "invertWheelChange", "required", "readonly", "focusOnChange"), emits);
const { emitFormBlur, emitFormFocus, emitFormChange, emitFormInput, id, color, size: formFieldSize, name, highlight, disabled, ariaAttrs } = useFormField(props);
const { orientation, size: fieldGroupSize } = useFieldGroup(props);
const inputSize = computed(() => fieldGroupSize.value || formFieldSize.value);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.inputNumber || {} })({
  color: color.value,
  variant: props.variant,
  size: inputSize.value,
  highlight: highlight.value,
  fixed: props.fixed,
  orientation: props.orientation,
  fieldGroup: orientation.value,
  increment: props.orientation === "vertical" ? !!props.increment || !!props.decrement : !!props.increment,
  decrement: props.orientation === "vertical" ? false : !!props.decrement
}));
const incrementIcon = computed(() => props.incrementIcon || (props.orientation === "horizontal" ? appConfig.ui.icons.plus : appConfig.ui.icons.chevronUp));
const decrementIcon = computed(() => props.decrementIcon || (props.orientation === "horizontal" ? appConfig.ui.icons.minus : appConfig.ui.icons.chevronDown));
const inputRef = useTemplateRef("inputRef");
function onUpdate(value) {
  if (props.modelModifiers?.optional) {
    modelValue.value = value = value ?? void 0;
  }
  const event = new Event("change", { target: { value } });
  emits("change", event);
  emitFormChange();
  emitFormInput();
}
function onBlur(event) {
  emitFormBlur();
  emits("blur", event);
}
function autoFocus() {
  if (props.autofocus) {
    inputRef.value?.$el?.focus();
  }
}
onMounted(() => {
  setTimeout(() => {
    autoFocus();
  }, props.autofocusDelay);
});
defineExpose({
  inputRef: toRef(() => inputRef.value?.$el)
});
</script>

<template>
  <NumberFieldRoot
    v-bind="rootProps"
    :id="id"
    :default-value="defaultValue"
    :model-value="modelValue"
    :min="min"
    :max="max"
    :step="step"
    data-slot="root"
    :class="ui.root({ class: [uiProp?.root, props.class] })"
    :name="name"
    :disabled="disabled"
    @update:model-value="(val) => onUpdate(val)"
  >
    <NumberFieldInput
      v-bind="{ ...$attrs, ...ariaAttrs }"
      ref="inputRef"
      :placeholder="placeholder"
      :required="required"
      data-slot="base"
      :class="ui.base({ class: uiProp?.base })"
      @blur="onBlur"
      @focus="emitFormFocus"
    />

    <div v-if="!!increment" data-slot="increment" :class="ui.increment({ class: uiProp?.increment })">
      <NumberFieldIncrement as-child :disabled="disabled || incrementDisabled">
        <slot name="increment">
          <UButton
            :icon="incrementIcon"
            :color="color"
            :size="inputSize"
            variant="link"
            :aria-label="t('inputNumber.increment')"
            v-bind="typeof increment === 'object' ? increment : void 0"
          />
        </slot>
      </NumberFieldIncrement>
    </div>

    <div v-if="!!decrement" data-slot="decrement" :class="ui.decrement({ class: uiProp?.decrement })">
      <NumberFieldDecrement as-child :disabled="disabled || decrementDisabled">
        <slot name="decrement">
          <UButton
            :icon="decrementIcon"
            :color="color"
            :size="inputSize"
            variant="link"
            :aria-label="t('inputNumber.decrement')"
            v-bind="typeof decrement === 'object' ? decrement : void 0"
          />
        </slot>
      </NumberFieldDecrement>
    </div>
  </NumberFieldRoot>
</template>
