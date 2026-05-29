<script>
import theme from "#build/ui/input-menu";
</script>

<script setup>
import { computed, useTemplateRef, toRef, onMounted, toRaw, nextTick, watch } from "vue";
import { TagsInputRoot, TagsInputItem, TagsInputItemText, TagsInputItemDelete, TagsInputInput } from "reka-ui";
import { useForwardProps } from "../composables/useForwardProps";
import { Combobox, Autocomplete } from "reka-ui/namespaced";
import { defu } from "defu";
import { isEqual } from "ohash/utils";
import { reactivePick, reactiveOmit, createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
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
defineOptions({ inheritAttrs: false });
const _props = defineProps({
  as: { type: null, required: false },
  id: { type: String, required: false },
  type: { type: null, required: false, default: "text" },
  placeholder: { type: String, required: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  required: { type: Boolean, required: false },
  autofocus: { type: Boolean, required: false },
  autofocusDelay: { type: Number, required: false, default: 0 },
  trailingIcon: { type: null, required: false },
  selectedIcon: { type: null, required: false },
  deleteIcon: { type: null, required: false },
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
  fixed: { type: Boolean, required: false },
  mode: { type: String, required: false, default: "combobox" },
  createItem: { type: [Boolean, String, Object], required: false },
  filterFields: { type: Array, required: false },
  ignoreFilter: { type: Boolean, required: false },
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
  openOnClick: { type: Boolean, required: false },
  openOnFocus: { type: Boolean, required: false },
  by: { type: [String, Function], required: false },
  icon: { type: null, required: false },
  avatar: { type: Object, required: false },
  leading: { type: Boolean, required: false },
  leadingIcon: { type: null, required: false },
  trailing: { type: Boolean, required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: null, required: false }
});
const emits = defineEmits(["change", "blur", "focus", "create", "clear", "highlight", "remove-tag", "update:modelValue", "update:open"]);
const slots = defineSlots();
const props = useComponentProps("inputMenu", _props);
const searchTerm = defineModel("searchTerm", { type: String, ...{ default: "" } });
const { t } = useLocale();
const appConfig = useAppConfig();
const { filterGroups } = useFilter();
const isAutocomplete = computed(() => props.mode === "autocomplete");
const rootPropsPick = reactivePick(props, "as", "modelValue", "defaultValue", "open", "defaultOpen", "required", "multiple", "resetSearchTermOnBlur", "resetSearchTermOnSelect", "resetModelValueOnClear", "highlightOnHover", "openOnClick", "openOnFocus", "by");
const rootPropsOmitted = reactiveOmit(rootPropsPick, "multiple", "resetSearchTermOnSelect", "resetModelValueOnClear", "by");
const rootProps = useForwardProps(computed(() => isAutocomplete.value ? rootPropsOmitted : rootPropsPick), emits);
const Component = computed(() => isAutocomplete.value ? Autocomplete : Combobox);
const portalProps = usePortal(toRef(() => props.portal));
const contentProps = toRef(() => defu(props.content, { side: "bottom", sideOffset: 8, collisionPadding: 8, position: "popper" }));
const arrowProps = toRef(() => defu(props.arrow, { rounded: true }));
const clearProps = computed(() => typeof props.clear === "object" ? props.clear : {});
const virtualizerProps = toRef(() => {
  if (!props.virtualize) return false;
  return defu(typeof props.virtualize === "boolean" ? {} : props.virtualize, {
    estimateSize: getEstimateSize(filteredItems.value, inputSize.value || "md", props.descriptionKey, !!slots["item-description"])
  });
});
const { emitFormBlur, emitFormFocus, emitFormChange, emitFormInput, size: formFieldSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField(_props);
const { orientation, size: fieldGroupSize } = useFieldGroup(_props);
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(toRef(() => defu(props, { trailingIcon: appConfig.ui.icons.chevronDown })));
const inputSize = computed(() => fieldGroupSize.value || formFieldSize.value);
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
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.inputMenu || {} })({
  color: color.value ?? props.color,
  variant: props.variant,
  size: inputSize?.value ?? props.size,
  loading: props.loading,
  highlight: highlight.value ?? props.highlight,
  fixed: props.fixed,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  multiple: props.multiple,
  fieldGroup: orientation.value,
  virtualize: !!props.virtualize
}));
const items = computed(() => groups.value.flatMap((group) => group));
function displayValue(value) {
  return getDisplayValue(items.value, value, {
    labelKey: props.labelKey,
    valueKey: props.valueKey,
    by: props.by
  }) ?? "";
}
const groups = computed(
  () => props.items?.length ? isArrayOfArray(props.items) ? props.items : [props.items] : []
);
const filteredGroups = computed(() => {
  if (props.ignoreFilter || !searchTerm.value) {
    return groups.value;
  }
  const fields = Array.isArray(props.filterFields) ? props.filterFields : [props.labelKey];
  return filterGroups(groups.value, searchTerm.value, {
    fields,
    isStructural: (item) => isInputItem(item) && !!item.type && ["label", "separator"].includes(item.type)
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
const inputRef = useTemplateRef("inputRef");
function autoFocus() {
  if (props.autofocus) {
    inputRef.value?.$el?.focus();
  }
}
onMounted(() => {
  nextTick(() => {
    if (isAutocomplete.value) {
      searchTerm.value = String(props.modelValue ?? props.defaultValue ?? "");
    } else {
      searchTerm.value = "";
    }
  });
  setTimeout(() => {
    autoFocus();
  }, props.autofocusDelay);
});
watch(() => props.modelValue, (newValue) => {
  if (isAutocomplete.value) {
    searchTerm.value = String(newValue ?? "");
  }
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
  if (isAutocomplete.value) {
    searchTerm.value = String(value ?? "");
  } else if (props.resetSearchTermOnSelect) {
    searchTerm.value = "";
  }
}
function onInputUpdate(value) {
  if (!isAutocomplete.value) {
    searchTerm.value = value;
  }
}
function onBlur(event) {
  emits("blur", event);
  emitFormBlur();
}
function onFocus(event) {
  emits("focus", event);
  emitFormFocus();
}
function onUpdateOpen(value) {
  let timeoutId;
  if (!value) {
    const event = new FocusEvent("blur");
    emits("blur", event);
    emitFormBlur();
    if (!isAutocomplete.value && props.resetSearchTermOnBlur) {
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
function onRemoveTag(event, modelValue) {
  if (props.multiple) {
    const filteredValue = modelValue.filter((value) => !isEqual(value, event));
    emits("update:modelValue", filteredValue);
    emits("remove-tag", event);
    onUpdate(filteredValue);
  }
}
function onCreate(e) {
  e.preventDefault();
  e.stopPropagation();
  emits("create", searchTerm.value);
}
function onSelect(e, item) {
  if (!isInputItem(item)) {
    return;
  }
  if (item.disabled) {
    e.preventDefault();
    return;
  }
  item.onSelect?.(e);
}
function isInputItem(item) {
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
  inputRef: toRef(() => inputRef.value?.$el),
  viewportRef: toRef(() => viewportRef.value)
});
</script>

<template>
  <DefineCreateItemTemplate>
    <Component.Item
      data-slot="item"
      :class="ui.item({ class: props.ui?.item })"
      :value="searchTerm"
      @select="onCreate"
    >
      <span data-slot="itemLabel" :class="ui.itemLabel({ class: props.ui?.itemLabel })">
        <slot name="create-item-label" :item="searchTerm">
          {{ t("inputMenu.create", { label: searchTerm }) }}
        </slot>
      </span>
    </Component.Item>
  </DefineCreateItemTemplate>

  <DefineItemTemplate v-slot="{ item, index }">
    <Component.Label v-if="isInputItem(item) && item.type === 'label'" data-slot="label" :class="ui.label({ class: [props.ui?.label, item.ui?.label, item.class] })">
      {{ get(item, props.labelKey) }}
    </Component.Label>

    <Component.Separator v-else-if="isInputItem(item) && item.type === 'separator'" data-slot="separator" :class="ui.separator({ class: [props.ui?.separator, item.ui?.separator, item.class] })" />

    <Component.Item
      v-else
      data-slot="item"
      :class="ui.item({ class: [props.ui?.item, isInputItem(item) && item.ui?.item, isInputItem(item) && item.class] })"
      :disabled="isInputItem(item) && item.disabled"
      :value="props.valueKey && isInputItem(item) ? get(item, props.valueKey) : item"
      @select="onSelect($event, item)"
    >
      <slot name="item" :item="item" :index="index" :ui="ui">
        <slot name="item-leading" :item="item" :index="index" :ui="ui">
          <UIcon v-if="isInputItem(item) && item.icon" :name="item.icon" data-slot="itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [props.ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })" />
          <UAvatar v-else-if="isInputItem(item) && item.avatar" :size="item.ui?.itemLeadingAvatarSize || props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()" v-bind="item.avatar" data-slot="itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: [props.ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })" />
          <UChip
            v-else-if="isInputItem(item) && item.chip"
            :size="item.ui?.itemLeadingChipSize || props.ui?.itemLeadingChipSize || ui.itemLeadingChipSize()"
            inset
            standalone
            v-bind="item.chip"
            data-slot="itemLeadingChip"
            :class="ui.itemLeadingChip({ class: [props.ui?.itemLeadingChip, item.ui?.itemLeadingChip] })"
          />
        </slot>

        <span data-slot="itemWrapper" :class="ui.itemWrapper({ class: [props.ui?.itemWrapper, isInputItem(item) && item.ui?.itemWrapper] })">
          <span data-slot="itemLabel" :class="ui.itemLabel({ class: [props.ui?.itemLabel, isInputItem(item) && item.ui?.itemLabel] })">
            <slot name="item-label" :item="item" :index="index">
              {{ isInputItem(item) ? get(item, props.labelKey) : item }}
            </slot>
          </span>

          <span v-if="isInputItem(item) && (get(item, props.descriptionKey) || !!slots['item-description'])" data-slot="itemDescription" :class="ui.itemDescription({ class: [props.ui?.itemDescription, isInputItem(item) && item.ui?.itemDescription] })">
            <slot name="item-description" :item="item" :index="index">
              {{ get(item, props.descriptionKey) }}
            </slot>
          </span>
        </span>

        <span data-slot="itemTrailing" :class="ui.itemTrailing({ class: [props.ui?.itemTrailing, isInputItem(item) && item.ui?.itemTrailing] })">
          <slot name="item-trailing" :item="item" :index="index" :ui="ui" />

          <Component.ItemIndicator v-if="!isAutocomplete" as-child>
            <UIcon :name="props.selectedIcon || appConfig.ui.icons.check" data-slot="itemTrailingIcon" :class="ui.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, isInputItem(item) && item.ui?.itemTrailingIcon] })" />
          </Component.ItemIndicator>
        </span>
      </slot>
    </Component.Item>
  </DefineItemTemplate>

  <Component.Root
    v-slot="{ modelValue, open }"
    v-bind="rootProps"
    :name="name"
    :disabled="disabled"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :as-child="!!props.multiple && !isAutocomplete"
    ignore-filter
    @update:model-value="onUpdate"
    @update:open="onUpdateOpen"
  >
    <Component.Anchor :as-child="!props.multiple" data-slot="base" :class="ui.base({ class: props.ui?.base })">
      <TagsInputRoot
        v-if="props.multiple && !isAutocomplete"
        v-slot="{ modelValue: tags }"
        :model-value="modelValue"
        :disabled="disabled"
        :required="props.required"
        delimiter=""
        as-child
        @blur="onBlur"
        @focus="onFocus"
        @remove-tag="onRemoveTag($event, modelValue)"
      >
        <TagsInputItem v-for="(item, index) in tags" :key="index" :value="item" data-slot="tagsItem" :class="ui.tagsItem({ class: [props.ui?.tagsItem, isInputItem(item) && item.ui?.tagsItem] })">
          <TagsInputItemText data-slot="tagsItemText" :class="ui.tagsItemText({ class: [props.ui?.tagsItemText, isInputItem(item) && item.ui?.tagsItemText] })">
            <slot name="tags-item-text" :item="item" :index="index">
              {{ displayValue(item) }}
            </slot>
          </TagsInputItemText>

          <TagsInputItemDelete data-slot="tagsItemDelete" :class="ui.tagsItemDelete({ class: [props.ui?.tagsItemDelete, isInputItem(item) && item.ui?.tagsItemDelete] })" :disabled="disabled">
            <slot name="tags-item-delete" :item="item" :index="index" :ui="ui">
              <UIcon :name="props.deleteIcon || appConfig.ui.icons.close" data-slot="tagsItemDeleteIcon" :class="ui.tagsItemDeleteIcon({ class: [props.ui?.tagsItemDeleteIcon, isInputItem(item) && item.ui?.tagsItemDeleteIcon] })" />
            </slot>
          </TagsInputItemDelete>
        </TagsInputItem>

        <Component.Input v-model="searchTerm" as-child>
          <TagsInputInput
            :id="id"
            ref="inputRef"
            v-bind="{ ...$attrs, ...ariaAttrs }"
            :placeholder="props.placeholder"
            data-slot="tagsInput"
            :class="ui.tagsInput({ class: props.ui?.tagsInput })"
            @change.stop
          />
        </Component.Input>
      </TagsInputRoot>

      <Component.Input
        v-else
        :id="id"
        ref="inputRef"
        v-bind="{ ...!isAutocomplete ? { displayValue } : {}, ...$attrs, ...ariaAttrs }"
        :type="props.type"
        :placeholder="props.placeholder"
        :required="props.required"
        @blur="onBlur"
        @focus="onFocus"
        @change.stop
        @update:model-value="onInputUpdate"
      />

      <span v-if="isLeading || !!props.avatar || !!slots.leading" data-slot="leading" :class="ui.leading({ class: props.ui?.leading })">
        <slot name="leading" :model-value="modelValue" :open="open" :ui="ui">
          <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
          <UAvatar v-else-if="!!props.avatar" :size="props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()" v-bind="props.avatar" data-slot="itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })" />
        </slot>
      </span>

      <Component.Trigger v-if="isTrailing || !!slots.trailing || !!props.clear" data-slot="trailing" :class="ui.trailing({ class: props.ui?.trailing })">
        <slot name="trailing" :model-value="modelValue" :open="open" :ui="ui">
          <Component.Cancel v-if="!!props.clear && !isModelValueEmpty(modelValue)" as-child>
            <UButton
              as="span"
              :icon="props.clearIcon || appConfig.ui.icons.close"
              :size="inputSize"
              variant="link"
              color="neutral"
              tabindex="-1"
              v-bind="clearProps"
              data-slot="trailingClear"
              :class="ui.trailingClear({ class: props.ui?.trailingClear })"
              @click.stop="onClear"
            />
          </Component.Cancel>

          <UIcon v-else-if="trailingIconName" :name="trailingIconName" data-slot="trailingIcon" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
        </slot>
      </Component.Trigger>
    </Component.Anchor>

    <Component.Portal v-bind="portalProps">
      <FieldGroupReset>
        <Component.Content data-slot="content" :class="ui.content({ class: props.ui?.content })" v-bind="contentProps" @focus-outside.prevent>
          <slot name="content-top" />

          <Component.Empty data-slot="empty" :class="ui.empty({ class: props.ui?.empty })">
            <slot name="empty" :search-term="searchTerm">
              {{ searchTerm ? t("inputMenu.noMatch", { searchTerm }) : t("inputMenu.noData") }}
            </slot>
          </Component.Empty>

          <div ref="viewportRef" role="presentation" data-slot="viewport" :class="ui.viewport({ class: props.ui?.viewport })">
            <template v-if="!!props.virtualize">
              <ReuseCreateItemTemplate v-if="createItem && createItemPosition === 'top'" />

              <Component.Virtualizer
                v-slot="{ option: item, virtualItem }"
                :options="filteredItems"
                :text-content="(item2) => isInputItem(item2) ? get(item2, props.labelKey) : String(item2)"
                v-bind="virtualizerProps"
              >
                <ReuseItemTemplate :item="item" :index="virtualItem.index" />
              </Component.Virtualizer>

              <ReuseCreateItemTemplate v-if="createItem && createItemPosition === 'bottom'" />
            </template>

            <template v-else>
              <Component.Group v-if="createItem && createItemPosition === 'top'" data-slot="group" :class="ui.group({ class: props.ui?.group })">
                <ReuseCreateItemTemplate />
              </Component.Group>

              <Component.Group v-for="(group, groupIndex) in filteredGroups" :key="`group-${groupIndex}`" data-slot="group" :class="ui.group({ class: props.ui?.group })">
                <ReuseItemTemplate v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`" :item="item" :index="index" />
              </Component.Group>

              <Component.Group v-if="createItem && createItemPosition === 'bottom'" data-slot="group" :class="ui.group({ class: props.ui?.group })">
                <ReuseCreateItemTemplate />
              </Component.Group>
            </template>
          </div>

          <slot name="content-bottom" />

          <Component.Arrow v-if="!!props.arrow" v-bind="arrowProps" data-slot="arrow" :class="ui.arrow({ class: props.ui?.arrow })" />
        </Component.Content>
      </FieldGroupReset>
    </Component.Portal>
  </Component.Root>
</template>
