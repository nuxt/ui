<script>
import theme from "#build/ui/select";
</script>

<script setup>
import { useTemplateRef, computed, onMounted, toRef } from "vue";
import { SelectRoot, SelectArrow, SelectTrigger, SelectPortal, SelectContent, SelectViewport, SelectValue as RSelectValue, SelectLabel, SelectGroup, SelectItem as RSelectItem, SelectItemIndicator, SelectItemText, SelectSeparator, useForwardPropsEmits } from "reka-ui";
import { defu } from "defu";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useResolvedVariants } from "../composables/useResolvedVariants";
import { useFieldGroup, FieldGroupReset } from "../composables/useFieldGroup";
import { useComponentIcons } from "../composables/useComponentIcons";
import { useFormField } from "../composables/useFormField";
import { usePortal } from "../composables/usePortal";
import { get, getDisplayValue, isArrayOfArray, looseToNumber } from "../utils";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
import UAvatar from "./Avatar.vue";
import UChip from "./Chip.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  id: { type: String, required: false },
  placeholder: { type: String, required: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  trailingIcon: { type: null, required: false },
  selectedIcon: { type: null, required: false },
  content: { type: Object, required: false },
  arrow: { type: [Boolean, Object], required: false },
  portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
  valueKey: { type: null, required: false, default: "value" },
  labelKey: { type: null, required: false, default: "label" },
  descriptionKey: { type: null, required: false, default: "description" },
  items: { type: null, required: false },
  defaultValue: { type: null, required: false },
  modelValue: { type: null, required: false },
  modelModifiers: { type: null, required: false },
  multiple: { type: Boolean, required: false },
  highlight: { type: Boolean, required: false },
  autofocus: { type: Boolean, required: false },
  autofocusDelay: { type: Number, required: false, default: 0 },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  open: { type: Boolean, required: false },
  defaultOpen: { type: Boolean, required: false },
  autocomplete: { type: String, required: false },
  disabled: { type: Boolean, required: false },
  name: { type: String, required: false },
  required: { type: Boolean, required: false },
  icon: { type: null, required: false },
  avatar: { type: Object, required: false },
  leading: { type: Boolean, required: false },
  leadingIcon: { type: null, required: false },
  trailing: { type: Boolean, required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: null, required: false }
});
const emits = defineEmits(["change", "blur", "focus", "update:modelValue", "update:open"]);
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("select", props);
const rootProps = useForwardPropsEmits(reactivePick(props, "open", "defaultOpen", "disabled", "autocomplete", "required", "multiple"), emits);
const portalProps = usePortal(toRef(() => props.portal));
const { position } = useResolvedVariants("select", props, theme, ["position"], {
  position: () => props.content?.position
});
const contentProps = toRef(() => defu(props.content, { side: "bottom", sideOffset: 8, collisionPadding: 8, position: position.value }));
const arrowProps = toRef(() => defu(props.arrow, { rounded: true }));
const { emitFormChange, emitFormInput, emitFormBlur, emitFormFocus, size: formFieldSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField(props);
const { orientation, size: fieldGroupSize } = useFieldGroup(props);
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(toRef(() => defu(props, { trailingIcon: appConfig.ui.icons.chevronDown })));
const selectSize = computed(() => fieldGroupSize.value || formFieldSize.value);
const isItemAligned = computed(() => position.value === "item-aligned");
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.select || {} })({
  color: color.value,
  variant: props.variant,
  size: selectSize?.value,
  loading: props.loading,
  highlight: highlight.value,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  fieldGroup: orientation.value,
  position: position.value
}));
const groups = computed(
  () => props.items?.length ? isArrayOfArray(props.items) ? props.items : [props.items] : []
);
const items = computed(() => groups.value.flatMap((group) => group));
function displayValue(value) {
  if (props.multiple && Array.isArray(value)) {
    const displayedValues = value.map((item) => getDisplayValue(items.value, item, {
      labelKey: props.labelKey,
      valueKey: props.valueKey
    })).filter((v) => v != null && v !== "");
    return displayedValues.length > 0 ? displayedValues.join(", ") : void 0;
  }
  return getDisplayValue(items.value, value, {
    labelKey: props.labelKey,
    valueKey: props.valueKey
  });
}
const triggerRef = useTemplateRef("triggerRef");
function autoFocus() {
  if (props.autofocus) {
    triggerRef.value?.$el?.focus({
      focusVisible: true
    });
  }
}
onMounted(() => {
  setTimeout(() => {
    autoFocus();
  }, props.autofocusDelay);
});
function onUpdate(value) {
  if (props.modelModifiers?.trim && (typeof value === "string" || value === null || value === void 0)) {
    value = value?.trim() ?? null;
  }
  if (props.modelModifiers?.number) {
    value = looseToNumber(value);
  }
  if (props.modelModifiers?.nullable) {
    value ??= null;
  }
  if (props.modelModifiers?.optional && !props.modelModifiers?.nullable && value !== null) {
    value ??= void 0;
  }
  const event = new Event("change", { target: { value } });
  emits("change", event);
  emitFormChange();
  emitFormInput();
}
function onUpdateOpen(value) {
  if (!value) {
    const event = new FocusEvent("blur");
    emits("blur", event);
    emitFormBlur();
  } else {
    const event = new FocusEvent("focus");
    emits("focus", event);
    emitFormFocus();
  }
}
function isSelectItem(item) {
  return typeof item === "object" && item !== null;
}
const viewportRef = useTemplateRef("viewportRef");
defineExpose({
  triggerRef: toRef(() => triggerRef.value?.$el),
  viewportRef: toRef(() => {
    const instance = viewportRef.value;
    return instance && typeof instance === "object" && "$el" in instance ? instance.$el : instance;
  })
});
</script>

