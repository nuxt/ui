<script>
import theme from "#build/ui/navigation-menu";
</script>

<script setup>
import { computed, toRef } from "vue";
import { NavigationMenuRoot, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport, AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent, useForwardPropsEmits } from "reka-ui";
import { defu } from "defu";
import { reactivePick, createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
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
const props = defineProps({
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
const appConfig = useAppConfig();
const uiProp = useComponentUI("navigationMenu", props);
const rootProps = useForwardPropsEmits(computed(() => ({
  as: props.as,
  delayDuration: props.delayDuration,
  skipDelayDuration: props.skipDelayDuration,
  orientation: props.orientation,
  disableClickTrigger: props.disableClickTrigger,
  disableHoverTrigger: props.disableHoverTrigger,
  disablePointerLeaveClose: props.disablePointerLeaveClose,
  unmountOnHide: props.unmountOnHide
})), emits);
const accordionProps = useForwardPropsEmits(reactivePick(props, "collapsible", "disabled", "type", "unmountOnHide"), emits);
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
        <UAvatar v-if="item.avatar" :size="item.ui?.linkLeadingAvatarSize || uiProp?.linkLeadingAvatarSize || ui.linkLeadingAvatarSize()" v-bind="item.avatar" data-slot="linkLeadingAvatar" :class="ui.linkLeadingAvatar({ class: [uiProp?.linkLeadingAvatar, item.ui?.linkLeadingAvatar], active, disabled: !!item.disabled })" />
        <UChip
          v-else-if="item.icon && item.chip"
          :size="item.ui?.linkLeadingChipSize || uiProp?.linkLeadingChipSize || ui.linkLeadingChipSize()"
          inset
          v-bind="typeof item.chip === 'object' ? item.chip : {}"
          data-slot="linkLeadingChip"
        >
          <UIcon :name="item.icon" data-slot="linkLeadingIcon" :class="ui.linkLeadingIcon({ class: [uiProp?.linkLeadingIcon, item.ui?.linkLeadingIcon], active, disabled: !!item.disabled })" />
        </UChip>
        <UIcon v-else-if="item.icon" :name="item.icon" data-slot="linkLeadingIcon" :class="ui.linkLeadingIcon({ class: [uiProp?.linkLeadingIcon, item.ui?.linkLeadingIcon], active, disabled: !!item.disabled })" />
      </slot>

      <span
        v-if="get(item, props.labelKey) || !!slots[item.slot ? `${item.slot}-label` : 'item-label']"
        data-slot="linkLabel"
        :class="ui.linkLabel({ class: [uiProp?.linkLabel, item.ui?.linkLabel] })"
      >
        <slot :name="item.slot ? `${item.slot}-label` : 'item-label'" :item="item" :active="active" :index="index">
          {{ get(item, props.labelKey) }}
        </slot>

        <UIcon v-if="item.target === '_blank' && externalIcon !== false" :name="typeof externalIcon === 'string' ? externalIcon : appConfig.ui.icons.external" data-slot="linkLabelExternalIcon" :class="ui.linkLabelExternalIcon({ class: [uiProp?.linkLabelExternalIcon, item.ui?.linkLabelExternalIcon], active })" />
      </span>

      <component
        :is="orientation === 'vertical' && item.children?.length && !collapsed ? AccordionTrigger : 'span'"
        v-if="item.badge || item.badge === 0 || orientation === 'horizontal' && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : 'item-content']) || orientation === 'vertical' && item.children?.length || item.trailingIcon || !!slots[item.slot ? `${item.slot}-trailing` : 'item-trailing']"
        :as="orientation === 'vertical' && item.children?.length && !collapsed ? 'span' : void 0"
        data-slot="linkTrailing"
        :class="ui.linkTrailing({ class: [uiProp?.linkTrailing, item.ui?.linkTrailing] })"
        @click="(e) => onLinkTrailingClick(e, item)"
      >
        <slot :name="item.slot ? `${item.slot}-trailing` : 'item-trailing'" :item="item" :active="active" :index="index" :ui="ui">
          <UBadge
            v-if="item.badge || item.badge === 0"
            color="neutral"
            variant="outline"
            :size="item.ui?.linkTrailingBadgeSize || uiProp?.linkTrailingBadgeSize || ui.linkTrailingBadgeSize()"
            v-bind="typeof item.badge === 'string' || typeof item.badge === 'number' ? { label: item.badge } : item.badge"
            data-slot="linkTrailingBadge"
            :class="ui.linkTrailingBadge({ class: [uiProp?.linkTrailingBadge, item.ui?.linkTrailingBadge] })"
          />

          <UIcon v-if="orientation === 'horizontal' && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : 'item-content']) || orientation === 'vertical' && item.children?.length" :name="item.trailingIcon || trailingIcon || appConfig.ui.icons.chevronDown" data-slot="linkTrailingIcon" :class="ui.linkTrailingIcon({ class: [uiProp?.linkTrailingIcon, item.ui?.linkTrailingIcon], active })" />
          <UIcon v-else-if="item.trailingIcon" :name="item.trailingIcon" data-slot="linkTrailingIcon" :class="ui.linkTrailingIcon({ class: [uiProp?.linkTrailingIcon, item.ui?.linkTrailingIcon], active })" />
        </slot>
      </component>
    </slot>
  </DefineLinkTemplate>

  <DefineItemTemplate v-slot="{ item, index, level = 0, listIndex = 0 }">
    <component
      :is="orientation === 'vertical' && !collapsed ? AccordionItem : NavigationMenuItem"
      as="li"
      v-bind="orientation === 'vertical' && !collapsed ? { disabled: !!item.disabled } : {}"
      :value="getItemValue(item, index, level, listIndex)"
    >
      <div v-if="orientation === 'vertical' && item.type === 'label' && !collapsed" data-slot="label" :class="ui.label({ class: [uiProp?.label, item.ui?.label, item.class] })">
        <ReuseLinkTemplate :item="item" :index="index" />
      </div>
      <ULink v-else-if="item.type !== 'label'" v-slot="{ active, ...slotProps }" v-bind="orientation === 'vertical' && item.children?.length && !collapsed && item.type === 'trigger' ? {} : pickLinkProps(item)" custom>
        <component
          :is="orientation === 'horizontal' && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : 'item-content']) ? NavigationMenuTrigger : orientation === 'vertical' && item.children?.length && !collapsed && !slotProps.href ? AccordionTrigger : NavigationMenuLink"
          as-child
          :active="active || item.active"
          :disabled="item.disabled"
          @select="item.onSelect"
        >
          <UPopover v-if="orientation === 'vertical' && collapsed && item.children?.length && (!!props.popover || !!item.popover)" v-bind="{ ...popoverProps, ...typeof item.popover === 'boolean' ? {} : item.popover || {} }" :ui="{ content: ui.content({ class: [uiProp?.content, item.ui?.content] }) }">
            <ULinkBase v-bind="slotProps" data-slot="link" :class="ui.link({ class: [uiProp?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: level > 0 })">
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
                <ul data-slot="childList" :class="ui.childList({ class: [uiProp?.childList, item.ui?.childList] })">
                  <li data-slot="childLabel" :class="ui.childLabel({ class: [uiProp?.childLabel, item.ui?.childLabel] })">
                    {{ get(item, props.labelKey) }}
                  </li>
                  <li v-for="(childItem, childIndex) in item.children" :key="childIndex" data-slot="childItem" :class="ui.childItem({ class: [uiProp?.childItem, item.ui?.childItem] })">
                    <ULink v-slot="{ active: childActive, ...childSlotProps }" v-bind="pickLinkProps(childItem)" custom>
                      <NavigationMenuLink as-child :active="childActive" @select="childItem.onSelect">
                        <ULinkBase v-bind="childSlotProps" data-slot="childLink" :class="ui.childLink({ class: [uiProp?.childLink, item.ui?.childLink, childItem.class], active: childActive })">
                          <UIcon v-if="childItem.icon" :name="childItem.icon" data-slot="childLinkIcon" :class="ui.childLinkIcon({ class: [uiProp?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })" />

                          <span data-slot="childLinkLabel" :class="ui.childLinkLabel({ class: [uiProp?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })">
                            {{ get(childItem, props.labelKey) }}

                            <UIcon v-if="childItem.target === '_blank' && externalIcon !== false" :name="typeof externalIcon === 'string' ? externalIcon : appConfig.ui.icons.external" data-slot="childLinkLabelExternalIcon" :class="ui.childLinkLabelExternalIcon({ class: [uiProp?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })" />
                          </span>
                        </ULinkBase>
                      </NavigationMenuLink>
                    </ULink>
                  </li>
                </ul>
              </slot>
            </template>
          </UPopover>
          <UTooltip v-else-if="orientation === 'vertical' && collapsed && (!!props.tooltip || !!item.tooltip) || orientation === 'horizontal' && !!item.tooltip" :text="get(item, props.labelKey)" v-bind="{ ...tooltipProps, ...typeof item.tooltip === 'boolean' ? {} : item.tooltip || {} }">
            <ULinkBase v-bind="slotProps" data-slot="link" :class="ui.link({ class: [uiProp?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: level > 0 })">
              <ReuseLinkTemplate :item="item" :active="active || item.active" :index="index" />
            </ULinkBase>
          </UTooltip>
          <ULinkBase v-else v-bind="slotProps" data-slot="link" :class="ui.link({ class: [uiProp?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: orientation === 'horizontal' || level > 0 })">
            <ReuseLinkTemplate :item="item" :active="active || item.active" :index="index" />
          </ULinkBase>
        </component>

        <NavigationMenuContent v-if="orientation === 'horizontal' && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : 'item-content'])" v-bind="contentProps" data-slot="content" :class="ui.content({ class: [uiProp?.content, item.ui?.content] })">
          <slot :name="item.slot ? `${item.slot}-content` : 'item-content'" :item="item" :active="active || item.active" :index="index" :ui="ui">
            <ul data-slot="childList" :class="ui.childList({ class: [uiProp?.childList, item.ui?.childList] })">
              <li v-for="(childItem, childIndex) in item.children" :key="childIndex" data-slot="childItem" :class="ui.childItem({ class: [uiProp?.childItem, item.ui?.childItem] })">
                <ULink v-slot="{ active: childActive, ...childSlotProps }" v-bind="pickLinkProps(childItem)" custom>
                  <NavigationMenuLink as-child :active="childActive" @select="childItem.onSelect">
                    <ULinkBase v-bind="childSlotProps" data-slot="childLink" :class="ui.childLink({ class: [uiProp?.childLink, item.ui?.childLink, childItem.class], active: childActive })">
                      <UIcon v-if="childItem.icon" :name="childItem.icon" data-slot="childLinkIcon" :class="ui.childLinkIcon({ class: [uiProp?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })" />

                      <div data-slot="childLinkWrapper" :class="ui.childLinkWrapper({ class: [uiProp?.childLinkWrapper, item.ui?.childLinkWrapper] })">
                        <p data-slot="childLinkLabel" :class="ui.childLinkLabel({ class: [uiProp?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })">
                          {{ get(childItem, props.labelKey) }}

                          <UIcon v-if="childItem.target === '_blank' && externalIcon !== false" :name="typeof externalIcon === 'string' ? externalIcon : appConfig.ui.icons.external" data-slot="childLinkLabelExternalIcon" :class="ui.childLinkLabelExternalIcon({ class: [uiProp?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })" />
                        </p>
                        <p v-if="childItem.description" data-slot="childLinkDescription" :class="ui.childLinkDescription({ class: [uiProp?.childLinkDescription, item.ui?.childLinkDescription], active: childActive })">
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

      <AccordionContent v-if="orientation === 'vertical' && item.children?.length && !collapsed" data-slot="content" :class="ui.content({ class: [uiProp?.content, item.ui?.content] })">
        <AccordionRoot
          v-bind="{
  ...accordionProps,
  defaultValue: getAccordionDefaultValue(item.children, level + 1, listIndex)
}"
          as="ul"
          data-slot="childList"
          :class="ui.childList({ class: [uiProp?.childList, item.ui?.childList] })"
        >
          <ReuseItemTemplate
            v-for="(childItem, childIndex) in item.children"
            :key="childIndex"
            :item="childItem"
            :index="childIndex"
            :level="level + 1"
            :list-index="listIndex"
            data-slot="childItem"
            :class="ui.childItem({ class: [uiProp?.childItem, childItem.ui?.childItem] })"
          />
        </AccordionRoot>
      </AccordionContent>
    </component>
  </DefineItemTemplate>

  <NavigationMenuRoot
    v-bind="{
  ...rootProps,
  ...orientation === 'horizontal' ? {
    modelValue,
    defaultValue
  } : {},
  ...$attrs
}"
    :data-collapsed="collapsed"
    data-slot="root"
    :class="ui.root({ class: [uiProp?.root, props.class] })"
  >
    <slot name="list-leading" />

    <template v-for="(list, listIndex) in lists" :key="`list-${listIndex}`">
      <component
        v-bind="orientation === 'vertical' && !collapsed ? {
  ...accordionProps,
  modelValue,
  defaultValue: defaultValue ?? getAccordionDefaultValue(list, 0, listIndex)
} : {}"
        :is="orientation === 'vertical' ? AccordionRoot : NavigationMenuList"
        as="ul"
        data-slot="list"
        :class="ui.list({ class: uiProp?.list })"
      >
        <ReuseItemTemplate
          v-for="(item, index) in list"
          :key="`list-${listIndex}-${index}`"
          :item="item"
          :index="index"
          :list-index="listIndex"
          data-slot="item"
          :class="ui.item({ class: [uiProp?.item, item.ui?.item] })"
        />
      </component>

      <div v-if="orientation === 'vertical' && listIndex < lists.length - 1" data-slot="separator" :class="ui.separator({ class: uiProp?.separator })" />
    </template>

    <slot name="list-trailing" />

    <div v-if="orientation === 'horizontal'" data-slot="viewportWrapper" :class="ui.viewportWrapper({ class: uiProp?.viewportWrapper })">
      <NavigationMenuIndicator v-if="arrow" data-slot="indicator" :class="ui.indicator({ class: uiProp?.indicator })">
        <div data-slot="arrow" :class="ui.arrow({ class: uiProp?.arrow })" />
      </NavigationMenuIndicator>

      <NavigationMenuViewport data-slot="viewport" :class="ui.viewport({ class: uiProp?.viewport })" />
    </div>
  </NavigationMenuRoot>
</template>
