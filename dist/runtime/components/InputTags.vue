<script>
import theme from "#build/ui/input-tags";
</script>

<script setup>
import { computed, useTemplateRef, onMounted, toRaw, toRef } from "vue";
import { TagsInputRoot, TagsInputItem, TagsInputItemText, TagsInputItemDelete, TagsInputInput } from "reka-ui";
import { useForwardProps } from "../composables/useForwardProps";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useFieldGroup } from "../composables/useFieldGroup";
import { useComponentIcons } from "../composables/useComponentIcons";
import { useFormField } from "../composables/useFormField";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
import UAvatar from "./Avatar.vue";
defineOptions({ inheritAttrs: false });
const _props = defineProps({
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
const props = useComponentProps("inputTags", _props);
const appConfig = useAppConfig();
const rootProps = useForwardProps(reactivePick(props, "as", "addOnPaste", "addOnTab", "addOnBlur", "duplicate", "delimiter", "max", "convertValue", "displayValue", "required"), emits);
const { emitFormBlur, emitFormFocus, emitFormChange, emitFormInput, size: formFieldSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField(_props);
const { orientation, size: fieldGroupSize } = useFieldGroup(_props);
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
const inputSize = computed(() => fieldGroupSize.value || formFieldSize.value);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.inputTags || {} })({
  color: color.value ?? props.color,
  variant: props.variant,
  size: inputSize?.value ?? props.size,
  loading: props.loading,
  highlight: highlight.value ?? props.highlight,
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
    :model-value="props.modelValue"
    :default-value="props.defaultValue"
    data-slot="root"
    :class="ui.root({ class: [ui.base({ class: props.ui?.base }), props.ui?.root, props.class] })"
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
      :class="ui.item({ class: [props.ui?.item] })"
    >
      <TagsInputItemText data-slot="itemText" :class="ui.itemText({ class: [props.ui?.itemText] })">
        <slot v-if="!!slots['item-text']" name="item-text" :item="item" :index="index" :ui="ui" />
      </TagsInputItemText>

      <TagsInputItemDelete
        data-slot="itemDelete"
        :class="ui.itemDelete({ class: [props.ui?.itemDelete] })"
        :disabled="disabled"
      >
        <slot name="item-delete" :item="item" :index="index" :ui="ui">
          <UIcon :name="props.deleteIcon || appConfig.ui.icons.close" data-slot="itemDeleteIcon" :class="ui.itemDeleteIcon({ class: [props.ui?.itemDeleteIcon] })" />
        </slot>
      </TagsInputItemDelete>
    </TagsInputItem>

    <TagsInputInput
      ref="inputRef"
      v-bind="{ ...$attrs, ...ariaAttrs }"
      :placeholder="props.placeholder"
      :max-length="props.maxLength"
      data-slot="input"
      :class="ui.input({ class: props.ui?.input })"
      @blur="onBlur"
      @focus="onFocus"
    />

    <slot :ui="ui" />

    <span v-if="isLeading || !!props.avatar || !!slots.leading" data-slot="leading" :class="ui.leading({ class: props.ui?.leading })">
      <slot name="leading" :ui="ui">
        <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
        <UAvatar v-else-if="!!props.avatar" :size="props.ui?.leadingAvatarSize || ui.leadingAvatarSize()" v-bind="props.avatar" data-slot="leadingAvatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })" />
      </slot>
    </span>

    <span v-if="isTrailing || !!slots.trailing" data-slot="trailing" :class="ui.trailing({ class: props.ui?.trailing })">
      <slot name="trailing" :ui="ui">
        <UIcon v-if="trailingIconName" :name="trailingIconName" data-slot="trailingIcon" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
      </slot>
    </span>
  </TagsInputRoot>
</template>
