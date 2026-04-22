<script>
import theme from "#build/ui/select-menu";
</script>

<script setup>
import { useTemplateRef, computed, onMounted, toRef, toRaw } from "vue";
import { ComboboxRoot, ComboboxArrow, ComboboxAnchor, ComboboxInput, ComboboxTrigger, ComboboxCancel, ComboboxPortal, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxVirtualizer, ComboboxLabel, ComboboxSeparator, ComboboxItem, ComboboxItemIndicator, FocusScope, useForwardPropsEmits } from "reka-ui";
import { defu } from "defu";
import { reactivePick, createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useFieldGroup, FieldGroupReset } from "../composables/useFieldGroup";
import { useComponentIcons } from "../composables/useComponentIcons";
import { useFormField } from "../composables/useFormField";
import { useFilter } from "../composables/useFilter";
import { useLocale } from "../composables/useLocale";
import { usePortal } from "../composables/usePortal";
import { compare, get, getDisplayValue, isArrayOfArray, looseToNumber } from "../utils";
import { getEstimateSize } from "../utils/virtualizer";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
import UAvatar from "./Avatar.vue";
import UButton from "./Button.vue";
import UChip from "./Chip.vue";
import UInput from "./Input.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  id: { type: String, required: false },
  placeholder: { type: String, required: false },
  searchInput: { type: [Boolean, Object], required: false, default: true },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  required: { type: Boolean, required: false },
  trailingIcon: { type: null, required: false },
  selectedIcon: { type: null, required: false },
  clear: { type: [Boolean, Object], required: false },
  clearIcon: { type: null, required: false },
  content: { type: Object, required: false },
  arrow: { type: [Boolean, Object], required: false },
  portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
  virtualize: { type: [Boolean, Object], required: false, default: false },
  valueKey: { type: null, required: false },
  labelKey: { type: null, required: false, default: "label" },
  descriptionKey: { type: null, required: false, default: "description" },
  items: { type: null, required: false },
  defaultValue: { type: null, required: false },
  modelValue: { type: null, required: false },
  modelModifiers: { type: null, required: false },
  multiple: { type: Boolean, required: false },
  highlight: { type: Boolean, required: false },
  createItem: { type: [Boolean, String, Object], required: false },
  filterFields: { type: Array, required: false },
  ignoreFilter: { type: Boolean, required: false },
  autofocus: { type: Boolean, required: false },
  autofocusDelay: { type: Number, required: false, default: 0 },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  open: { type: Boolean, required: false },
  defaultOpen: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false },
  name: { type: String, required: false },
  resetSearchTermOnBlur: { type: Boolean, required: false, default: true },
  resetSearchTermOnSelect: { type: Boolean, required: false, default: true },
  resetModelValueOnClear: { type: Boolean, required: false, default: true },
  highlightOnHover: { type: Boolean, required: false },
  by: { type: [String, Function], required: false },
  icon: { type: null, required: false },
  avatar: { type: Object, required: false },
  leading: { type: Boolean, required: false },
  leadingIcon: { type: null, required: false },
  trailing: { type: Boolean, required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: null, required: false }
});
const emits = defineEmits(["change", "blur", "focus", "create", "clear", "highlight", "update:modelValue", "update:open"]);
const slots = defineSlots();
const searchTerm = defineModel("searchTerm", { type: String, ...{ default: "" } });
const { t } = useLocale();
const appConfig = useAppConfig();
const uiProp = useComponentUI("selectMenu", props);
const { filterGroups } = useFilter();
const rootProps = useForwardPropsEmits(reactivePick(props, "modelValue", "defaultValue", "open", "defaultOpen", "required", "multiple", "resetSearchTermOnBlur", "resetSearchTermOnSelect", "resetModelValueOnClear", "highlightOnHover", "by"), emits);
const portalProps = usePortal(toRef(() => props.portal));
const contentProps = toRef(() => defu(props.content, { side: "bottom", sideOffset: 8, collisionPadding: 8, position: "popper" }));
const arrowProps = toRef(() => defu(props.arrow, { rounded: true }));
const clearProps = computed(() => typeof props.clear === "object" ? props.clear : {});
const virtualizerProps = toRef(() => {
  if (!props.virtualize) return false;
  return defu(typeof props.virtualize === "boolean" ? {} : props.virtualize, {
    estimateSize: getEstimateSize(filteredItems.value, selectSize.value || "md", props.descriptionKey, !!slots["item-description"])
  });
});
const searchInputProps = toRef(() => defu(props.searchInput, { placeholder: t("selectMenu.search"), variant: "none" }));
const { emitFormBlur, emitFormFocus, emitFormInput, emitFormChange, size: formFieldSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField(props);
const { orientation, size: fieldGroupSize } = useFieldGroup(props);
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(toRef(() => defu(props, { trailingIcon: appConfig.ui.icons.chevronDown })));
const selectSize = computed(() => fieldGroupSize.value || formFieldSize.value);
const [DefineCreateItemTemplate, ReuseCreateItemTemplate] = createReusableTemplate();
const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate({
  props: {
    item: {
      type: [Object, String, Number, Boolean],
      required: true
    },
    index: {
      type: Number,
      required: false
    }
  }
});
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.selectMenu || {} })({
  color: color.value,
  variant: props.variant,
  size: selectSize?.value,
  loading: props.loading,
  highlight: highlight.value,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  fieldGroup: orientation.value,
  virtualize: !!props.virtualize
}));
function displayValue(value) {
  if (props.multiple && Array.isArray(value)) {
    const displayedValues = value.map((item) => getDisplayValue(items.value, item, {
      labelKey: props.labelKey,
      valueKey: props.valueKey,
      by: props.by
    })).filter((v) => v != null && v !== "");
    return displayedValues.length > 0 ? displayedValues.join(", ") : void 0;
  }
  return getDisplayValue(items.value, value, {
    labelKey: props.labelKey,
    valueKey: props.valueKey,
    by: props.by
  });
}
const groups = computed(
  () => props.items?.length ? isArrayOfArray(props.items) ? props.items : [props.items] : []
);
const items = computed(() => groups.value.flatMap((group) => group));
const filteredGroups = computed(() => {
  if (props.ignoreFilter || !searchTerm.value) {
    return groups.value;
  }
  const fields = Array.isArray(props.filterFields) ? props.filterFields : [props.labelKey];
  return filterGroups(groups.value, searchTerm.value, {
    fields,
    isStructural: (item) => isSelectItem(item) && !!item.type && ["label", "separator"].includes(item.type)
  });
});
const filteredItems = computed(() => filteredGroups.value.flatMap((group) => group));
const createItem = computed(() => {
  if (!props.createItem || !searchTerm.value) {
    return false;
  }
  const newItem = props.valueKey ? { [props.valueKey]: searchTerm.value } : searchTerm.value;
  if (typeof props.createItem === "object" && props.createItem.when === "always" || props.createItem === "always") {
    return !filteredItems.value.find((item) => compare(item, newItem, props.by ?? props.valueKey));
  }
  return !filteredItems.value.length;
});
const createItemPosition = computed(() => typeof props.createItem === "object" ? props.createItem.position : "bottom");
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
  if (toRaw(props.modelValue) === value) {
    return;
  }
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
  if (props.resetSearchTermOnSelect) {
    searchTerm.value = "";
  }
}
function onUpdateOpen(value) {
  let timeoutId;
  if (!value) {
    const event = new FocusEvent("blur");
    emits("blur", event);
    emitFormBlur();
    if (props.resetSearchTermOnBlur) {
      const STATE_ANIMATION_DELAY_MS = 100;
      timeoutId = setTimeout(() => {
        searchTerm.value = "";
      }, STATE_ANIMATION_DELAY_MS);
    }
  } else {
    const event = new FocusEvent("focus");
    emits("focus", event);
    emitFormFocus();
    clearTimeout(timeoutId);
  }
}
function onCreate(e) {
  e.preventDefault();
  e.stopPropagation();
  emits("create", searchTerm.value);
}
function onSelect(e, item) {
  if (!isSelectItem(item)) {
    return;
  }
  if (item.disabled) {
    e.preventDefault();
    return;
  }
  item.onSelect?.(e);
}
function isSelectItem(item) {
  return typeof item === "object" && item !== null;
}
function isModelValueEmpty(modelValue) {
  if (props.multiple && Array.isArray(modelValue)) {
    return modelValue.length === 0;
  }
  return modelValue === void 0 || modelValue === null || modelValue === "";
}
function onClear() {
  emits("clear");
}
const viewportRef = useTemplateRef("viewportRef");
defineExpose({
  triggerRef: toRef(() => triggerRef.value?.$el),
  viewportRef: toRef(() => viewportRef.value)
});
</script>

