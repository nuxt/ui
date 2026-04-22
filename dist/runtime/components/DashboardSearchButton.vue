<script>
import theme from "#build/ui/dashboard-search-button";
</script>

<script setup>
import { computed, toRef } from "vue";
import { useForwardProps } from "reka-ui";
import { defu } from "defu";
import { reactiveOmit, createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useLocale } from "../composables/useLocale";
import { useDashboard } from "../utils/dashboard";
import { omit, transformUI } from "../utils";
import { tv } from "../utils/tv";
import UButton from "./Button.vue";
import UKbd from "./Kbd.vue";
import UTooltip from "./Tooltip.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  icon: { type: null, required: false },
  label: { type: String, required: false },
  color: { type: null, required: false, default: "neutral" },
  variant: { type: null, required: false },
  collapsed: { type: Boolean, required: false, default: false },
  tooltip: { type: [Boolean, Object], required: false, default: false },
  kbds: { type: Array, required: false, default: () => ["meta", "k"] },
  ui: { type: Object, required: false },
  class: { type: null, required: false },
  activeColor: { type: null, required: false },
  activeVariant: { type: null, required: false },
  size: { type: null, required: false },
  square: { type: Boolean, required: false },
  block: { type: Boolean, required: false },
  loadingAuto: { type: Boolean, required: false },
  onClick: { type: [Function, Array], required: false },
  avatar: { type: Object, required: false },
  leading: { type: Boolean, required: false },
  leadingIcon: { type: null, required: false },
  trailing: { type: Boolean, required: false },
  trailingIcon: { type: null, required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: null, required: false },
  as: { type: null, required: false },
  type: { type: null, required: false },
  disabled: { type: Boolean, required: false },
  exactActiveClass: { type: String, required: false },
  viewTransition: { type: Boolean, required: false }
});
const slots = defineSlots();
const [DefineButtonTemplate, ReuseButtonTemplate] = createReusableTemplate();
const getProxySlots = () => omit(slots, ["trailing"]);
const buttonProps = useForwardProps(reactiveOmit(props, "icon", "label", "variant", "collapsed", "tooltip", "kbds", "class", "ui"));
const tooltipProps = toRef(() => defu(typeof props.tooltip === "boolean" ? {} : props.tooltip, { delayDuration: 0, content: { side: "right" } }));
const { t } = useLocale();
const appConfig = useAppConfig();
const uiProp = useComponentUI("dashboardSearchButton", props);
const { toggleSearch } = useDashboard({ toggleSearch: () => {
} });
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.dashboardSearchButton || {} })({
  collapsed: props.collapsed
}));
</script>

<template>
  <DefineButtonTemplate>
    <UButton
      :icon="icon || appConfig.ui.icons.search"
      :label="label || t('dashboardSearchButton.label')"
      :variant="variant || (collapsed ? 'ghost' : 'outline')"
      v-bind="{
  ...buttonProps,
  ...collapsed ? {
    'square': true,
    'aria-label': label || t('dashboardSearchButton.label')
  } : {},
  ...$attrs
}"
      :class="ui.base({ class: [uiProp?.base, props.class] })"
      :ui="transformUI(ui, uiProp)"
      @click="toggleSearch"
    >
      <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>

      <template #trailing="{ ui: uiProxy }">
        <span data-slot="trailing" :class="ui.trailing({ class: uiProp?.trailing })">
          <slot name="trailing" :ui="uiProxy">
            <template v-if="kbds?.length">
              <UKbd v-for="(kbd, index) in kbds" :key="index" variant="subtle" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
            </template>
          </slot>
        </span>
      </template>
    </UButton>
  </DefineButtonTemplate>

  <UTooltip v-if="collapsed && tooltip" :text="label || t('dashboardSearchButton.label')" v-bind="tooltipProps">
    <ReuseButtonTemplate />
  </UTooltip>
  <ReuseButtonTemplate v-else />
</template>
