<script>

</script>

<script setup>
import { computed, ref, toRef } from "vue";
import { defu } from "defu";
import { DropdownMenu } from "reka-ui/namespaced";
import { useForwardPropsEmits } from "reka-ui";
import { reactiveOmit, createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { FieldGroupReset } from "../composables/useFieldGroup";
import { useFilter } from "../composables/useFilter";
import { useLocale } from "../composables/useLocale";
import { usePortal } from "../composables/usePortal";
import { omit, get, isArrayOfArray } from "../utils";
import { pickLinkProps } from "../utils/link";
import ULinkBase from "./LinkBase.vue";
import ULink from "./Link.vue";
import UAvatar from "./Avatar.vue";
import UIcon from "./Icon.vue";
import UInput from "./Input.vue";
import UKbd from "./Kbd.vue";
import UDropdownMenuContent from "./DropdownMenuContent.vue";
const props = defineProps({
  items: { type: null, required: false },
  portal: { type: [Boolean, String], required: false, skipCheck: true },
  sub: { type: Boolean, required: false },
  labelKey: { type: null, required: true },
  descriptionKey: { type: null, required: true },
  checkedIcon: { type: null, required: false },
  loadingIcon: { type: null, required: false },
  externalIcon: { type: [Boolean, String], required: false, skipCheck: true },
  size: { type: null, required: false },
  filter: { type: [Boolean, Object], required: false },
  filterFields: { type: Array, required: false },
  ignoreFilter: { type: Boolean, required: false },
  searchTerm: { type: String, required: false },
  class: { type: null, required: false },
  ui: { type: null, required: true },
  uiOverride: { type: null, required: false },
  loop: { type: Boolean, required: false },
  side: { type: null, required: false },
  sideOffset: { type: Number, required: false },
  sideFlip: { type: Boolean, required: false },
  align: { type: null, required: false },
  alignOffset: { type: Number, required: false },
  alignFlip: { type: Boolean, required: false },
  avoidCollisions: { type: Boolean, required: false },
  collisionBoundary: { type: null, required: false },
  collisionPadding: { type: [Number, Object], required: false },
  arrowPadding: { type: Number, required: false },
  hideShiftedArrow: { type: Boolean, required: false },
  sticky: { type: String, required: false },
  hideWhenDetached: { type: Boolean, required: false },
  positionStrategy: { type: String, required: false },
  updatePositionStrategy: { type: String, required: false },
  disableUpdateOnLayoutShift: { type: Boolean, required: false },
  prioritizePosition: { type: Boolean, required: false },
  reference: { type: null, required: false }
});
const emits = defineEmits(["update:searchTerm", "escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "closeAutoFocus"]);
const slots = defineSlots();
const { t, dir } = useLocale();
const appConfig = useAppConfig();
const { filterGroups } = useFilter();
const _searchTerm = ref("");
const searchTerm = computed({
  get: () => props.searchTerm ?? _searchTerm.value,
  set: (value) => {
    _searchTerm.value = value;
    emits("update:searchTerm", value);
  }
});
const inputProps = toRef(() => defu(props.filter, { placeholder: t("dropdownMenu.search"), variant: "none" }));
const portalProps = usePortal(toRef(() => props.portal));
const contentProps = useForwardPropsEmits(reactiveOmit(props, "sub", "items", "portal", "labelKey", "descriptionKey", "checkedIcon", "loadingIcon", "externalIcon", "size", "filter", "filterFields", "ignoreFilter", "searchTerm", "class", "ui", "uiOverride"), emits);
const getProxySlots = () => omit(slots, ["default"]);
const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate();
const childrenIcon = computed(() => dir.value === "rtl" ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight);
const groups = computed(() => {
  if (!props.items?.length) return [];
  return isArrayOfArray(props.items) ? props.items : [props.items];
});
const isStructuralItem = (item) => !!item.type && ["label", "separator"].includes(item.type);
const filteredGroups = computed(() => {
  if (!props.filter || props.ignoreFilter || !searchTerm.value) {
    return groups.value;
  }
  const fields = Array.isArray(props.filterFields) && props.filterFields.length ? props.filterFields : [props.labelKey];
  return filterGroups(groups.value, searchTerm.value, {
    fields,
    isStructural: isStructuralItem
  });
});
const hasFilteredItems = computed(() => filteredGroups.value.some((group) => group.some((item) => !isStructuralItem(item))));
</script>

<template>
  <DefineItemTemplate v-slot="{ item, active, index }">
    <slot :name="item.slot || 'item'" :item="item" :index="index" :ui="ui">
      <slot :name="item.slot ? `${item.slot}-leading` : 'item-leading'" :item="item" :active="active" :index="index" :ui="ui">
        <UIcon v-if="item.loading" :name="loadingIcon || appConfig.ui.icons.loading" data-slot="itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [uiOverride?.itemLeadingIcon, item.ui?.itemLeadingIcon], color: item?.color, loading: true })" />
        <UIcon v-else-if="item.icon" :name="item.icon" data-slot="itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [uiOverride?.itemLeadingIcon, item.ui?.itemLeadingIcon], color: item?.color, active })" />
        <UAvatar v-else-if="item.avatar" :size="item.ui?.itemLeadingAvatarSize || uiOverride?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()" v-bind="item.avatar" data-slot="itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: [uiOverride?.itemLeadingAvatar, item.ui?.itemLeadingAvatar], active })" />
      </slot>

      <span v-if="get(item, props.labelKey) || !!slots[item.slot ? `${item.slot}-label` : 'item-label'] || (get(item, props.descriptionKey) || !!slots[item.slot ? `${item.slot}-description` : 'item-description'])" data-slot="itemWrapper" :class="ui.itemWrapper({ class: [uiOverride?.itemWrapper, item.ui?.itemWrapper] })">
        <span data-slot="itemLabel" :class="ui.itemLabel({ class: [uiOverride?.itemLabel, item.ui?.itemLabel], active })">
          <slot :name="item.slot ? `${item.slot}-label` : 'item-label'" :item="item" :active="active" :index="index">
            {{ get(item, props.labelKey) }}
          </slot>

          <UIcon v-if="item.target === '_blank' && externalIcon !== false" :name="typeof externalIcon === 'string' ? externalIcon : appConfig.ui.icons.external" data-slot="itemLabelExternalIcon" :class="ui.itemLabelExternalIcon({ class: [uiOverride?.itemLabelExternalIcon, item.ui?.itemLabelExternalIcon], color: item?.color, active })" />
        </span>

        <span v-if="get(item, props.descriptionKey) || !!slots[item.slot ? `${item.slot}-description` : 'item-description']" data-slot="itemDescription" :class="ui.itemDescription({ class: [uiOverride?.itemDescription, item.ui?.itemDescription] })">
          <slot :name="item.slot ? `${item.slot}-description` : 'item-description'" :item="item" :active="active" :index="index">
            {{ get(item, props.descriptionKey) }}
          </slot>
        </span>
      </span>

      <span data-slot="itemTrailing" :class="ui.itemTrailing({ class: [uiOverride?.itemTrailing, item.ui?.itemTrailing] })">
        <slot :name="item.slot ? `${item.slot}-trailing` : 'item-trailing'" :item="item" :active="active" :index="index" :ui="ui">
          <UIcon v-if="item.children?.length" :name="childrenIcon" data-slot="itemTrailingIcon" :class="ui.itemTrailingIcon({ class: [uiOverride?.itemTrailingIcon, item.ui?.itemTrailingIcon], color: item?.color, active })" />
          <span v-else-if="item.kbds?.length" data-slot="itemTrailingKbds" :class="ui.itemTrailingKbds({ class: [uiOverride?.itemTrailingKbds, item.ui?.itemTrailingKbds] })">
            <UKbd v-for="(kbd, kbdIndex) in item.kbds" :key="kbdIndex" :size="item.ui?.itemTrailingKbdsSize || uiOverride?.itemTrailingKbdsSize || ui.itemTrailingKbdsSize()" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
          </span>
        </slot>

        <DropdownMenu.ItemIndicator as-child>
          <UIcon :name="checkedIcon || appConfig.ui.icons.check" data-slot="itemTrailingIcon" :class="ui.itemTrailingIcon({ class: [uiOverride?.itemTrailingIcon, item.ui?.itemTrailingIcon], color: item?.color })" />
        </DropdownMenu.ItemIndicator>
      </span>
    </slot>
  </DefineItemTemplate>

  <DropdownMenu.Portal v-bind="portalProps">
    <FieldGroupReset>
      <component :is="sub ? DropdownMenu.SubContent : DropdownMenu.Content" data-slot="content" :class="ui.content({ class: [uiOverride?.content, props.class] })" v-bind="contentProps">
        <DropdownMenu.Filter v-if="!!filter" v-model="searchTerm" as-child>
          <UInput
            autofocus
            autocomplete="off"
            :size="size"
            v-bind="inputProps"
            data-slot="input"
            :class="ui.input({ class: uiOverride?.input })"
            @change.stop
          />
        </DropdownMenu.Filter>

        <slot name="content-top" :sub="sub ?? false" />

        <div v-if="!searchTerm || hasFilteredItems" role="presentation" data-slot="viewport" :class="ui.viewport({ class: uiOverride?.viewport })">
          <DropdownMenu.Group v-for="(group, groupIndex) in filteredGroups" :key="`group-${groupIndex}`" data-slot="group" :class="ui.group({ class: uiOverride?.group })">
            <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
              <DropdownMenu.Label v-if="item.type === 'label'" data-slot="label" :class="ui.label({ class: [uiOverride?.label, item.ui?.label, item.class] })">
                <ReuseItemTemplate :item="item" :index="index" />
              </DropdownMenu.Label>
              <DropdownMenu.Separator v-else-if="item.type === 'separator'" data-slot="separator" :class="ui.separator({ class: [uiOverride?.separator, item.ui?.separator, item.class] })" />
              <DropdownMenu.Sub v-else-if="item?.children?.length" :open="item.open" :default-open="item.defaultOpen">
                <DropdownMenu.SubTrigger
                  as="button"
                  type="button"
                  :disabled="item.disabled"
                  :text-value="get(item, props.labelKey)"
                  data-slot="item"
                  :class="ui.item({ class: [uiOverride?.item, item.ui?.item, item.class], color: item?.color })"
                >
                  <ReuseItemTemplate :item="item" :index="index" />
                </DropdownMenu.SubTrigger>

                <UDropdownMenuContent
                  sub
                  :class="item.ui?.content"
                  :ui="ui"
                  :ui-override="uiOverride"
                  :portal="portal"
                  :items="item.children"
                  align="start"
                  :align-offset="-4"
                  :side-offset="3"
                  :label-key="labelKey"
                  :description-key="descriptionKey"
                  :checked-icon="checkedIcon"
                  :loading-icon="loadingIcon"
                  :external-icon="externalIcon"
                  :size="size"
                  :filter="item.filter"
                  :filter-fields="item.filterFields || filterFields"
                  :ignore-filter="item.ignoreFilter ?? ignoreFilter"
                  v-bind="item.content"
                >
                  <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
                    <slot :name="name" v-bind="slotData" />
                  </template>
                </UDropdownMenuContent>
              </DropdownMenu.Sub>
              <DropdownMenu.CheckboxItem
                v-else-if="item.type === 'checkbox'"
                :model-value="item.checked"
                :disabled="item.disabled"
                :text-value="get(item, props.labelKey)"
                data-slot="item"
                :class="ui.item({ class: [uiOverride?.item, item.ui?.item, item.class], color: item?.color })"
                @update:model-value="item.onUpdateChecked"
                @select="item.onSelect"
              >
                <ReuseItemTemplate :item="item" :index="index" />
              </DropdownMenu.CheckboxItem>
              <ULink v-else v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(item)" custom>
                <DropdownMenu.Item
                  as-child
                  :disabled="item.disabled"
                  :text-value="get(item, props.labelKey)"
                  @select="item.onSelect"
                >
                  <ULinkBase v-bind="slotProps" data-slot="item" :class="ui.item({ class: [uiOverride?.item, item.ui?.item, item.class], color: item?.color, active })">
                    <ReuseItemTemplate :item="item" :active="active" :index="index" />
                  </ULinkBase>
                </DropdownMenu.Item>
              </ULink>
            </template>
          </DropdownMenu.Group>
        </div>

        <div v-if="searchTerm && !hasFilteredItems" data-slot="empty" :class="ui.empty({ class: uiOverride?.empty })">
          <slot name="empty" :search-term="searchTerm">
            {{ t("dropdownMenu.noMatch", { searchTerm }) }}
          </slot>
        </div>

        <slot />

        <slot name="content-bottom" :sub="sub ?? false" />
      </component>
    </FieldGroupReset>
  </DropdownMenu.Portal>
</template>
