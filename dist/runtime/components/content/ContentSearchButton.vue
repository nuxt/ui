<script>
import theme from "#build/ui/content/content-search-button";
</script>

<script setup>
import { computed, toRef } from "vue";
import { defu } from "defu";
import { reactiveOmit, createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../../composables/useComponentProps";
import { useForwardProps } from "../../composables/useForwardProps";
import { useContentSearch } from "../../composables/useContentSearch";
import { useLocale } from "../../composables/useLocale";
import { omit, transformUI } from "../../utils";
import { tv } from "../../utils/tv";
import UButton from "../Button.vue";
import UKbd from "../Kbd.vue";
import UTooltip from "../Tooltip.vue";
defineOptions({ inheritAttrs: false });
const _props = defineProps({
  icon: { type: null, required: false },
  label: { type: String, required: false },
  color: { type: null, required: false, default: "neutral" },
  variant: { type: null, required: false },
  collapsed: { type: Boolean, required: false, default: true },
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
const props = useComponentProps("contentSearchButton", _props);
const [DefineButtonTemplate, ReuseButtonTemplate] = createReusableTemplate();
const getProxySlots = () => omit(slots, ["trailing"]);
const buttonProps = useForwardProps(reactiveOmit(props, "icon", "label", "variant", "collapsed", "tooltip", "kbds", "class", "ui"));
const tooltipProps = toRef(() => defu(typeof props.tooltip === "boolean" ? {} : props.tooltip, { delayDuration: 0, content: { side: "right" } }));
const { t } = useLocale();
const { open } = useContentSearch();
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.contentSearchButton || {} })({
  collapsed: props.collapsed
}));
</script>

<template>
  <DefineButtonTemplate>
    <UButton
      :icon="props.icon || appConfig.ui.icons.search"
      :label="props.label || t('contentSearchButton.label')"
      :variant="props.variant || (props.collapsed ? 'ghost' : 'outline')"
      v-bind="{
  ...buttonProps,
  ...props.collapsed ? {
    'square': true,
    'aria-label': props.label || t('contentSearchButton.label')
  } : {},
  ...$attrs
}"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
      :ui="transformUI(ui, props.ui)"
      @click="open = true"
    >
      <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>

      <template #trailing="{ ui: uiProxy }">
        <div data-slot="trailing" :class="ui.trailing({ class: props.ui?.trailing })">
          <slot name="trailing" :ui="uiProxy">
            <template v-if="props.kbds?.length">
              <UKbd v-for="(kbd, index) in props.kbds" :key="index" variant="subtle" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
            </template>
          </slot>
        </div>
      </template>
    </UButton>
  </DefineButtonTemplate>

  <UTooltip v-if="props.collapsed && props.tooltip" :text="props.label || t('contentSearchButton.label')" v-bind="tooltipProps">
    <ReuseButtonTemplate />
  </UTooltip>
  <ReuseButtonTemplate v-else />
</template>
