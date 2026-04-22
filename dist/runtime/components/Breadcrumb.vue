<script>
import theme from "#build/ui/breadcrumb";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useLocale } from "../composables/useLocale";
import { get } from "../utils";
import { tv } from "../utils/tv";
import { pickLinkProps } from "../utils/link";
import UIcon from "./Icon.vue";
import UAvatar from "./Avatar.vue";
import ULinkBase from "./LinkBase.vue";
import ULink from "./Link.vue";
const props = defineProps({
  as: { type: null, required: false, default: "nav" },
  items: { type: Array, required: false },
  separatorIcon: { type: null, required: false },
  labelKey: { type: null, required: false, default: "label" },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const { dir } = useLocale();
const appConfig = useAppConfig();
const uiProp = useComponentUI("breadcrumb", props);
const separatorIcon = computed(() => props.separatorIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight));
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.breadcrumb || {} })());
</script>

<template>
  <Primitive :as="as" aria-label="breadcrumb" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <ol data-slot="list" :class="ui.list({ class: uiProp?.list })">
      <template v-for="(item, index) in items" :key="index">
        <li data-slot="item" :class="ui.item({ class: [uiProp?.item, item.ui?.item] })">
          <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(item)" custom>
            <ULinkBase v-bind="slotProps" as="span" :aria-current="(item.active ?? active) && index === items.length - 1 ? 'page' : void 0" data-slot="link" :class="ui.link({ class: [uiProp?.link, item.ui?.link, item.class], active: item.active ?? index === items.length - 1, disabled: !!item.disabled, to: !!item.to })">
              <slot :name="item.slot || 'item'" :item="item" :active="item.active ?? index === items.length - 1" :index="index" :ui="ui">
                <slot :name="item.slot ? `${item.slot}-leading` : 'item-leading'" :item="item" :active="item.active ?? index === items.length - 1" :index="index" :ui="ui">
                  <UIcon v-if="item.icon" :name="item.icon" data-slot="linkLeadingIcon" :class="ui.linkLeadingIcon({ class: [uiProp?.linkLeadingIcon, item.ui?.linkLeadingIcon], active: item.active ?? index === items.length - 1 })" />
                  <UAvatar v-else-if="item.avatar" :size="uiProp?.linkLeadingAvatarSize || ui.linkLeadingAvatarSize()" v-bind="item.avatar" data-slot="linkLeadingAvatar" :class="ui.linkLeadingAvatar({ class: [uiProp?.linkLeadingAvatar, item.ui?.linkLeadingAvatar], active: item.active ?? index === items.length - 1 })" />
                </slot>

                <span v-if="get(item, props.labelKey) || !!slots[item.slot ? `${item.slot}-label` : 'item-label']" data-slot="linkLabel" :class="ui.linkLabel({ class: [uiProp?.linkLabel, item.ui?.linkLabel] })">
                  <slot :name="item.slot ? `${item.slot}-label` : 'item-label'" :item="item" :active="item.active ?? index === items.length - 1" :index="index">
                    {{ get(item, props.labelKey) }}
                  </slot>
                </span>

                <slot :name="item.slot ? `${item.slot}-trailing` : 'item-trailing'" :item="item" :active="item.active ?? index === items.length - 1" :index="index" />
              </slot>
            </ULinkBase>
          </ULink>
        </li>

        <li v-if="index < items.length - 1" role="presentation" aria-hidden="true" data-slot="separator" :class="ui.separator({ class: [uiProp?.separator, item.ui?.separator] })">
          <slot name="separator" :ui="ui">
            <UIcon :name="separatorIcon" data-slot="separatorIcon" :class="ui.separatorIcon({ class: [uiProp?.separatorIcon, item.ui?.separatorIcon] })" />
          </slot>
        </li>
      </template>
    </ol>
  </Primitive>
</template>
