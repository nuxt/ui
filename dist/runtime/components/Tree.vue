<script>
import theme from "#build/ui/tree";
</script>

<script setup>
import { computed, toRef, useTemplateRef } from "vue";
import { TreeRoot, TreeItem, TreeVirtualizer, useForwardPropsEmits } from "reka-ui";
import { reactivePick, createReusableTemplate } from "@vueuse/core";
import { defu } from "defu";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { get } from "../utils";
import { getEstimateSize } from "../utils/virtualizer";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  color: { type: null, required: false },
  size: { type: null, required: false },
  getKey: { type: Function, required: false },
  labelKey: { type: null, required: false, default: "label" },
  trailingIcon: { type: null, required: false },
  expandedIcon: { type: null, required: false },
  collapsedIcon: { type: null, required: false },
  items: { type: null, required: false },
  modelValue: { type: null, required: false },
  defaultValue: { type: null, required: false },
  multiple: { type: Boolean, required: false },
  nested: { type: Boolean, required: false, default: true },
  virtualize: { type: [Boolean, Object], required: false, default: false },
  onSelect: { type: Function, required: false },
  onToggle: { type: Function, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  expanded: { type: Array, required: false },
  defaultExpanded: { type: Array, required: false },
  selectionBehavior: { type: String, required: false },
  propagateSelect: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false },
  bubbleSelect: { type: Boolean, required: false }
});
const emits = defineEmits(["update:modelValue", "update:expanded"]);
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("tree", props);
const rootProps = useForwardPropsEmits(reactivePick(props, "items", "multiple", "expanded", "disabled", "propagateSelect", "bubbleSelect"), emits);
const as = computed(() => {
  if (typeof props.as === "string" || typeof props.as?.render === "function") {
    return { root: props.as, link: "button" };
  }
  return defu(props.as, { root: "ul", link: "button" });
});
const nested = computed(() => props.virtualize ? false : props.nested);
const flattenedPaddingFormula = computed(() => {
  const sizeConfig = {
    xs: { base: 2, perLevel: 5.5 },
    // px-2, ms-4 + ps-1.5
    sm: { base: 2.5, perLevel: 6 },
    // px-2.5, ms-4.5 + ps-1.5
    md: { base: 2.5, perLevel: 6.5 },
    // px-2.5, ms-5 + ps-1.5
    lg: { base: 3, perLevel: 7 },
    // px-3, ms-5.5 + ps-1.5
    xl: { base: 3, perLevel: 7.5 }
    // px-3, ms-6 + ps-1.5
  };
  const config = sizeConfig[props.size || "md"];
  return (level) => `calc(var(--spacing) * ${(level - 1) * config.perLevel + config.base})`;
});
const virtualizerProps = toRef(() => {
  if (!props.virtualize) return false;
  return defu(typeof props.virtualize === "boolean" ? {} : props.virtualize, {
    estimateSize: getEstimateSize(props.items || [], props.size || "md")
  });
});
const [DefineTreeTemplate, ReuseTreeTemplate] = createReusableTemplate();
const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate({
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    level: {
      type: Number,
      required: true
    }
  }
});
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.tree || {} })({
  color: props.color,
  size: props.size,
  virtualize: !!props.virtualize
}));
const rootRef = useTemplateRef("rootRef");
function getItemLabel(item) {
  return get(item, props.labelKey);
}
function getItemKey(item) {
  return props.getKey ? props.getKey(item) || getItemLabel(item) : getItemLabel(item);
}
function getDefaultOpenedItems(item) {
  const currentItem = item.defaultExpanded ? getItemKey(item) : null;
  const childItems = item.children?.flatMap((child) => getDefaultOpenedItems(child)) ?? [];
  return [currentItem, ...childItems].filter(Boolean);
}
const defaultExpanded = computed(() => props.defaultExpanded ?? props.items?.flatMap((item) => getDefaultOpenedItems(item)));
defineExpose({
  get $el() {
    return rootRef.value?.$el;
  }
});
</script>

