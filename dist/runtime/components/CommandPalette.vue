<script>
import theme from "#build/ui/command-palette";
</script>

<script setup>
import { computed, ref, useTemplateRef, toRef } from "vue";
import { ListboxRoot, ListboxFilter, ListboxContent, ListboxGroup, ListboxGroupLabel, ListboxVirtualizer, ListboxItem, ListboxItemIndicator, useForwardPropsEmits } from "reka-ui";
import { defu } from "defu";
import { reactivePick, createReusableTemplate, refThrottled } from "@vueuse/core";
import { useFuse } from "@vueuse/integrations/useFuse";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useLocale } from "../composables/useLocale";
import { omit, get } from "../utils";
import { highlight } from "../utils/fuse";
import { pickLinkProps } from "../utils/link";
import { getEstimateSize } from "../utils/virtualizer";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
import UAvatar from "./Avatar.vue";
import UButton from "./Button.vue";
import UChip from "./Chip.vue";
import ULinkBase from "./LinkBase.vue";
import ULink from "./Link.vue";
import UInput from "./Input.vue";
import UKbd from "./Kbd.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  size: { type: null, required: false },
  icon: { type: null, required: false },
  trailingIcon: { type: null, required: false },
  selectedIcon: { type: null, required: false },
  childrenIcon: { type: null, required: false },
  placeholder: { type: String, required: false },
  autofocus: { type: Boolean, required: false, default: true },
  close: { type: [Boolean, Object], required: false },
  closeIcon: { type: null, required: false },
  back: { type: [Boolean, Object], required: false, default: true },
  backIcon: { type: null, required: false },
  input: { type: [Boolean, Object], required: false, default: true },
  groups: { type: Array, required: false },
  fuse: { type: Object, required: false },
  virtualize: { type: [Boolean, Object], required: false, default: false },
  valueKey: { type: null, required: false },
  labelKey: { type: null, required: false, default: "label" },
  descriptionKey: { type: null, required: false, default: "description" },
  preserveGroupOrder: { type: Boolean, required: false, default: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  multiple: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false },
  modelValue: { type: null, required: false },
  defaultValue: { type: null, required: false },
  highlightOnHover: { type: Boolean, required: false, default: true },
  selectionBehavior: { type: String, required: false },
  by: { type: [String, Function], required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: null, required: false }
});
const emits = defineEmits(["update:modelValue", "highlight", "entryFocus", "leave", "update:open"]);
const slots = defineSlots();
const searchTerm = defineModel("searchTerm", { type: String, ...{ default: "" } });
const { t } = useLocale();
const appConfig = useAppConfig();
const uiProp = useComponentUI("commandPalette", props);
const rootProps = useForwardPropsEmits(reactivePick(props, "as", "disabled", "multiple", "modelValue", "defaultValue", "highlightOnHover", "by"), emits);
const virtualizerProps = toRef(() => {
  if (!props.virtualize) return false;
  return defu(typeof props.virtualize === "boolean" ? {} : props.virtualize, {
    estimateSize: getEstimateSize(filteredItems.value, "md", props.descriptionKey, !!slots["item-description"])
  });
});
const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate({
  props: {
    item: {
      type: Object,
      required: true
    },
    group: {
      type: Object,
      required: false
    },
    index: {
      type: Number,
      required: false
    }
  }
});
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.commandPalette || {} })({
  size: props.size,
  virtualize: !!props.virtualize
}));
const fuse = computed(() => defu({}, props.fuse, {
  fuseOptions: {
    ignoreLocation: true,
    threshold: 0.1,
    keys: [props.labelKey, "suffix"]
  },
  resultLimit: 12,
  matchAllWhenSearchEmpty: true
}));
const history = ref([]);
const placeholder = computed(() => history.value[history.value.length - 1]?.placeholder || props.placeholder || t("commandPalette.placeholder"));
const groups = computed(() => history.value?.length ? [history.value[history.value.length - 1]] : props.groups);
const items = computed(() => groups.value?.filter((group) => {
  if (!group.id) {
    console.warn(`[@nuxt/ui] CommandPalette group is missing an \`id\` property`);
    return false;
  }
  if (group.ignoreFilter) {
    return false;
  }
  return true;
})?.flatMap((group) => group.items?.map((item) => ({ ...item, group: group.id })) || []) || []);
const { results: fuseResults } = useFuse(searchTerm, items, fuse);
const throttledFuseResults = refThrottled(fuseResults, 16, true);
function processGroupItems(group, items2) {
  let processedItems = items2;
  if (group?.postFilter && typeof group.postFilter === "function") {
    processedItems = group.postFilter(searchTerm.value, processedItems);
  }
  return {
    ...group,
    items: processedItems.slice(0, fuse.value.resultLimit).map((item) => {
      return {
        ...item,
        labelHtml: highlight(item, searchTerm.value, props.labelKey),
        suffixHtml: highlight(item, searchTerm.value, void 0, [props.labelKey])
      };
    })
  };
}
const filteredGroups = computed(() => {
  const currentGroups = groups.value;
  const groupsById = throttledFuseResults.value.reduce((acc, result) => {
    const { item, matches } = result;
    if (!item.group) {
      return acc;
    }
    acc[item.group] ||= [];
    acc[item.group]?.push({ ...item, matches });
    return acc;
  }, {});
  if (props.preserveGroupOrder) {
    const processedGroups = [];
    for (const group of currentGroups || []) {
      if (!group.items?.length) {
        continue;
      }
      const items2 = group.ignoreFilter ? group.items : groupsById[group.id];
      if (!items2?.length) {
        continue;
      }
      const processedGroup = processGroupItems(group, items2);
      if (processedGroup.items?.length) {
        processedGroups.push(processedGroup);
      }
    }
    return processedGroups;
  }
  const fuseGroups = Object.entries(groupsById).map(([id, items2]) => {
    const group = currentGroups?.find((group2) => group2.id === id);
    if (!group) {
      return;
    }
    const processedGroup = processGroupItems(group, items2);
    return processedGroup.items?.length ? processedGroup : void 0;
  }).filter((group) => !!group);
  const nonFuseGroups = currentGroups?.map((group, index) => ({ ...group, index }))?.filter((group) => group.ignoreFilter && group.items?.length)?.map((group) => {
    const processedGroup = processGroupItems(group, group.items || []);
    return { ...processedGroup, index: group.index };
  })?.filter((group) => group.items?.length) || [];
  return nonFuseGroups.reduce((acc, group) => {
    acc.splice(group.index, 0, group);
    return acc;
  }, [...fuseGroups]);
});
const filteredItems = computed(() => filteredGroups.value.flatMap((group) => group.items || []));
const rootRef = useTemplateRef("rootRef");
function navigate(item) {
  if (!item.children?.length) {
    return;
  }
  history.value.push({
    id: `history-${history.value.length}`,
    label: item.label,
    slot: item.slot,
    placeholder: item.placeholder,
    items: item.children
  });
  searchTerm.value = "";
  rootRef.value?.highlightFirstItem();
}
function navigateBack() {
  if (!history.value.length) {
    return;
  }
  history.value.pop();
  searchTerm.value = "";
  rootRef.value?.highlightFirstItem();
}
function onBackspace() {
  if (!searchTerm.value) {
    navigateBack();
  }
}
function onSelect(e, item) {
  if (item.children?.length) {
    e.preventDefault();
    navigate(item);
  } else {
    item.onSelect?.(e);
  }
}
</script>