<template>
  <DefineCreateItemTemplate>
    <ComboboxItem
      data-slot="item"
      :class="ui.item({ class: uiProp?.item })"
      :value="searchTerm"
      @select="onCreate"
    >
      <span data-slot="itemLabel" :class="ui.itemLabel({ class: uiProp?.itemLabel })">
        <slot name="create-item-label" :item="searchTerm">
          {{ t("selectMenu.create", { label: searchTerm }) }}
        </slot>
      </span>
    </ComboboxItem>
  </DefineCreateItemTemplate>

  <DefineItemTemplate v-slot="{ item, index }">
    <ComboboxLabel v-if="isSelectItem(item) && item.type === 'label'" data-slot="label" :class="ui.label({ class: [uiProp?.label, item.ui?.label, item.class] })">
      {{ get(item, props.labelKey) }}
    </ComboboxLabel>

    <ComboboxSeparator v-else-if="isSelectItem(item) && item.type === 'separator'" data-slot="separator" :class="ui.separator({ class: [uiProp?.separator, item.ui?.separator, item.class] })" />

    <ComboboxItem
      v-else
      data-slot="item"
      :class="ui.item({ class: [uiProp?.item, isSelectItem(item) && item.ui?.item, isSelectItem(item) && item.class] })"
      :disabled="isSelectItem(item) && item.disabled"
      :value="props.valueKey && isSelectItem(item) ? get(item, props.valueKey) : item"
      @select="onSelect($event, item)"
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
          <span data-slot="itemLabel" :class="ui.itemLabel({ class: [uiProp?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })">
            <slot name="item-label" :item="item" :index="index">
              {{ isSelectItem(item) ? get(item, props.labelKey) : item }}
            </slot>
          </span>

          <span v-if="isSelectItem(item) && (get(item, props.descriptionKey) || !!slots['item-description'])" data-slot="itemDescription" :class="ui.itemDescription({ class: [uiProp?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })">
            <slot name="item-description" :item="item" :index="index">
              {{ get(item, props.descriptionKey) }}
            </slot>
          </span>
        </span>

        <span data-slot="itemTrailing" :class="ui.itemTrailing({ class: [uiProp?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })">
          <slot name="item-trailing" :item="item" :index="index" :ui="ui" />

          <ComboboxItemIndicator as-child>
            <UIcon :name="selectedIcon || appConfig.ui.icons.check" data-slot="itemTrailingIcon" :class="ui.itemTrailingIcon({ class: [uiProp?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })" />
          </ComboboxItemIndicator>
        </span>
      </slot>
    </ComboboxItem>
  </DefineItemTemplate>

  <ComboboxRoot
    :id="id"
    v-slot="{ modelValue, open }"
    v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
    ignore-filter
    as-child
    :name="name"
    :disabled="disabled"
    @update:model-value="onUpdate"
    @update:open="onUpdateOpen"
  >
    <ComboboxAnchor as-child>
      <ComboboxTrigger ref="triggerRef" data-slot="base" :class="ui.base({ class: [uiProp?.base, props.class] })" tabindex="0">
        <span v-if="isLeading || !!avatar || !!slots.leading" data-slot="leading" :class="ui.leading({ class: uiProp?.leading })">
          <slot name="leading" :model-value="modelValue" :open="open" :ui="ui">
            <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon" :class="ui.leadingIcon({ class: uiProp?.leadingIcon })" />
            <UAvatar v-else-if="!!avatar" :size="uiProp?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()" v-bind="avatar" data-slot="itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: uiProp?.itemLeadingAvatar })" />
          </slot>
        </span>

        <slot :model-value="modelValue" :open="open" :ui="ui">
          <template v-for="displayedModelValue in [displayValue(modelValue)]" :key="displayedModelValue">
            <span v-if="displayedModelValue !== void 0 && displayedModelValue !== null" data-slot="value" :class="ui.value({ class: uiProp?.value })">
              {{ displayedModelValue }}
            </span>
            <span v-else data-slot="placeholder" :class="ui.placeholder({ class: uiProp?.placeholder })">
              {{ placeholder ?? "\xA0" }}
            </span>
          </template>
        </slot>

        <span v-if="isTrailing || !!slots.trailing || !!clear" data-slot="trailing" :class="ui.trailing({ class: uiProp?.trailing })">
          <slot name="trailing" :model-value="modelValue" :open="open" :ui="ui">
            <ComboboxCancel v-if="!!clear && !isModelValueEmpty(modelValue)" as-child>
              <UButton
                as="span"
                :icon="clearIcon || appConfig.ui.icons.close"
                :size="selectSize"
                variant="link"
                color="neutral"
                tabindex="-1"
                v-bind="clearProps"
                data-slot="trailingClear"
                :class="ui.trailingClear({ class: uiProp?.trailingClear })"
                @click.stop="onClear"
              />
            </ComboboxCancel>

            <UIcon v-else-if="trailingIconName" :name="trailingIconName" data-slot="trailingIcon" :class="ui.trailingIcon({ class: uiProp?.trailingIcon })" />
          </slot>
        </span>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal v-bind="portalProps">
      <FieldGroupReset>
        <ComboboxContent data-slot="content" :class="ui.content({ class: uiProp?.content })" v-bind="contentProps">
          <FocusScope trapped data-slot="focusScope" :class="ui.focusScope({ class: uiProp?.focusScope })">
            <slot name="content-top" />

            <ComboboxInput v-if="!!searchInput" v-model="searchTerm" :display-value="() => searchTerm" as-child>
              <UInput
                autofocus
                autocomplete="off"
                :size="selectSize"
                v-bind="searchInputProps"
                :model-modifiers="{
  trim: modelModifiers?.trim
}"
                data-slot="input"
                :class="ui.input({ class: uiProp?.input })"
                @change.stop
              />
            </ComboboxInput>

            <ComboboxEmpty data-slot="empty" :class="ui.empty({ class: uiProp?.empty })">
              <slot name="empty" :search-term="searchTerm">
                {{ searchTerm ? t("selectMenu.noMatch", { searchTerm }) : t("selectMenu.noData") }}
              </slot>
            </ComboboxEmpty>

            <div ref="viewportRef" role="presentation" data-slot="viewport" :class="ui.viewport({ class: uiProp?.viewport })">
              <template v-if="!!virtualize">
                <ReuseCreateItemTemplate v-if="createItem && createItemPosition === 'top'" />

                <ComboboxVirtualizer
                  v-slot="{ option: item, virtualItem }"
                  :options="filteredItems"
                  :text-content="(item2) => isSelectItem(item2) ? get(item2, props.labelKey) : String(item2)"
                  v-bind="virtualizerProps"
                >
                  <ReuseItemTemplate :item="item" :index="virtualItem.index" />
                </ComboboxVirtualizer>

                <ReuseCreateItemTemplate v-if="createItem && createItemPosition === 'bottom'" />
              </template>

              <template v-else>
                <ComboboxGroup v-if="createItem && createItemPosition === 'top'" data-slot="group" :class="ui.group({ class: uiProp?.group })">
                  <ReuseCreateItemTemplate />
                </ComboboxGroup>

                <ComboboxGroup v-for="(group, groupIndex) in filteredGroups" :key="`group-${groupIndex}`" data-slot="group" :class="ui.group({ class: uiProp?.group })">
                  <ReuseItemTemplate v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`" :item="item" :index="index" />
                </ComboboxGroup>

                <ComboboxGroup v-if="createItem && createItemPosition === 'bottom'" data-slot="group" :class="ui.group({ class: uiProp?.group })">
                  <ReuseCreateItemTemplate />
                </ComboboxGroup>
              </template>
            </div>

            <slot name="content-bottom" />
          </FocusScope>

          <ComboboxArrow v-if="!!arrow" v-bind="arrowProps" data-slot="arrow" :class="ui.arrow({ class: uiProp?.arrow })" />
        </ComboboxContent>
      </FieldGroupReset>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
