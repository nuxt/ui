<script>
import theme from "#build/ui/input-tags";
</script>

<script setup>
import { computed, useTemplateRef, onMounted, toRaw, toRef } from "vue";
import { TagsInputRoot, TagsInputItem, TagsInputItemText, TagsInputItemDelete, TagsInputInput, useForwardPropsEmits } from "reka-ui";
import { reactivePick } from "@vueuse/core";
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
  placeholder: { type: String, required: false },
  maxLength: { type: Number, required: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  autofocus: { type: Boolean, required: false },
  autofocusDelay: { type: Number, required: false, default: 0 },
  deleteIcon: { type: null, required: false },
  highlight: { type: Boolean, required: false },
  fixed: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  modelValue: { type: [Array, null], required: false },
  defaultValue: { type: Array, required: false },
  addOnPaste: { type: Boolean, required: false },
  addOnTab: { type: Boolean, required: false },
  addOnBlur: { type: Boolean, required: false },
  duplicate: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false },
  delimiter: { type: null, required: false },
  max: { type: Number, required: false },
  id: { type: String, required: false },
  convertValue: { type: Function, required: false },
  displayValue: { type: Function, required: false },
  name: { type: String, required: false },
  required: { type: Boolean, required: false },
  icon: { type: null, required: false },
  avatar: { type: Object, required: false },
  leading: { type: Boolean, required: false },
  leadingIcon: { type: null, required: false },
  trailing: { type: Boolean, required: false },
  trailingIcon: { type: null, required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: null, required: false }
});
const emits = defineEmits(["change", "blur", "focus", "update:modelValue", "invalid", "addTag", "removeTag"]);
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("inputTags", props);
const rootProps = useForwardPropsEmits(reactivePick(props, "as", "addOnPaste", "addOnTab", "addOnBlur", "duplicate", "delimiter", "max", "convertValue", "displayValue", "required"), emits);
const { emitFormBlur, emitFormFocus, emitFormChange, emitFormInput, size: formFieldSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField(props);
const { orientation, size: fieldGroupSize } = useFieldGroup(props);
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
const inputSize = computed(() => fieldGroupSize.value || formFieldSize.value);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.inputTags || {} })({
  color: color.value,
  variant: props.variant,
  size: inputSize?.value,
  loading: props.loading,
  highlight: highlight.value,
  fixed: props.fixed,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  fieldGroup: orientation.value
}));
const inputRef = useTemplateRef("inputRef");
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
function onUpdate(value) {
  if (toRaw(props.modelValue) === value) {
    return;
  }
  const event = new Event("change", { target: { value } });
  emits("change", event);
  emitFormChange();
  emitFormInput();
}
function onBlur(event) {
  emits("blur", event);
  emitFormBlur();
}
function onFocus(event) {
  emits("focus", event);
  emitFormFocus();
}
defineExpose({
  inputRef: toRef(() => inputRef.value?.$el)
});
</script>

<template>
  <TagsInputRoot
    :id="id"
    v-slot="{ modelValue: tags }"
    :model-value="modelValue"
    :default-value="defaultValue"
    data-slot="root"
    :class="ui.root({ class: [ui.base({ class: uiProp?.base }), uiProp?.root, props.class] })"
    v-bind="rootProps"
    :name="name"
    :disabled="disabled"
    @update:model-value="onUpdate"
  >
    <TagsInputItem
      v-for="(item, index) in tags"
      :key="index"
      :value="item"
      data-slot="item"
      :class="ui.item({ class: [uiProp?.item] })"
    >
      <TagsInputItemText data-slot="itemText" :class="ui.itemText({ class: [uiProp?.itemText] })">
        <slot v-if="!!slots['item-text']" name="item-text" :item="item" :index="index" :ui="ui" />
      </TagsInputItemText>

      <TagsInputItemDelete
        data-slot="itemDelete"
        :class="ui.itemDelete({ class: [uiProp?.itemDelete] })"
        :disabled="disabled"
      >
        <slot name="item-delete" :item="item" :index="index" :ui="ui">
          <UIcon :name="deleteIcon || appConfig.ui.icons.close" data-slot="itemDeleteIcon" :class="ui.itemDeleteIcon({ class: [uiProp?.itemDeleteIcon] })" />
        </slot>
      </TagsInputItemDelete>
    </TagsInputItem>

    <TagsInputInput
      ref="inputRef"
      v-bind="{ ...$attrs, ...ariaAttrs }"
      :placeholder="placeholder"
      :max-length="maxLength"
      data-slot="input"
      :class="ui.input({ class: uiProp?.input })"
      @blur="onBlur"
      @focus="onFocus"
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
  </TagsInputRoot>
</template>
