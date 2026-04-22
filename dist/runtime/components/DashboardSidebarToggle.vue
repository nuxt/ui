<script>
import theme from "#build/ui/dashboard-sidebar-toggle";
</script>

<script setup>
import { ref, computed } from "vue";
import { useForwardProps } from "reka-ui";
import { reactiveOmit } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useLocale } from "../composables/useLocale";
import { useComponentUI } from "../composables/useComponentUI";
import { useDashboard } from "../utils/dashboard";
import { tv } from "../utils/tv";
import UButton from "./Button.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  color: { type: null, required: false, default: "neutral" },
  variant: { type: null, required: false, default: "ghost" },
  side: { type: String, required: false, default: "left" },
  ui: { type: Object, required: false },
  label: { type: String, required: false },
  activeColor: { type: null, required: false },
  activeVariant: { type: null, required: false },
  size: { type: null, required: false },
  square: { type: Boolean, required: false },
  block: { type: Boolean, required: false },
  loadingAuto: { type: Boolean, required: false },
  onClick: { type: [Function, Array], required: false },
  class: { type: null, required: false },
  icon: { type: null, required: false },
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
const buttonProps = useForwardProps(reactiveOmit(props, "icon", "side", "class"));
const { t } = useLocale();
const appConfig = useAppConfig();
const uiProp = useComponentUI("dashboardSidebarToggle", props);
const { sidebarOpen, toggleSidebar } = useDashboard({ sidebarOpen: ref(false), toggleSidebar: () => {
} });
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.dashboardSidebarToggle || {} }));
</script>

<template>
  <UButton
    v-bind="{
  ...buttonProps,
  'icon': props.icon || (sidebarOpen ? appConfig.ui.icons.close : appConfig.ui.icons.menu),
  'aria-label': sidebarOpen ? t('dashboardSidebarToggle.close') : t('dashboardSidebarToggle.open'),
  ...$attrs
}"
    :class="ui({ class: [uiProp?.base, props.class], side: props.side })"
    @click="toggleSidebar"
  />
</template>
