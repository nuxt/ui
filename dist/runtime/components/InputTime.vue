<script>
import theme from "#build/ui/input-time";
</script>

<script setup>
import { computed, onMounted, ref } from "vue";
import { TimeRangeFieldRoot, TimeRangeFieldInput, useForwardPropsEmits } from "reka-ui";
import { TimeField as SingleTimeField } from "reka-ui/namespaced";
import { reactiveOmit, createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useFieldGroup } from "../composables/useFieldGroup";
import { useComponentIcons } from "../composables/useComponentIcons";
import { useFormField } from "../composables/useFormField";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
import UAvatar from "./Avatar.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  highlight: { type: Boolean, required: false },
  fixed: { type: Boolean, required: false },
  autofocus: { type: Boolean, required: false },
  autofocusDelay: { type: Number, required: false, default: 0 },
  separatorIcon: { type: null, required: false },
  range: { type: Boolean, required: false },
  defaultValue: { type: null, required: false },
  modelValue: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  icon: { type: null, required: false },
  avatar: { type: Object, required: false },
  leading: { type: Boolean, required: false },
  leadingIcon: { type: null, required: false },
  trailing: { type: Boolean, required: false },
  trailingIcon: { type: null, required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: null, required: false },
  defaultPlaceholder: { type: Object, required: false },
  placeholder: { type: Object, required: false },
  hourCycle: { type: null, required: false },
  step: { type: Object, required: false },
  stepSnapping: { type: Boolean, required: false },
  granularity: { type: String, required: false },
  hideTimeZone: { type: Boolean, required: false },
  maxValue: { type: Object, required: false },
  minValue: { type: Object, required: false },
  disabled: { type: Boolean, required: false },
  readonly: { type: Boolean, required: false },
  id: { type: String, required: false },
  name: { type: String, required: false },
  required: { type: Boolean, required: false },
  isTimeUnavailable: { type: Function, required: false }
});
const emits = defineEmits(["update:modelValue", "change", "blur", "focus", "update:placeholder"]);
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("inputTime", props);
const rootProps = useForwardPropsEmits(reactiveOmit(props, "id", "name", "range", "modelValue", "defaultValue", "color", "variant", "size", "highlight", "fixed", "disabled", "autofocus", "autofocusDelay", "icon", "avatar", "leading", "leadingIcon", "trailing", "trailingIcon", "loading", "loadingIcon", "separatorIcon", "class", "ui"), emits);
const { emitFormBlur, emitFormFocus, emitFormChange, emitFormInput, id, color, size: formFieldSize, name, highlight, disabled, ariaAttrs } = useFormField(props);
const { orientation, size: fieldGroupSize } = useFieldGroup(props);
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
const inputSize = computed(() => fieldGroupSize.value || formFieldSize.value);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.inputTime || {} })({
  color: color.value,
  variant: props.variant,
  size: inputSize.value,
  loading: props.loading,
  highlight: highlight.value,
  fixed: props.fixed,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  fieldGroup: orientation.value
}));
const [DefineSegmentsTemplate, ReuseSegmentsTemplate] = createReusableTemplate();
const inputsRef = ref([]);
const RangeTimeField = { Root: TimeRangeFieldRoot, Input: TimeRangeFieldInput };
const TimeField = computed(() => props.range ? RangeTimeField : SingleTimeField);
function setInputRef(index, el) {
  inputsRef.value[index] = el;
}
function onUpdate(value) {
  const event = new Event("change", { target: { value } });
  emits("change", event);
  emitFormChange();
  emitFormInput();
}
function onBlur(event) {
  emitFormBlur();
  emits("blur", event);
}
function onFocus(event) {
  emitFormFocus();
  emits("focus", event);
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
  <DefineSegmentsTemplate v-slot="{ segments, type }">
    <TimeField.Input
      v-for="(segment, index) in segments"
      :key="`${segment.part}-${index}`"
      :ref="(el) => setInputRef(index, el)"
      :type="type"
      :part="segment.part"
      data-slot="segment"
      :class="ui.segment({ class: uiProp?.segment })"
      :data-segment="segment.part"
    >
      {{ segment.value.trim() }}
    </TimeField.Input>
  </DefineSegmentsTemplate>

  <TimeField.Root
    v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
    :id="id"
    v-slot="{ segments }"
    :name="name"
    :disabled="disabled"
    :model-value="modelValue"
    :default-value="defaultValue"
    data-slot="base"
    :class="ui.base({ class: [uiProp?.base, props.class] })"
    @update:model-value="onUpdate"
    @blur="onBlur"
    @focus="onFocus"
  >
    <template v-if="Array.isArray(segments)">
      <ReuseSegmentsTemplate :segments="segments" />
    </template>
    <template v-else>
      <ReuseSegmentsTemplate :segments="segments.start" type="start" />
      <slot name="separator" :ui="ui">
        <UIcon :name="separatorIcon || appConfig.ui.icons.minus" data-slot="separatorIcon" :class="ui.separatorIcon({ class: uiProp?.separatorIcon })" />
      </slot>
      <ReuseSegmentsTemplate :segments="segments.end" type="end" />
    </template>

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
  </TimeField.Root>
</template>