<template>
  <DefineItemTemplate v-slot="{ item, index, level }">
    <li
      role="presentation"
      :class="!!nested && level > 1 ? ui.itemWithChildren({ class: [uiProp?.itemWithChildren, item.ui?.itemWithChildren] }) : ui.item({ class: [uiProp?.item, item.ui?.item] })"
    >
      <TreeItem
        v-slot="{ isExpanded, isSelected, isIndeterminate, handleSelect, handleToggle }"
        :level="level"
        :value="item"
        as-child
        @toggle="(item.onToggle ?? props.onToggle)?.($event, item)"
        @select="(item.onSelect ?? props.onSelect)?.($event, item)"
      >
        <slot
          :name="item.slot ? `${item.slot}-wrapper` : 'item-wrapper'"
          v-bind="{ index, level, expanded: isExpanded, selected: isSelected, indeterminate: isIndeterminate, handleSelect, handleToggle, ui }"
          :item="item"
        >
          <component
            :is="as.link"
            :type="as.link === 'button' ? 'button' : void 0"
            :disabled="item.disabled || disabled"
            data-slot="link"
            :class="ui.link({ class: [uiProp?.link, item.ui?.link, item.class], selected: isSelected, disabled: item.disabled || disabled })"
            :style="!nested && level > 1 ? { paddingLeft: flattenedPaddingFormula(level) } : void 0"
          >
            <slot
              :name="item.slot || 'item'"
              v-bind="{ index, level, expanded: isExpanded, selected: isSelected, indeterminate: isIndeterminate, handleSelect, handleToggle, ui }"
              :item="item"
            >
              <slot
                :name="item.slot ? `${item.slot}-leading` : 'item-leading'"
                v-bind="{ index, level, expanded: isExpanded, selected: isSelected, indeterminate: isIndeterminate, handleSelect, handleToggle, ui }"
                :item="item"
              >
                <UIcon
                  v-if="item.icon"
                  :name="item.icon"
                  data-slot="linkLeadingIcon"
                  :class="ui.linkLeadingIcon({ class: [uiProp?.linkLeadingIcon, item.ui?.linkLeadingIcon] })"
                />
                <UIcon
                  v-else-if="item.children?.length"
                  :name="isExpanded ? expandedIcon ?? appConfig.ui.icons.folderOpen : collapsedIcon ?? appConfig.ui.icons.folder"
                  data-slot="linkLeadingIcon"
                  :class="ui.linkLeadingIcon({ class: [uiProp?.linkLeadingIcon, item.ui?.linkLeadingIcon] })"
                />
              </slot>

              <span
                v-if="getItemLabel(item) || !!slots[item.slot ? `${item.slot}-label` : 'item-label']"
                data-slot="linkLabel"
                :class="ui.linkLabel({ class: [uiProp?.linkLabel, item.ui?.linkLabel] })"
              >
                <slot
                  :name="item.slot ? `${item.slot}-label` : 'item-label'"
                  v-bind="{ index, level, expanded: isExpanded, selected: isSelected, indeterminate: isIndeterminate, handleSelect, handleToggle, ui }"
                  :item="item"
                >
                  {{ getItemLabel(item) }}
                </slot>
              </span>

              <span
                v-if="item.trailingIcon || item.children?.length || !!slots[item.slot ? `${item.slot}-trailing` : 'item-trailing']"
                data-slot="linkTrailing"
                :class="ui.linkTrailing({ class: [uiProp?.linkTrailing, item.ui?.linkTrailing] })"
              >
                <slot
                  :name="item.slot ? `${item.slot}-trailing` : 'item-trailing'"
                  v-bind="{ index, level, expanded: isExpanded, selected: isSelected, indeterminate: isIndeterminate, handleSelect, handleToggle, ui }"
                  :item="item"
                >
                  <UIcon
                    v-if="item.trailingIcon"
                    :name="item.trailingIcon"
                    data-slot="linkTrailingIcon"
                    :class="ui.linkTrailingIcon({ class: [uiProp?.linkTrailingIcon, item.ui?.linkTrailingIcon] })"
                  />
                  <UIcon
                    v-else-if="item.children?.length"
                    :name="trailingIcon ?? appConfig.ui.icons.chevronDown"
                    data-slot="linkTrailingIcon"
                    :class="ui.linkTrailingIcon({ class: [uiProp?.linkTrailingIcon, item.ui?.linkTrailingIcon] })"
                  />
                </slot>
              </span>
            </slot>
          </component>
        </slot>

        <ul
          v-if="nested && item.children?.length && isExpanded"
          role="group"
          data-slot="listWithChildren"
          :class="ui.listWithChildren({ class: [uiProp?.listWithChildren, item.ui?.listWithChildren] })"
        >
          <ReuseTreeTemplate :items="item.children" :level="level + 1" />
        </ul>
      </TreeItem>
    </li>
  </DefineItemTemplate>

  <DefineTreeTemplate v-slot="{ items, level }">
    <ReuseItemTemplate v-for="(item, index) in items" :key="`${level}-${index}`" :item="item" :index="index" :level="level" />
  </DefineTreeTemplate>

  <TreeRoot
    ref="rootRef"
    v-slot="{ flattenItems }"
    v-bind="{ ...rootProps, ...$attrs }"
    :as="as.root"
    :model-value="modelValue"
    :default-value="defaultValue"
    data-slot="root"
    :class="ui.root({ class: [uiProp?.root, props.class] })"
    :get-key="getItemKey"
    :default-expanded="defaultExpanded"
    :selection-behavior="selectionBehavior"
  >
    <TreeVirtualizer
      v-if="!!virtualize"
      v-slot="{ item, virtualItem }"
      :text-content="(item2) => getItemLabel(item2.value)"
      v-bind="virtualizerProps"
    >
      <ReuseItemTemplate :item="item.value" :index="virtualItem.index" :level="item.level" />
    </TreeVirtualizer>

    <template v-else-if="!nested">
      <ReuseItemTemplate
        v-for="(item, index) in flattenItems"
        :key="item._id"
        :item="item.value"
        :index="index"
        :level="item.level"
      />
    </template>

    <ReuseTreeTemplate v-else :items="items" :level="1" />
  </TreeRoot>
</template>
