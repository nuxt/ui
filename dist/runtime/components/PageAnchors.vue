<script>
import theme from "#build/ui/page-anchors";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { pickLinkProps } from "../utils/link";
import { tv } from "../utils/tv";
import ULink from "./Link.vue";
import ULinkBase from "./LinkBase.vue";
import UIcon from "./Icon.vue";
const props = defineProps({
  as: { type: null, required: false, default: "nav" },
  links: { type: Array, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("pageAnchors", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pageAnchors || {} })());
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <ul data-slot="list" :class="ui.list({ class: uiProp?.list })">
      <li v-for="(link, index) in links" :key="index" data-slot="item" :class="ui.item({ class: [uiProp?.item, link.ui?.item] })">
        <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(link)" custom>
          <ULinkBase v-bind="slotProps" data-slot="link" :class="ui.link({ class: [uiProp?.link, link.ui?.link, link.class], active })">
            <slot name="link" :link="link" :active="active" :ui="ui">
              <div v-if="link.icon || !!slots['link-leading']" data-slot="linkLeading" :class="ui.linkLeading({ class: [uiProp?.linkLeading, link.ui?.linkLeading], active })">
                <slot name="link-leading" :link="link" :active="active" :ui="ui">
                  <UIcon v-if="link.icon" :name="link.icon" data-slot="linkLeadingIcon" :class="ui.linkLeadingIcon({ class: [uiProp?.linkLeadingIcon, link.ui?.linkLeadingIcon], active })" />
                </slot>
              </div>

              <span v-if="link.label || !!slots['link-label']" data-slot="linkLabel" :class="ui.linkLabel({ class: [uiProp?.linkLabel, link.ui?.linkLabel], active })">
                <slot name="link-label" :link="link" :active="active">
                  {{ link.label }}
                </slot>

                <UIcon v-if="link.target === '_blank'" :name="appConfig.ui.icons.external" data-slot="linkLabelExternalIcon" :class="ui.linkLabelExternalIcon({ class: [uiProp?.linkLabelExternalIcon, link.ui?.linkLabelExternalIcon], active })" />
              </span>

              <slot name="link-trailing" :link="link" :active="active" />
            </slot>
          </ULinkBase>
        </ULink>
      </li>
    </ul>
  </Primitive>
</template>
