<script>
import theme from "#build/ui/navigation-menu";
</script>

<script setup>
import { computed, toRef } from "vue";
import { NavigationMenuRoot, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport, AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent } from "reka-ui";
import { useForwardProps } from "../composables/useForwardProps";
import { defu } from "defu";
import { reactivePick, createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { get, isArrayOfArray } from "../utils";
import { tv } from "../utils/tv";
import { pickLinkProps } from "../utils/link";
import ULinkBase from "./LinkBase.vue";
import ULink from "./Link.vue";
import UAvatar from "./Avatar.vue";
import UIcon from "./Icon.vue";
import UBadge from "./Badge.vue";
import UChip from "./Chip.vue";
import UPopover from "./Popover.vue";
import UTooltip from "./Tooltip.vue";
defineOptions({ inheritAttrs: false });
const _props = defineProps({
  as: { type: null, required: false },
  type: { type: null, required: false, default: "multiple" },
  modelValue: { type: null, required: false },
  defaultValue: { type: null, required: false },
  trailingIcon: { type: null, required: false },
  externalIcon: { type: [Boolean, String], required: false, skipCheck: true, default: true },
  items: { type: null, required: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  orientation: { type: null, required: false, default: "horizontal" },
  collapsed: { type: Boolean, required: false },
  tooltip: { type: [Boolean, Object], required: false },
  popover: { type: [Boolean, Object], required: false },
  highlight: { type: Boolean, required: false },
  highlightColor: { type: null, required: false },
  content: { type: Object, required: false },
  contentOrientation: { type: null, required: false, default: "horizontal" },
  arrow: { type: Boolean, required: false },
  valueKey: { type: null, required: false, default: "value" },
  labelKey: { type: null, required: false, default: "label" },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  delayDuration: { type: Number, required: false, default: 0 },
  disableClickTrigger: { type: Boolean, required: false },
  disableHoverTrigger: { type: Boolean, required: false },
  skipDelayDuration: { type: Number, required: false },
  disablePointerLeaveClose: { type: Boolean, required: false },
  unmountOnHide: { type: Boolean, required: false, default: true },
  disabled: { type: Boolean, required: false },
  collapsible: { type: Boolean, required: false, default: true }
});
const emits = defineEmits(["update:modelValue"]);
const slots = defineSlots();
const props = useComponentProps("navigationMenu", _props);
const appConfig = useAppConfig();
const rootProps = useForwardProps(computed(() => ({
  as: props.as,
  delayDuration: props.delayDuration,
  skipDelayDuration: props.skipDelayDuration,
  orientation: props.orientation,
  disableClickTrigger: props.disableClickTrigger,
  disableHoverTrigger: props.disableHoverTrigger,
  disablePointerLeaveClose: props.disablePointerLeaveClose,
  unmountOnHide: props.unmountOnHide
})), emits);
const accordionProps = useForwardProps(reactivePick(props, "collapsible", "disabled", "type", "unmountOnHide"), emits);
const contentProps = toRef(() => props.content);
const tooltipProps = toRef(() => defu(typeof props.tooltip === "boolean" ? {} : props.tooltip, { ...props.orientation === "vertical" && { delayDuration: 0, content: { side: "right" } } }));
const popoverProps = toRef(() => defu(typeof props.popover === "boolean" ? {} : props.popover, { mode: "hover", content: { side: "right", align: "start", alignOffset: 2 } }));
const [DefineLinkTemplate, ReuseLinkTemplate] = createReusableTemplate();
const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate({
  props: {
    item: Object,
    index: Number,
    level: Number,
    listIndex: Number
  }
});
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.navigationMenu || {} })({
  orientation: props.orientation,
  contentOrientation: props.orientation === "vertical" ? void 0 : props.contentOrientation,
  collapsed: props.collapsed,
  color: props.color,
  variant: props.variant,
  highlight: props.highlight,
  highlightColor: props.highlightColor || props.color
}));
const lists = computed(
  () => props.items?.length ? isArrayOfArray(props.items) ? props.items : [props.items] : []
);
function getItemValue(item, index, level, listIndex) {
  const prefix = lists.value.length > 1 ? `group-${listIndex}-` : "";
  return get(item, props.valueKey) ?? (level > 0 ? `${prefix}item-${level}-${index}` : `${prefix}item-${index}`);
}
function getAccordionDefaultValue(list, level = 0, listIndex = 0) {
  const indexes = list.reduce((acc, item, index) => {
    if (item.defaultOpen || item.open) {
      acc.push(getItemValue(item, index, level, listIndex));
    }
    return acc;
  }, []);
  return props.type === "single" ? indexes[0] : indexes;
}
function onLinkTrailingClick(e, item) {
  if (!item.children?.length) {
    return;
  }
  if (props.orientation === "horizontal") {
    e.preventDefault();
  } else if (props.orientation === "vertical" && !props.collapsed) {
    e.preventDefault();
    e.stopPropagation();
  }
}
</script>

