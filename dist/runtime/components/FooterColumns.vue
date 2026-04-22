<script>
import theme from "#build/ui/footer-columns";
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
  class: { type: null, required: false },
  columns: { type: Array, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("footerColumns", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.footerColumns || {} })());
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div v-if="!!slots.left" data-slot="left" :class="ui.left({ class: uiProp?.left })">
      <slot name="left" />
    </div>

    <div v-if="!!slots.default || columns?.length" data-slot="center" :class="ui.center({ class: uiProp?.center })">
      <slot>
        <div v-for="(column, index) in columns" :key="index">
          <h3 data-slot="label" :class="ui.label({ class: uiProp?.label })">
            <slot name="column-label" :column="column">
              {{ column.label }}
            </slot>
          </h3>

          <ul data-slot="list" :class="ui.list({ class: uiProp?.list })">
            <li v-for="(link, linkIndex) in column.children" :key="linkIndex" data-slot="item" :class="ui.item({ class: [uiProp?.item, link.ui?.item] })">
              <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(link)" custom>
                <ULinkBase v-bind="slotProps" data-slot="link" :class="ui.link({ class: [uiProp?.link, link.ui?.link, link.class], active })">
                  <slot name="link" :link="link" :active="active" :ui="ui">
                    <slot name="link-leading" :link="link" :active="active" :ui="ui">
                      <UIcon v-if="link.icon" :name="link.icon" data-slot="linkLeadingIcon" :class="ui.linkLeadingIcon({ class: [uiProp?.linkLeadingIcon, link.ui?.linkLeadingIcon], active })" />
                    </slot>

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
        </div>
      </slot>
    </div>

    <div v-if="!!slots.right" data-slot="right" :class="ui.right({ class: uiProp?.right })">
      <slot name="right" />
    </div>
  </Primitive>
</template>
