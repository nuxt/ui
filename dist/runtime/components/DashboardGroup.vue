<script>
import theme from "#build/ui/dashboard-group";
</script>

<script setup>
import { ref, computed } from "vue";
import { Primitive } from "reka-ui";
import { useNuxtApp, useAppConfig } from "#imports";
import { provideDashboardContext } from "../utils/dashboard";
import { tv } from "../utils/tv";
import { useComponentProps } from "../composables/useComponentProps";
const _props = defineProps({
  as: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  storage: { type: String, required: false, default: "cookie" },
  storageKey: { type: String, required: false, default: "dashboard" },
  storageOptions: { type: Object, required: false },
  persistent: { type: Boolean, required: false, default: true },
  unit: { type: String, required: false, default: "%" }
});
defineSlots();
const props = useComponentProps("dashboardGroup", _props);
const nuxtApp = useNuxtApp();
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.dashboardGroup || {} }));
const sidebarOpen = ref(false);
const sidebarCollapsed = ref(false);
provideDashboardContext({
  storage: props.storage,
  storageKey: props.storageKey,
  storageOptions: props.storageOptions,
  persistent: props.persistent,
  unit: props.unit,
  sidebarOpen,
  toggleSidebar: () => {
    nuxtApp.hooks.callHook("dashboard:sidebar:toggle");
  },
  sidebarCollapsed,
  collapseSidebar: (collapsed) => {
    nuxtApp.hooks.callHook("dashboard:sidebar:collapse", collapsed);
  },
  toggleSearch: () => {
    nuxtApp.hooks.callHook("dashboard:search:toggle");
  }
});
</script>

<template>
  <Primitive :as="props.as" :class="ui({ class: [props.ui?.base, props.class] })">
    <slot />
  </Primitive>
</template>