<template>
  <DefineItemTemplate v-slot="{ item, index, group }">
    <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(item)" custom>
      <ListboxItem
        :value="props.valueKey ? get(item, props.valueKey) : omit(item, ['matches', 'group', 'onSelect', 'labelHtml', 'suffixHtml', 'children'])"
        :disabled="item.disabled"
        as-child
        @select="onSelect($event, item)"
      >
        <ULinkBase v-bind="slotProps" data-slot="item" :class="ui.item({ class: [uiProp?.item, item.ui?.item, item.class], active: active || item.active })">
          <slot :name="item.slot || group?.slot || 'item'" :item="item" :index="index" :ui="ui">
            <slot :name="item.slot ? `${item.slot}-leading` : group?.slot ? `${group.slot}-leading` : `item-leading`" :item="item" :index="index" :ui="ui">
              <UIcon v-if="item.loading" :name="loadingIcon || appConfig.ui.icons.loading" data-slot="itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [uiProp?.itemLeadingIcon, item.ui?.itemLeadingIcon], loading: true })" />
              <UIcon v-else-if="item.icon" :name="item.icon" data-slot="itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [uiProp?.itemLeadingIcon, item.ui?.itemLeadingIcon], active: active || item.active })" />
              <UAvatar v-else-if="item.avatar" :size="item.ui?.itemLeadingAvatarSize || uiProp?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()" v-bind="item.avatar" data-slot="itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: [uiProp?.itemLeadingAvatar, item.ui?.itemLeadingAvatar], active: active || item.active })" />
              <UChip
                v-else-if="item.chip"
                :size="item.ui?.itemLeadingChipSize || uiProp?.itemLeadingChipSize || ui.itemLeadingChipSize()"
                inset
                standalone
                v-bind="item.chip"
                data-slot="itemLeadingChip"
                :class="ui.itemLeadingChip({ class: [uiProp?.itemLeadingChip, item.ui?.itemLeadingChip], active: active || item.active })"
              />
            </slot>

            <span v-if="item.prefix || (item.labelHtml || get(item, props.labelKey)) || (item.suffixHtml || item.suffix) || !!slots[item.slot ? `${item.slot}-label` : group?.slot ? `${group.slot}-label` : `item-label`] || (get(item, props.descriptionKey) || !!slots[item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`])" data-slot="itemWrapper" :class="ui.itemWrapper({ class: [uiProp?.itemWrapper, item.ui?.itemWrapper] })">
              <span data-slot="itemLabel" :class="ui.itemLabel({ class: [uiProp?.itemLabel, item.ui?.itemLabel], active: active || item.active })">
                <slot :name="item.slot ? `${item.slot}-label` : group?.slot ? `${group.slot}-label` : `item-label`" :item="item" :index="index" :ui="ui">
                  <span v-if="item.prefix" data-slot="itemLabelPrefix" :class="ui.itemLabelPrefix({ class: [uiProp?.itemLabelPrefix, item.ui?.itemLabelPrefix] })">{{ item.prefix }}</span>

                  <span v-if="item.labelHtml" data-slot="itemLabelBase" :class="ui.itemLabelBase({ class: [uiProp?.itemLabelBase, item.ui?.itemLabelBase], active: active || item.active })" v-html="item.labelHtml" />
                  <span v-else data-slot="itemLabelBase" :class="ui.itemLabelBase({ class: [uiProp?.itemLabelBase, item.ui?.itemLabelBase], active: active || item.active })">{{ get(item, props.labelKey) }}</span>

                  <span v-if="item.suffixHtml" data-slot="itemLabelSuffix" :class="ui.itemLabelSuffix({ class: [uiProp?.itemLabelSuffix, item.ui?.itemLabelSuffix], active: active || item.active })" v-html="item.suffixHtml" />
                  <span v-else-if="item.suffix" data-slot="itemLabelSuffix" :class="ui.itemLabelSuffix({ class: [uiProp?.itemLabelSuffix, item.ui?.itemLabelSuffix], active: active || item.active })">{{ item.suffix }}</span>
                </slot>
              </span>

              <span v-if="get(item, props.descriptionKey) || !!slots[item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`]" data-slot="itemDescription" :class="ui.itemDescription({ class: [uiProp?.itemDescription, item.ui?.itemDescription] })">
                <slot :name="item.slot ? `${item.slot}-description` : group?.slot ? `${group.slot}-description` : `item-description`" :item="item" :index="index" :ui="ui">
                  {{ get(item, props.descriptionKey) }}
                </slot>
              </span>
            </span>

            <span data-slot="itemTrailing" :class="ui.itemTrailing({ class: [uiProp?.itemTrailing, item.ui?.itemTrailing] })">
              <slot :name="item.slot ? `${item.slot}-trailing` : group?.slot ? `${group.slot}-trailing` : `item-trailing`" :item="item" :index="index" :ui="ui">
                <UIcon
                  v-if="item.children && item.children.length > 0"
                  :name="childrenIcon || appConfig.ui.icons.chevronRight"
                  data-slot="itemTrailingIcon"
                  :class="ui.itemTrailingIcon({ class: [uiProp?.itemTrailingIcon, item.ui?.itemTrailingIcon] })"
                />

                <span v-else-if="item.kbds?.length" data-slot="itemTrailingKbds" :class="ui.itemTrailingKbds({ class: [uiProp?.itemTrailingKbds, item.ui?.itemTrailingKbds] })">
                  <UKbd v-for="(kbd, kbdIndex) in item.kbds" :key="kbdIndex" :size="item.ui?.itemTrailingKbdsSize || uiProp?.itemTrailingKbdsSize || ui.itemTrailingKbdsSize()" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
                </span>

                <UIcon v-else-if="group?.highlightedIcon" :name="group.highlightedIcon" data-slot="itemTrailingHighlightedIcon" :class="ui.itemTrailingHighlightedIcon({ class: [uiProp?.itemTrailingHighlightedIcon, item.ui?.itemTrailingHighlightedIcon] })" />
              </slot>

              <ListboxItemIndicator v-if="!item.children?.length" as-child>
                <UIcon :name="selectedIcon || appConfig.ui.icons.check" data-slot="itemTrailingIcon" :class="ui.itemTrailingIcon({ class: [uiProp?.itemTrailingIcon, item.ui?.itemTrailingIcon] })" />
              </ListboxItemIndicator>
            </span>
          </slot>
        </ULinkBase>
      </ListboxItem>
    </ULink>
  </DefineItemTemplate>

  <ListboxRoot v-bind="{ ...rootProps, ...$attrs }" ref="rootRef" :selection-behavior="selectionBehavior" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <ListboxFilter v-if="input" v-model="searchTerm" as-child>
      <UInput
        variant="none"
        :size="size"
        v-bind="typeof props.input === 'object' ? props.input : {}"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :loading="loading"
        :loading-icon="loadingIcon"
        :trailing-icon="trailingIcon"
        :icon="icon || appConfig.ui.icons.search"
        data-slot="input"
        :class="ui.input({ class: uiProp?.input })"
        @keydown.backspace="onBackspace"
      >
        <template v-if="history?.length && (back || !!slots.back)" #leading>
          <slot name="back" :ui="ui">
            <UButton
              :size="size"
              :icon="backIcon || appConfig.ui.icons.arrowLeft"
              color="neutral"
              variant="link"
              :aria-label="t('commandPalette.back')"
              v-bind="typeof back === 'object' ? back : {}"
              data-slot="back"
              :class="ui.back({ class: uiProp?.back })"
              @click="navigateBack"
            />
          </slot>
        </template>

        <template v-if="close || !!slots.close" #trailing>
          <slot name="close" :ui="ui">
            <UButton
              v-if="close"
              :size="size"
              :icon="closeIcon || appConfig.ui.icons.close"
              color="neutral"
              variant="ghost"
              :aria-label="t('commandPalette.close')"
              v-bind="typeof close === 'object' ? close : {}"
              data-slot="close"
              :class="ui.close({ class: uiProp?.close })"
              @click="emits('update:open', false)"
            />
          </slot>
        </template>
      </UInput>
    </ListboxFilter>

    <ListboxContent data-slot="content" :class="ui.content({ class: uiProp?.content })">
      <div v-if="filteredGroups?.length" role="presentation" data-slot="viewport" :class="ui.viewport({ class: uiProp?.viewport })">
        <ListboxVirtualizer
          v-if="!!virtualize"
          v-slot="{ option: item, virtualItem }"
          :options="filteredItems"
          :text-content="(item2) => get(item2, props.labelKey)"
          v-bind="virtualizerProps"
        >
          <ReuseItemTemplate :item="item" :index="virtualItem.index" />
        </ListboxVirtualizer>

        <template v-else>
          <ListboxGroup v-for="group in filteredGroups" :key="`group-${group.id}`" data-slot="group" :class="ui.group({ class: uiProp?.group })">
            <ListboxGroupLabel v-if="get(group, props.labelKey) || !!slots[group.slot ? `${group.slot}-group-label` : 'group-label']" data-slot="label" :class="ui.label({ class: uiProp?.label })">
              <slot :name="group.slot ? `${group.slot}-group-label` : 'group-label'" :group="group" :label="get(group, props.labelKey)" :ui="ui">
                {{ get(group, props.labelKey) }}
              </slot>
            </ListboxGroupLabel>

            <ReuseItemTemplate
              v-for="(item, index) in group.items"
              :key="`group-${group.id}-${index}`"
              :item="item"
              :index="index"
              :group="group"
            />
          </ListboxGroup>
        </template>
      </div>

      <div v-else data-slot="empty" :class="ui.empty({ class: uiProp?.empty })">
        <slot name="empty" :search-term="searchTerm">
          {{ searchTerm ? t("commandPalette.noMatch", { searchTerm }) : t("commandPalette.noData") }}
        </slot>
      </div>
    </ListboxContent>

    <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: uiProp?.footer })">
      <slot name="footer" :ui="ui" />
    </div>
  </ListboxRoot>
</template>
