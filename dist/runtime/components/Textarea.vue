<script>
import theme from "#build/ui/textarea";
</script>

<script setup>
import { useTemplateRef, computed, onMounted, nextTick, watch } from "vue";
import { Primitive } from "reka-ui";
import { useVModel } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useComponentIcons } from "../composables/useComponentIcons";
import { useFormField } from "../composables/useFormField";
import { looseToNumber } from "../utils";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
import UAvatar from "./Avatar.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  id: { type: String, required: false },
  name: { type: String, required: false },
  placeholder: { type: String, required: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  required: { type: Boolean, required: false },
  autofocus: { type: Boolean, required: false },
  autofocusDelay: { type: Number, required: false, default: 0 },
  autoresize: { type: Boolean, required: false },
  autoresizeDelay: { type: Number, required: false, default: 0 },
  disabled: { type: Boolean, required: false },
  rows: { type: Number, required: false, default: 3 },
  maxrows: { type: Number, required: false, default: 0 },
  highlight: { type: Boolean, required: false },
  fixed: { type: Boolean, required: false },
  defaultValue: { type: null, required: false },
  modelValue: { type: null, required: false },
  modelModifiers: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  icon: { type: null, required: false },
  avatar: { type: Object, required: false },
  leading: { type: Boolean, required: false },
  leadingIcon: { type: null, required: false },
  trailing: { type: Boolean, required: false },
  trailingIcon: { type: null, required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: null, required: false }
});
const emits = defineEmits(["update:modelValue", "blur", "change"]);
const slots = defineSlots();
const modelValue = useVModel(props, "modelValue", emits, { defaultValue: props.defaultValue });
const appConfig = useAppConfig();
const uiProp = useComponentUI("textarea", props);
const { emitFormFocus, emitFormBlur, emitFormInput, emitFormChange, size, color, id, name, highlight, disabled, ariaAttrs } = useFormField(props, { deferInputValidation: true });
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.textarea || {} })({
  color: color.value,
  variant: props.variant,
  size: size?.value,
  loading: props.loading,
  highlight: highlight.value,
  fixed: props.fixed,
  autoresize: props.autoresize,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing
}));
const textareaRef = useTemplateRef("textareaRef");
function updateInput(value) {
  if (props.modelModifiers?.trim && (typeof value === "string" || value === null || value === void 0)) {
    value = value?.trim() ?? null;
  }
  if (props.modelModifiers?.number) {
    value = looseToNumber(value);
  }
  if (props.modelModifiers?.nullable) {
    value ||= null;
  }
  if (props.modelModifiers?.optional && !props.modelModifiers?.nullable && value !== null) {
    value ||= void 0;
  }
  modelValue.value = value;
  emitFormInput();
}
function onInput(event) {
  autoResize();
  if (!props.modelModifiers?.lazy) {
    updateInput(event.target.value);
  }
}
function onChange(event) {
  const value = event.target.value;
  if (props.modelModifiers?.lazy) {
    updateInput(value);
  }
  if (props.modelModifiers?.trim) {
    event.target.value = value.trim();
  }
  emitFormChange();
  emits("change", event);
}
function onBlur(event) {
  emitFormBlur();
  emits("blur", event);
}
function autoFocus() {
  if (props.autofocus) {
    textareaRef.value?.focus();
  }
}
function autoResize() {
  if (props.autoresize && textareaRef.value) {
    textareaRef.value.rows = props.rows;
    const overflow = textareaRef.value.style.overflow;
    textareaRef.value.style.overflow = "hidden";
    const styles = window.getComputedStyle(textareaRef.value);
    const paddingTop = Number.parseInt(styles.paddingTop);
    const paddingBottom = Number.parseInt(styles.paddingBottom);
    const padding = paddingTop + paddingBottom;
    const lineHeight = Number.parseInt(styles.lineHeight);
    const { scrollHeight } = textareaRef.value;
    const newRows = (scrollHeight - padding) / lineHeight;
    if (newRows > props.rows) {
      textareaRef.value.rows = props.maxrows ? Math.min(newRows, props.maxrows) : newRows;
    }
    textareaRef.value.style.overflow = overflow;
  }
}
watch(modelValue, () => {
  nextTick(autoResize);
});
onMounted(() => {
  setTimeout(() => {
    autoFocus();
  }, props.autofocusDelay);
  setTimeout(() => {
    autoResize();
  }, props.autoresizeDelay);
});
defineExpose({
  textareaRef,
  autoResize
});
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <textarea
      :id="id"
      ref="textareaRef"
      :value="modelValue"
      :name="name"
      :rows="rows"
      :placeholder="placeholder"
      data-slot="base"
      :class="ui.base({ class: uiProp?.base })"
      :disabled="disabled"
      :required="required"
      v-bind="{ ...$attrs, ...ariaAttrs }"
      @input="onInput"
      @blur="onBlur"
      @change="onChange"
      @focus="emitFormFocus"
    />

    <slot :ui="ui" />

    <span v-if="isLeading || !!avatar || !!slots.leading" data-slot="leading" :class="ui.leading({ class: uiProp?.leading })">
      <slot name="leading" :ui="ui">
        <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon" :class="ui.leadingIcon({ class: uiProp?.leadingIcon })" />
        <UAvatar v-else-if="!!avatar" :size="uiProp?.leadingAvatarSize || ui.leadingAvatarSize()" v-bind="avatar" data-slot="leadingAvatar" :class="ui.leadingAvatar({ class: uiProp?.leadingAvatar })" />
      </slot>
    </span>

    <span v-if="isTrailing || !!slots.trailing" data-slot="trailing" :class="ui.trailing({ class: uiProp?.trailing })">
      <slot name="trailing" :ui="ui">
        <UIcon v-if="trailingIconName" :name="trailingIconName" data-slot="trailingIcon" :class="ui.trailingIcon({ class: uiProp?.trailingIcon })" />
      </slot>
    </span>
  </Primitive>
</template>