<template>
  <DefineLinkTemplate v-slot="{ item, active, index }">
    <slot :name="item.slot || 'item'" :item="item" :index="index" :active="active" :ui="ui">
      <slot :name="item.slot ? `${item.slot}-leading` : 'item-leading'" :item="item" :active="active" :index="index" :ui="ui">
        <UAvatar v-if="item.avatar" :size="item.ui?.linkLeadingAvatarSize || props.ui?.linkLeadingAvatarSize || ui.linkLeadingAvatarSize()" v-bind="item.avatar" data-slot="linkLeadingAvatar" :class="ui.linkLeadingAvatar({ class: [props.ui?.linkLeadingAvatar, item.ui?.linkLeadingAvatar], active, disabled: !!item.disabled })" />
        <UChip
          v-else-if="item.icon && item.chip"
          :size="item.ui?.linkLeadingChipSize || props.ui?.linkLeadingChipSize || ui.linkLeadingChipSize()"
          inset
          v-bind="typeof item.chip === 'object' ? item.chip : {}"
          data-slot="linkLeadingChip"
        >
          <UIcon :name="item.icon" data-slot="linkLeadingIcon" :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, item.ui?.linkLeadingIcon], active, disabled: !!item.disabled })" />
        </UChip>
        <UIcon v-else-if="item.icon" :name="item.icon" data-slot="linkLeadingIcon" :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, item.ui?.linkLeadingIcon], active, disabled: !!item.disabled })" />
      </slot>

      <span
        v-if="get(item, props.labelKey) || !!slots[item.slot ? `${item.slot}-label` : 'item-label']"
        data-slot="linkLabel"
        :class="ui.linkLabel({ class: [props.ui?.linkLabel, item.ui?.linkLabel] })"
      >
        <slot :name="item.slot ? `${item.slot}-label` : 'item-label'" :item="item" :active="active" :index="index">
          {{ get(item, props.labelKey) }}
        </slot>

        <UIcon v-if="item.target === '_blank' && props.externalIcon !== false" :name="typeof props.externalIcon === 'string' ? props.externalIcon : appConfig.ui.icons.external" data-slot="linkLabelExternalIcon" :class="ui.linkLabelExternalIcon({ class: [props.ui?.linkLabelExternalIcon, item.ui?.linkLabelExternalIcon], active })" />
      </span>

      <component
        :is="props.orientation === 'vertical' && item.children?.length && !props.collapsed ? AccordionTrigger : 'span'"
        v-if="item.badge || item.badge === 0 || props.orientation === 'horizontal' && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : 'item-content']) || props.orientation === 'vertical' && item.children?.length || item.trailingIcon || !!slots[item.slot ? `${item.slot}-trailing` : 'item-trailing']"
        :as="props.orientation === 'vertical' && item.children?.length && !props.collapsed ? 'span' : void 0"
        data-slot="linkTrailing"
        :class="ui.linkTrailing({ class: [props.ui?.linkTrailing, item.ui?.linkTrailing] })"
        @click="(e) => onLinkTrailingClick(e, item)"
      >
        <slot :name="item.slot ? `${item.slot}-trailing` : 'item-trailing'" :item="item" :active="active" :index="index" :ui="ui">
          <UBadge
            v-if="item.badge || item.badge === 0"
            color="neutral"
            variant="outline"
            :size="item.ui?.linkTrailingBadgeSize || props.ui?.linkTrailingBadgeSize || ui.linkTrailingBadgeSize()"
            v-bind="typeof item.badge === 'string' || typeof item.badge === 'number' ? { label: item.badge } : item.badge"
            data-slot="linkTrailingBadge"
            :class="ui.linkTrailingBadge({ class: [props.ui?.linkTrailingBadge, item.ui?.linkTrailingBadge] })"
          />

          <UIcon v-if="props.orientation === 'horizontal' && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : 'item-content']) || props.orientation === 'vertical' && item.children?.length" :name="item.trailingIcon || props.trailingIcon || appConfig.ui.icons.chevronDown" data-slot="linkTrailingIcon" :class="ui.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, item.ui?.linkTrailingIcon], active })" />
          <UIcon v-else-if="item.trailingIcon" :name="item.trailingIcon" data-slot="linkTrailingIcon" :class="ui.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, item.ui?.linkTrailingIcon], active })" />
        </slot>
      </component>
    </slot>
  </DefineLinkTemplate>

  <DefineItemTemplate v-slot="{ item, index, level = 0, listIndex = 0 }">
    <component
      :is="props.orientation === 'vertical' && !props.collapsed ? AccordionItem : NavigationMenuItem"
      as="li"
      v-bind="props.orientation === 'vertical' && !props.collapsed ? { disabled: !!item.disabled } : {}"
      :value="getItemValue(item, index, level, listIndex)"
    >
      <div v-if="props.orientation === 'vertical' && item.type === 'label' && !props.collapsed" data-slot="label" :class="ui.label({ class: [props.ui?.label, item.ui?.label, item.class] })">
        <ReuseLinkTemplate :item="item" :index="index" />
      </div>
      <ULink v-else-if="item.type !== 'label'" v-slot="{ active, ...slotProps }" v-bind="props.orientation === 'vertical' && item.children?.length && !props.collapsed && item.type === 'trigger' ? {} : pickLinkProps(item)" custom>
        <component
          :is="props.orientation === 'horizontal' && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : 'item-content']) ? NavigationMenuTrigger : props.orientation === 'vertical' && item.children?.length && !props.collapsed && !slotProps.href ? AccordionTrigger : NavigationMenuLink"
          as-child
          :active="active || item.active"
          :disabled="item.disabled"
          @select="item.onSelect"
        >
          <UPopover v-if="props.orientation === 'vertical' && props.collapsed && item.children?.length && (!!props.popover || !!item.popover)" v-bind="{ ...popoverProps, ...typeof item.popover === 'boolean' ? {} : item.popover || {} }" :ui="{ content: ui.content({ class: [props.ui?.content, item.ui?.content] }) }">
            <ULinkBase v-bind="slotProps" data-slot="link" :class="ui.link({ class: [props.ui?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: level > 0 })">
              <ReuseLinkTemplate :item="item" :active="active || item.active" :index="index" />
            </ULinkBase>

            <template #content="{ close }">
              <slot
                :name="item.slot ? `${item.slot}-content` : 'item-content'"
                :item="item"
                :active="active || item.active"
                :index="index"
                :ui="ui"
                :close="close"
              >
                <ul data-slot="childList" :class="ui.childList({ class: [props.ui?.childList, item.ui?.childList] })">
                  <li data-slot="childLabel" :class="ui.childLabel({ class: [props.ui?.childLabel, item.ui?.childLabel] })">
                    {{ get(item, props.labelKey) }}
                  </li>
                  <li v-for="(childItem, childIndex) in item.children" :key="childIndex" data-slot="childItem" :class="ui.childItem({ class: [props.ui?.childItem, item.ui?.childItem] })">
                    <ULink v-slot="{ active: childActive, ...childSlotProps }" v-bind="pickLinkProps(childItem)" custom>
                      <NavigationMenuLink as-child :active="childActive" @select="childItem.onSelect">
                        <ULinkBase v-bind="childSlotProps" data-slot="childLink" :class="ui.childLink({ class: [props.ui?.childLink, item.ui?.childLink, childItem.class], active: childActive })">
                          <UIcon v-if="childItem.icon" :name="childItem.icon" data-slot="childLinkIcon" :class="ui.childLinkIcon({ class: [props.ui?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })" />

                          <span data-slot="childLinkLabel" :class="ui.childLinkLabel({ class: [props.ui?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })">
                            {{ get(childItem, props.labelKey) }}

                            <UIcon v-if="childItem.target === '_blank' && props.externalIcon !== false" :name="typeof props.externalIcon === 'string' ? props.externalIcon : appConfig.ui.icons.external" data-slot="childLinkLabelExternalIcon" :class="ui.childLinkLabelExternalIcon({ class: [props.ui?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })" />
                          </span>
                        </ULinkBase>
                      </NavigationMenuLink>
                    </ULink>
                  </li>
                </ul>
              </slot>
            </template>
          </UPopover>
          <UTooltip v-else-if="props.orientation === 'vertical' && props.collapsed && (!!props.tooltip || !!item.tooltip) || props.orientation === 'horizontal' && !!item.tooltip" :text="get(item, props.labelKey)" v-bind="{ ...tooltipProps, ...typeof item.tooltip === 'boolean' ? {} : item.tooltip || {} }">
            <ULinkBase v-bind="slotProps" data-slot="link" :class="ui.link({ class: [props.ui?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: level > 0 })">
              <ReuseLinkTemplate :item="item" :active="active || item.active" :index="index" />
            </ULinkBase>
          </UTooltip>
          <ULinkBase v-else v-bind="slotProps" data-slot="link" :class="ui.link({ class: [props.ui?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: props.orientation === 'horizontal' || level > 0 })">
            <ReuseLinkTemplate :item="item" :active="active || item.active" :index="index" />
          </ULinkBase>
        </component>

        <NavigationMenuContent v-if="props.orientation === 'horizontal' && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : 'item-content'])" v-bind="contentProps" data-slot="content" :class="ui.content({ class: [props.ui?.content, item.ui?.content] })">
          <slot :name="item.slot ? `${item.slot}-content` : 'item-content'" :item="item" :active="active || item.active" :index="index" :ui="ui">
            <ul data-slot="childList" :class="ui.childList({ class: [props.ui?.childList, item.ui?.childList] })">
              <li v-for="(childItem, childIndex) in item.children" :key="childIndex" data-slot="childItem" :class="ui.childItem({ class: [props.ui?.childItem, item.ui?.childItem] })">
                <ULink v-slot="{ active: childActive, ...childSlotProps }" v-bind="pickLinkProps(childItem)" custom>
                  <NavigationMenuLink as-child :active="childActive" @select="childItem.onSelect">
                    <ULinkBase v-bind="childSlotProps" data-slot="childLink" :class="ui.childLink({ class: [props.ui?.childLink, item.ui?.childLink, childItem.class], active: childActive })">
                      <UIcon v-if="childItem.icon" :name="childItem.icon" data-slot="childLinkIcon" :class="ui.childLinkIcon({ class: [props.ui?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })" />

                      <div data-slot="childLinkWrapper" :class="ui.childLinkWrapper({ class: [props.ui?.childLinkWrapper, item.ui?.childLinkWrapper] })">
                        <p data-slot="childLinkLabel" :class="ui.childLinkLabel({ class: [props.ui?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })">
                          {{ get(childItem, props.labelKey) }}

                          <UIcon v-if="childItem.target === '_blank' && props.externalIcon !== false" :name="typeof props.externalIcon === 'string' ? props.externalIcon : appConfig.ui.icons.external" data-slot="childLinkLabelExternalIcon" :class="ui.childLinkLabelExternalIcon({ class: [props.ui?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })" />
                        </p>
                        <p v-if="childItem.description" data-slot="childLinkDescription" :class="ui.childLinkDescription({ class: [props.ui?.childLinkDescription, item.ui?.childLinkDescription], active: childActive })">
                          {{ childItem.description }}
                        </p>
                      </div>
                    </ULinkBase>
                  </NavigationMenuLink>
                </ULink>
              </li>
            </ul>
          </slot>
        </NavigationMenuContent>
      </ULink>

      <AccordionContent v-if="props.orientation === 'vertical' && item.children?.length && !props.collapsed" data-slot="content" :class="ui.content({ class: [props.ui?.content, item.ui?.content] })">
        <AccordionRoot
          v-bind="{
  ...accordionProps,
  defaultValue: getAccordionDefaultValue(item.children, level + 1, listIndex)
}"
          as="ul"
          data-slot="childList"
          :class="ui.childList({ class: [props.ui?.childList, item.ui?.childList] })"
        >
          <ReuseItemTemplate
            v-for="(childItem, childIndex) in item.children"
            :key="childIndex"
            :item="childItem"
            :index="childIndex"
            :level="level + 1"
            :list-index="listIndex"
            data-slot="childItem"
            :class="ui.childItem({ class: [props.ui?.childItem, childItem.ui?.childItem] })"
          />
        </AccordionRoot>
      </AccordionContent>
    </component>
  </DefineItemTemplate>

  <NavigationMenuRoot
    v-bind="{
  ...rootProps,
  ...props.orientation === 'horizontal' ? {
    modelValue: props.modelValue,
    defaultValue: props.defaultValue
  } : {},
  ...$attrs
}"
    :data-collapsed="props.collapsed"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <slot name="list-leading" />

    <template v-for="(list, listIndex) in lists" :key="`list-${listIndex}`">
      <component
        v-bind="props.orientation === 'vertical' && !props.collapsed ? {
  ...accordionProps,
  modelValue: props.modelValue,
  defaultValue: props.defaultValue ?? getAccordionDefaultValue(list, 0, listIndex)
} : {}"
        :is="props.orientation === 'vertical' ? AccordionRoot : NavigationMenuList"
        as="ul"
        data-slot="list"
        :class="ui.list({ class: props.ui?.list })"
      >
        <ReuseItemTemplate
          v-for="(item, index) in list"
          :key="`list-${listIndex}-${index}`"
          :item="item"
          :index="index"
          :list-index="listIndex"
          data-slot="item"
          :class="ui.item({ class: [props.ui?.item, item.ui?.item] })"
        />
      </component>

      <div v-if="props.orientation === 'vertical' && listIndex < lists.length - 1" data-slot="separator" :class="ui.separator({ class: props.ui?.separator })" />
    </template>

    <slot name="list-trailing" />

    <div v-if="props.orientation === 'horizontal'" data-slot="viewportWrapper" :class="ui.viewportWrapper({ class: props.ui?.viewportWrapper })">
      <NavigationMenuIndicator v-if="props.arrow" data-slot="indicator" :class="ui.indicator({ class: props.ui?.indicator })">
        <div data-slot="arrow" :class="ui.arrow({ class: props.ui?.arrow })" />
      </NavigationMenuIndicator>

      <NavigationMenuViewport data-slot="viewport" :class="ui.viewport({ class: props.ui?.viewport })" />
    </div>
  </NavigationMenuRoot>
</template>