<template>
  <SelectRoot
    v-slot="{ modelValue, open }"
    :name="name"
    v-bind="rootProps"
    :autocomplete="autocomplete"
    :disabled="disabled"
    :default-value="defaultValue"
    :model-value="modelValue"
    @update:model-value="onUpdate"
    @update:open="onUpdateOpen"
  >
    <SelectTrigger
      :id="id"
      ref="triggerRef"
      data-slot="base"
      :class="ui.base({ class: [uiProp?.base, props.class] })"
      v-bind="{ ...$attrs, ...ariaAttrs }"
    >
      <span v-if="isLeading || !!avatar || !!slots.leading" data-slot="leading" :class="ui.leading({ class: uiProp?.leading })">
        <slot name="leading" :model-value="modelValue" :open="open" :ui="ui">
          <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon" :class="ui.leadingIcon({ class: uiProp?.leadingIcon })" />
          <UAvatar v-else-if="!!avatar" :size="uiProp?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()" v-bind="avatar" data-slot="itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: uiProp?.itemLeadingAvatar })" />
        </slot>
      </span>

      <template v-for="displayedModelValue in [displayValue(modelValue)]" :key="displayedModelValue">
        <RSelectValue
          :data-slot="displayedModelValue != null ? 'value' : 'placeholder'"
          :class="displayedModelValue != null ? ui.value({ class: uiProp?.value }) : ui.placeholder({ class: uiProp?.placeholder })"
        >
          <slot :model-value="modelValue" :open="open" :ui="ui">
            {{ displayedModelValue ?? (placeholder ?? "\xA0") }}
          </slot>
        </RSelectValue>
      </template>

      <span v-if="isTrailing || !!slots.trailing" data-slot="trailing" :class="ui.trailing({ class: uiProp?.trailing })">
        <slot name="trailing" :model-value="modelValue" :open="open" :ui="ui">
          <UIcon v-if="trailingIconName" :name="trailingIconName" data-slot="trailingIcon" :class="ui.trailingIcon({ class: uiProp?.trailingIcon })" />
        </slot>
      </span>
    </SelectTrigger>

    <SelectPortal v-bind="portalProps">
      <FieldGroupReset>
        <SelectContent data-slot="content" :class="ui.content({ class: uiProp?.content })" v-bind="contentProps">
          <slot name="content-top" />

          <component :is="isItemAligned ? SelectViewport : 'div'" ref="viewportRef" role="presentation" data-slot="viewport" :class="ui.viewport({ class: uiProp?.viewport })">
            <SelectGroup v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`" data-slot="group" :class="ui.group({ class: uiProp?.group })">
              <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
                <SelectLabel v-if="isSelectItem(item) && item.type === 'label'" data-slot="label" :class="ui.label({ class: [uiProp?.label, item.ui?.label, item.class] })">
                  {{ get(item, props.labelKey) }}
                </SelectLabel>

                <SelectSeparator v-else-if="isSelectItem(item) && item.type === 'separator'" data-slot="separator" :class="ui.separator({ class: [uiProp?.separator, item.ui?.separator, item.class] })" />

                <RSelectItem
                  v-else
                  data-slot="item"
                  :class="ui.item({ class: [uiProp?.item, isSelectItem(item) && item.ui?.item, isSelectItem(item) && item.class] })"
                  :disabled="isSelectItem(item) && item.disabled"
                  :value="isSelectItem(item) ? get(item, props.valueKey) : item"
                  @select="isSelectItem(item) && item.onSelect?.($event)"
                >
                  <slot name="item" :item="item" :index="index" :ui="ui">
                    <slot name="item-leading" :item="item" :index="index" :ui="ui">
                      <UIcon v-if="isSelectItem(item) && item.icon" :name="item.icon" data-slot="itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [uiProp?.itemLeadingIcon, item.ui?.itemLeadingIcon] })" />
                      <UAvatar v-else-if="isSelectItem(item) && item.avatar" :size="item.ui?.itemLeadingAvatarSize || uiProp?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()" v-bind="item.avatar" data-slot="itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: [uiProp?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })" />
                      <UChip
                        v-else-if="isSelectItem(item) && item.chip"
                        :size="item.ui?.itemLeadingChipSize || uiProp?.itemLeadingChipSize || ui.itemLeadingChipSize()"
                        inset
                        standalone
                        v-bind="item.chip"
                        data-slot="itemLeadingChip"
                        :class="ui.itemLeadingChip({ class: [uiProp?.itemLeadingChip, item.ui?.itemLeadingChip] })"
                      />
                    </slot>

                    <span data-slot="itemWrapper" :class="ui.itemWrapper({ class: [uiProp?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })">
                      <SelectItemText data-slot="itemLabel" :class="ui.itemLabel({ class: [uiProp?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })">
                        <slot name="item-label" :item="item" :index="index">
                          {{ isSelectItem(item) ? get(item, props.labelKey) : item }}
                        </slot>
                      </SelectItemText>

                      <span v-if="isSelectItem(item) && (get(item, props.descriptionKey) || !!slots['item-description'])" data-slot="itemDescription" :class="ui.itemDescription({ class: [uiProp?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })">
                        <slot name="item-description" :item="item" :index="index">
                          {{ get(item, props.descriptionKey) }}
                        </slot>
                      </span>
                    </span>

                    <span data-slot="itemTrailing" :class="ui.itemTrailing({ class: [uiProp?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })">
                      <slot name="item-trailing" :item="item" :index="index" :ui="ui" />

                      <SelectItemIndicator as-child>
                        <UIcon :name="selectedIcon || appConfig.ui.icons.check" data-slot="itemTrailingIcon" :class="ui.itemTrailingIcon({ class: [uiProp?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })" />
                      </SelectItemIndicator>
                    </span>
                  </slot>
                </RSelectItem>
              </template>
            </SelectGroup>
          </component>

          <slot name="content-bottom" />

          <SelectArrow v-if="!!arrow" v-bind="arrowProps" data-slot="arrow" :class="ui.arrow({ class: uiProp?.arrow })" />
        </SelectContent>
      </FieldGroupReset>
    </SelectPortal>
  </SelectRoot>
</template>
