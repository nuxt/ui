<script>
import theme from "#build/ui/pin-input";
</script>

<script setup>
import { ref, computed, onMounted } from "vue";
import { PinInputInput, PinInputRoot, useForwardPropsEmits } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useFormField } from "../composables/useFormField";
import { looseToNumber } from "../utils";
import { tv } from "../utils/tv";
const props = defineProps({
  as: { type: null, required: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  length: { type: [Number, String], required: false, default: 5 },
  autofocus: { type: Boolean, required: false },
  autofocusDelay: { type: Number, required: false, default: 0 },
  highlight: { type: Boolean, required: false },
  fixed: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  defaultValue: { type: null, required: false },
  disabled: { type: Boolean, required: false },
  id: { type: String, required: false },
  mask: { type: Boolean, required: false },
  modelValue: { type: null, required: false },
  name: { type: String, required: false },
  otp: { type: Boolean, required: false },
  placeholder: { type: String, required: false },
  required: { type: Boolean, required: false },
  type: { type: null, required: false, default: "text" }
});
const emits = defineEmits(["update:modelValue", "complete", "change", "blur"]);
const appConfig = useAppConfig();
const uiProp = useComponentUI("pinInput", props);
const rootProps = useForwardPropsEmits(reactivePick(props, "disabled", "id", "mask", "name", "otp", "required", "type"), emits);
const { emitFormInput, emitFormFocus, emitFormChange, emitFormBlur, size, color, id, name, highlight, disabled, ariaAttrs } = useFormField(props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pinInput || {} })({
  color: color.value,
  variant: props.variant,
  size: size.value,
  highlight: highlight.value,
  fixed: props.fixed
}));
const inputsRef = ref([]);
function setInputRef(index, el) {
  inputsRef.value[index] = el;
}
const completed = ref(false);
function onComplete(value) {
  const event = new Event("change", { target: { value } });
  emits("change", event);
  emitFormChange();
}
function onBlur(event) {
  if (!event.relatedTarget || completed.value) {
    emits("blur", event);
    emitFormBlur();
  }
}
function autoFocus() {
  if (props.autofocus) {
    inputsRef.value[0]?.$el?.focus();
  }
}
onMounted(() => {
  setTimeout(() => {
    autoFocus();
  }, props.autofocusDelay);
});
defineExpose({
  inputsRef
});
</script>

<template>
  <PinInputRoot
    v-bind="{ ...rootProps, ...ariaAttrs }"
    :id="id"
    :name="name"
    :placeholder="placeholder"
    :model-value="modelValue"
    :default-value="defaultValue"
    data-slot="root"
    :class="ui.root({ class: [uiProp?.root, props.class] })"
    @update:model-value="emitFormInput()"
    @complete="onComplete"
  >
    <PinInputInput
      v-for="(ids, index) in looseToNumber(props.length)"
      :key="ids"
      :ref="(el) => setInputRef(index, el)"
      :index="index"
      data-slot="base"
      :class="ui.base({ class: uiProp?.base })"
      :disabled="disabled"
      @blur="onBlur"
      @focus="emitFormFocus"
    />
  </PinInputRoot>
</template>
