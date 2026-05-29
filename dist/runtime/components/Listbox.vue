<script>
import { computed, toRaw, toRef } from "vue";
import theme from "#build/ui/listbox";
</script>

<script setup>
import { ListboxRoot, ListboxContent, ListboxGroup, ListboxGroupLabel, ListboxVirtualizer, ListboxItem as RekaListboxItem, ListboxItemIndicator, ListboxFilter } from "reka-ui";
import { useForwardProps } from "../composables/useForwardProps";
import { createReusableTemplate, reactivePick } from "@vueuse/core";
import { defu } from "defu";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useFilter } from "../composables/useFilter";
import { useFormField } from "../composables/useFormField";
import { useLocale } from "../composables/useLocale";
import { get, isArrayOfArray, looseToNumber } from "../utils";
import { getEstimateSize } from "../utils/virtualizer";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
import UAvatar from "./Avatar.vue";
import UChip from "./Chip.vue";
import UInput from "./Input.vue";
defineOptions({ inheritAttrs: false });
const _props = defineProps({
  id: { type: String, required: false },
  as: { type: null, required: false },
  color: { type: null, required: false },
  size: { type: null, required: false },
  items: { type: null, required: false },
  modelValue: { type: null, required: false },
  modelModifiers: { type: null, required: false },
  defaultValue: { type: null, required: false },
  multiple: { type: Boolean, required: false },
  valueKey: { type: null, required: false },
  labelKey: { type: null, required: false, default: "label" },
  descriptionKey: { type: null, required: false, default: "description" },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: null, required: false },
  filter: { type: [Boolean, Object], required: false, default: false },
  filterFields: { type: Array, required: false },
  ignoreFilter: { type: Boolean, required: false },
  selectedIcon: { type: null, required: false },
  virtualize: { type: [Boolean, Object], required: false, default: false },
  highlight: { type: Boolean, required: false },
  autofocus: { type: Boolean, required: false },
  autofocusDelay: { type: Number, required: false, default: 0 },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  by: { type: [String, Function], required: false },
  disabled: { type: Boolean, required: false },
  highlightOnHover: { type: Boolean, required: false, default: true },
  name: { type: String, required: false },
  orientation: { type: String, required: false },
  required: { type: Boolean, required: false },
  selectionBehavior: { type: String, required: false }
});
const emits = defineEmits(["entryFocus", "highlight", "leave", "change", "update:modelValue"]);
const slots = defineSlots();
const props = useComponentProps("listbox", _props);
const searchTerm = defineModel("searchTerm", { type: String, ...{ default: "" } });
const { t } = useLocale();
const appConfig = useAppConfig();
const { filterGroups } = useFilter();
const rootProps = useForwardProps(reactivePick(props, "as", "modelValue", "defaultValue", "multiple", "selectionBehavior", "highlightOnHover", "by", "orientation", "required"), emits);
const virtualizerProps = toRef(() => {
  if (!props.virtualize) return false;
  return defu(typeof props.virtualize === "boolean" ? {} : props.virtualize, {
    estimateSize: getEstimateSize(filteredItems.value, size.value || "md", props.descriptionKey, !!slots["item-description"])
  });
});
const inputProps = toRef(() => defu(typeof props.filter === "object" ? props.filter : {}, { placeholder: t("listbox.search"), variant: "none" }));
const { emitFormChange, emitFormInput, name, size, color, id, highlight, disabled, ariaAttrs } = useFormField(_props, { bind: false });
const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate({
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: false
    }
  }
});
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.listbox || {} })({
  color: color.value ?? props.color,
  size: size.value ?? props.size,
  highlight: highlight.value ?? props.highlight,
  disabled: disabled.value,
  virtualize: !!props.virtualize
}));
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
}
function onSelect(e, item) {
  if (item.disabled) {
    e.preventDefault();
    return;
  }
  item.onSelect?.(e);
}
const groups = computed(
  () => props.items?.length ? isArrayOfArray(props.items) ? props.items : [props.items] : []
);
function isStructuralItem(item) {
  return !!item.type && ["label", "separator"].includes(item.type);
}
const filteredGroups = computed(() => {
  if (props.ignoreFilter || !searchTerm.value) {
    return groups.value;
  }
  const fields = Array.isArray(props.filterFields) ? props.filterFields : [props.labelKey];
  return filterGroups(groups.value, searchTerm.value, {
    fields,
    isStructural: isStructuralItem
  });
});
const filteredItems = computed(() => filteredGroups.value.flatMap((group) => group));
</script>

