<script>
import theme from "#build/ui/content/content-navigation";
</script>

<script setup>
import { computed } from "vue";
import { Primitive, AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent, useForwardPropsEmits } from "reka-ui";
import { reactivePick, createReusableTemplate } from "@vueuse/core";
import { useRoute, useAppConfig } from "#imports";
import { useComponentUI } from "../../composables/useComponentUI";
import { pickLinkProps } from "../../utils/link";
import { tv } from "../../utils/tv";
import { mapContentNavigationItem } from "../../utils/content";
import UContentNavigation from "./ContentNavigation.vue";
import ULink from "../Link.vue";
import ULinkBase from "../LinkBase.vue";
import UBadge from "../Badge.vue";
import UIcon from "../Icon.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false, default: "nav" },
  defaultOpen: { type: Boolean, required: false, default: void 0 },
  trailingIcon: { type: null, required: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  highlight: { type: Boolean, required: false, default: false },
  highlightColor: { type: null, required: false },
  collapsible: { type: Boolean, required: false, default: true },
  level: { type: Number, required: false, default: 0 },
  navigation: { type: Array, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  disabled: { type: Boolean, required: false },
  type: { type: String, required: false, default: "multiple" },
  unmountOnHide: { type: Boolean, required: false, default: true }
});
const emits = defineEmits(["update:modelValue"]);
const slots = defineSlots();
const rootProps = useForwardPropsEmits(reactivePick(props, "collapsible", "type", "unmountOnHide"), emits);
const route = useRoute();
const appConfig = useAppConfig();
const uiProp = useComponentUI("contentNavigation", props);
const [DefineLinkTemplate, ReuseLinkTemplate] = createReusableTemplate();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.contentNavigation || {} })({
  color: props.color,
  variant: props.variant,
  highlight: props.highlight,
  highlightColor: props.highlightColor || props.color
}));
const disabled = computed(() => props.disabled || props.type === "multiple" && props.collapsible === false);
function isRouteInTree(link, routePath) {
  if (link.children?.length) {
    return link.children.some((child) => isRouteInTree(child, routePath));
  }
  return routePath === link.path;
}
const defaultValue = computed(() => {
  if (props.defaultOpen === false) {
    return void 0;
  }
  if (props.defaultOpen === void 0) {
    return props.type === "single" ? "0" : props.navigation?.map((link, index) => link.defaultOpen !== false && String(index)).filter(Boolean);
  }
  const indices = props.navigation?.reduce((acc, link, index) => {
    if (isRouteInTree(link, route.path)) {
      acc.push(String(index));
    }
    return acc;
  }, []) || [];
  return props.type === "multiple" ? indices : indices[0];
});
</script>

<template>
  <DefineLinkTemplate v-slot="{ link, active }">
    <slot name="link" :link="link" :active="active" :ui="ui">
      <slot name="link-leading" :link="link" :active="active" :ui="ui">
        <UIcon v-if="link.icon" :name="link.icon" data-slot="linkLeadingIcon" :class="ui.linkLeadingIcon({ class: [uiProp?.linkLeadingIcon, link.ui?.linkLeadingIcon], active })" />
      </slot>

      <span v-if="link.title || !!slots['link-title']" data-slot="linkTitle" :class="ui.linkTitle({ class: [uiProp?.linkTitle, link.ui?.linkTitle], active })">
        <slot name="link-title" :link="link" :active="active" :ui="ui">
          {{ link.title }}
        </slot>

        <UIcon v-if="link.target === '_blank'" :name="appConfig.ui.icons.external" data-slot="linkTitleExternalIcon" :class="ui.linkTitleExternalIcon({ class: [uiProp?.linkTitleExternalIcon, link.ui?.linkTitleExternalIcon], active })" />
      </span>

      <span v-if="link.badge || link.badge === 0 || link.children?.length && !disabled || link.trailingIcon || !!slots['link-trailing']" data-slot="linkTrailing" :class="ui.linkTrailing({ class: [uiProp?.linkTrailing, link.ui?.linkTrailing] })">
        <slot name="link-trailing" :link="link" :active="active" :ui="ui">
          <UBadge
            v-if="link.badge || link.badge === 0"
            color="neutral"
            variant="outline"
            :size="uiProp?.linkTrailingBadgeSize || ui.linkTrailingBadgeSize()"
            v-bind="typeof link.badge === 'string' || typeof link.badge === 'number' ? { label: link.badge } : link.badge"
            data-slot="linkTrailingBadge"
            :class="ui.linkTrailingBadge({ class: uiProp?.linkTrailingBadge })"
          />
          <UIcon v-if="link.children?.length && !disabled" :name="link.trailingIcon || trailingIcon || appConfig.ui.icons.chevronDown" data-slot="linkTrailingIcon" :class="ui.linkTrailingIcon({ class: [uiProp?.linkTrailingIcon, link.ui?.linkTrailingIcon] })" />
          <UIcon v-else-if="link.trailingIcon" :name="link.trailingIcon" data-slot="linkTrailingIcon" :class="ui.linkTrailingIcon({ class: [uiProp?.linkTrailingIcon, link.ui?.linkTrailingIcon] })" />
        </slot>
      </span>
    </slot>
  </DefineLinkTemplate>

  <Primitive :as="as" v-bind="$attrs" :as-child="level > 0" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <AccordionRoot as="ul" :disabled="disabled" v-bind="rootProps" :default-value="defaultValue" :class="level > 0 ? ui.listWithChildren({ class: uiProp?.listWithChildren }) : ui.list({ class: uiProp?.list })">
      <template v-for="(link, index) in navigation" :key="index">
        <AccordionItem
          v-if="link.children?.length"
          as="li"
          :disabled="!!link.disabled"
          data-slot="itemWithChildren"
          :class="ui.itemWithChildren({ class: [uiProp?.itemWithChildren, link.ui?.itemWithChildren], level: level > 0 })"
          :value="String(index)"
        >
          <AccordionTrigger
            as="button"
            :class="[
  ui.link({ class: [uiProp?.link, link.ui?.link, link.class], active: link.active, disabled: !!link.disabled || disabled }),
  ui.trigger({ class: [uiProp?.trigger, link.ui?.trigger], disabled: !!link.disabled || disabled })
]"
          >
            <ReuseLinkTemplate :link="link" :active="link.active || false" />
          </AccordionTrigger>

          <AccordionContent data-slot="content" :class="ui.content({ class: [uiProp?.content, link.ui?.content] })">
            <UContentNavigation
              v-bind="rootProps"
              :navigation="link.children"
              :default-open="defaultOpen"
              :level="level + 1"
              :trailing-icon="trailingIcon"
              :color="color"
              :variant="variant"
              :highlight="highlight"
              :highlight-color="highlightColor"
              :ui="uiProp"
            >
              <template v-for="(_, name) in slots" #[name]="slotData">
                <slot :name="name" v-bind="{ ...slotData, link: slotData.link }" />
              </template>
            </UContentNavigation>
          </AccordionContent>
        </AccordionItem>

        <li v-else data-slot="item" :class="ui.item({ class: [uiProp?.item, link.ui?.item], level: level > 0 })">
          <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(mapContentNavigationItem(link))" custom>
            <ULinkBase v-bind="slotProps" data-slot="link" :class="ui.link({ class: [uiProp?.link, link.ui?.link, link.class], active, disabled: !!link.disabled, level: level > 0 })">
              <ReuseLinkTemplate :link="link" :active="active" />
            </ULinkBase>
          </ULink>
        </li>
      </template>
    </AccordionRoot>
  </Primitive>
</template>