<template>
  <DefineItemTemplate v-slot="{ item, index }">
    <ListboxGroupLabel v-if="item.type === 'label'" data-slot="label" :class="ui.label({ class: [props.ui?.label, item.ui?.label, item.class] })">
      {{ get(item, props.labelKey) }}
    </ListboxGroupLabel>

    <div v-else-if="item.type === 'separator'" role="separator" data-slot="separator" :class="ui.separator({ class: [props.ui?.separator, item.ui?.separator, item.class] })" />

    <RekaListboxItem
      v-else
      :value="props.valueKey ? get(item, props.valueKey) : item"
      :disabled="item.disabled"
      data-slot="item"
      :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class] })"
      @select="onSelect($event, item)"
    >
      <slot name="item" :item="item" :index="index" :ui="ui">
        <slot name="item-leading" :item="item" :index="index" :ui="ui">
          <UIcon v-if="item.icon" :name="item.icon" data-slot="itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [props.ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })" />
          <UAvatar v-else-if="item.avatar" :size="item.ui?.itemLeadingAvatarSize || props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()" v-bind="item.avatar" data-slot="itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: [props.ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })" />
          <UChip
            v-else-if="item.chip"
            :size="item.ui?.itemLeadingChipSize || props.ui?.itemLeadingChipSize || ui.itemLeadingChipSize()"
            inset
            standalone
            v-bind="item.chip"
            data-slot="itemLeadingChip"
            :class="ui.itemLeadingChip({ class: [props.ui?.itemLeadingChip, item.ui?.itemLeadingChip] })"
          />
        </slot>

        <span v-if="get(item, props.labelKey) || get(item, props.descriptionKey) || !!slots['item-label'] || !!slots['item-description']" data-slot="itemWrapper" :class="ui.itemWrapper({ class: [props.ui?.itemWrapper, item.ui?.itemWrapper] })">
          <span v-if="get(item, props.labelKey) || !!slots['item-label']" data-slot="itemLabel" :class="ui.itemLabel({ class: [props.ui?.itemLabel, item.ui?.itemLabel] })">
            <slot name="item-label" :item="item" :index="index">
              {{ get(item, props.labelKey) }}
            </slot>
          </span>

          <span v-if="get(item, props.descriptionKey) || !!slots['item-description']" data-slot="itemDescription" :class="ui.itemDescription({ class: [props.ui?.itemDescription, item.ui?.itemDescription] })">
            <slot name="item-description" :item="item" :index="index">
              {{ get(item, props.descriptionKey) }}
            </slot>
          </span>
        </span>

        <span data-slot="itemTrailing" :class="ui.itemTrailing({ class: [props.ui?.itemTrailing, item.ui?.itemTrailing] })">
          <slot name="item-trailing" :item="item" :index="index" :ui="ui" />

          <ListboxItemIndicator as-child>
            <UIcon :name="props.selectedIcon || appConfig.ui.icons.check" data-slot="itemTrailingIcon" :class="ui.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, item.ui?.itemTrailingIcon] })" />
          </ListboxItemIndicator>
        </span>
      </slot>
    </RekaListboxItem>
  </DefineItemTemplate>

  <ListboxRoot
    :id="id"
    v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
    :disabled="disabled"
    :name="name"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @update:model-value="onUpdate"
  >
    <ListboxFilter v-if="props.filter" v-model="searchTerm" as-child>
      <UInput
        :autofocus="props.autofocus"
        :autofocus-delay="props.autofocusDelay"
        :size="size"
        v-bind="inputProps"
        data-slot="input"
        :class="ui.input({ class: props.ui?.input })"
      />
    </ListboxFilter>

    <ListboxContent data-slot="content" :class="ui.content({ class: props.ui?.content })">
      <div v-if="props.loading" data-slot="loading" :class="ui.loading({ class: props.ui?.loading })">
        <slot name="loading">
          <UIcon :name="props.loadingIcon || appConfig.ui.icons.loading" data-slot="loadingIcon" :class="ui.loadingIcon({ class: props.ui?.loadingIcon })" />
        </slot>
      </div>
      <div v-else-if="!filteredItems.length" data-slot="empty" :class="ui.empty({ class: props.ui?.empty })">
        <slot name="empty" :search-term="searchTerm">
          {{ searchTerm ? t("listbox.noMatch", { searchTerm }) : t("listbox.noData") }}
        </slot>
      </div>

      <ListboxVirtualizer
        v-else-if="!!props.virtualize"
        v-slot="{ option: item, virtualItem }"
        :options="filteredItems"
        :text-content="(item2) => get(item2, props.labelKey)"
        v-bind="virtualizerProps"
      >
        <ReuseItemTemplate :item="item" :index="virtualItem.index" />
      </ListboxVirtualizer>

      <template v-else>
        <ListboxGroup v-for="(group, groupIndex) in filteredGroups" :key="`group-${groupIndex}`" data-slot="group" :class="ui.group({ class: props.ui?.group })">
          <ReuseItemTemplate v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`" :item="item" :index="index" />
        </ListboxGroup>
      </template>
    </ListboxContent>
  </ListboxRoot>
</template>
