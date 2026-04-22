<script>
import theme from "#build/ui/dashboard-sidebar";
</script>

<script setup>
import { ref, computed, toRef, useId, watch } from "vue";
import { defu } from "defu";
import { createReusableTemplate } from "@vueuse/core";
import { useAppConfig, useRuntimeHook, useRoute } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useResizable } from "../composables/useResizable";
import { useLocale } from "../composables/useLocale";
import { useDashboard } from "../utils/dashboard";
import { tv } from "../utils/tv";
import UDashboardResizeHandle from "./DashboardResizeHandle.vue";
import UDashboardSidebarToggle from "./DashboardSidebarToggle.vue";
import USlideover from "./Slideover.vue";
import UModal from "./Modal.vue";
import UDrawer from "./Drawer.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  mode: { type: null, required: false, default: "slideover" },
  menu: { type: null, required: false },
  toggle: { type: [Boolean, Object], required: false, default: true },
  toggleSide: { type: String, required: false, default: "left" },
  autoClose: { type: Boolean, required: false, default: true },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  id: { type: String, required: false },
  side: { type: String, required: false, default: "left" },
  minSize: { type: Number, required: false, default: 10 },
  maxSize: { type: Number, required: false, default: 20 },
  defaultSize: { type: Number, required: false, default: 15 },
  resizable: { type: Boolean, required: false, default: false },
  collapsible: { type: Boolean, required: false, default: false },
  collapsedSize: { type: Number, required: false, default: 0 }
});
const slots = defineSlots();
const open = defineModel("open", { type: Boolean, ...{ default: false } });
const collapsed = defineModel("collapsed", { type: Boolean, ...{ default: false } });
const route = useRoute();
const { t } = useLocale();
const appConfig = useAppConfig();
const uiProp = useComponentUI("dashboardSidebar", props);
const dashboardContext = useDashboard({
  storageKey: "dashboard",
  unit: "%",
  sidebarOpen: ref(false),
  sidebarCollapsed: ref(false)
});
const id = `${dashboardContext.storageKey}-sidebar-${props.id || useId()}`;
const { el, size, collapse, isCollapsed, isDragging, onMouseDown, onTouchStart, onDoubleClick } = useResizable(id, toRef(() => ({ ...dashboardContext, ...props })), { collapsed });
const [DefineToggleTemplate, ReuseToggleTemplate] = createReusableTemplate();
const [DefineResizeHandleTemplate, ReuseResizeHandleTemplate] = createReusableTemplate();
useRuntimeHook("dashboard:sidebar:toggle", () => {
  open.value = !open.value;
});
useRuntimeHook("dashboard:sidebar:collapse", (value) => {
  isCollapsed.value = value;
});
watch(open, () => dashboardContext.sidebarOpen.value = open.value, { immediate: true });
watch(isCollapsed, () => dashboardContext.sidebarCollapsed.value = isCollapsed.value, { immediate: true });
watch(() => route.fullPath, () => {
  if (!props.autoClose) return;
  open.value = false;
});
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.dashboardSidebar || {} })({
  side: props.side
}));
const Menu = computed(() => ({
  slideover: USlideover,
  modal: UModal,
  drawer: UDrawer
})[props.mode]);
const menuProps = toRef(() => defu(props.menu, {}, props.mode === "modal" ? { fullscreen: true, transition: false } : props.mode === "slideover" ? { side: "left" } : {}));
function toggleOpen() {
  open.value = !open.value;
}
</script>

<template>
  <DefineToggleTemplate>
    <slot name="toggle" :open="open" :toggle="toggleOpen" :ui="ui">
      <UDashboardSidebarToggle
        v-if="toggle"
        v-bind="typeof toggle === 'object' ? toggle : {}"
        :side="toggleSide"
        data-slot="toggle"
        :class="ui.toggle({ class: uiProp?.toggle, toggleSide })"
      />
    </slot>
  </DefineToggleTemplate>

  <DefineResizeHandleTemplate>
    <slot name="resize-handle" :on-mouse-down="onMouseDown" :on-touch-start="onTouchStart" :on-double-click="onDoubleClick" :ui="ui">
      <UDashboardResizeHandle
        v-if="resizable"
        :aria-controls="id"
        data-slot="handle"
        :class="ui.handle({ class: uiProp?.handle })"
        @mousedown="onMouseDown"
        @touchstart="onTouchStart"
        @dblclick="onDoubleClick"
      />
    </slot>
  </DefineResizeHandleTemplate>

  <ReuseResizeHandleTemplate v-if="side === 'right'" />

  <div
    :id="id"
    ref="el"
    v-bind="$attrs"
    :data-collapsed="isCollapsed"
    :data-dragging="isDragging"
    data-slot="root"
    :class="ui.root({ class: [uiProp?.root, props.class] })"
    :style="{ '--width': `${size || 0}${dashboardContext.unit}` }"
  >
    <div v-if="!!slots.header" data-slot="header" :class="ui.header({ class: uiProp?.header })">
      <slot name="header" :collapsed="isCollapsed" :collapse="collapse" />
    </div>

    <div data-slot="body" :class="ui.body({ class: uiProp?.body })">
      <slot :collapsed="isCollapsed" :collapse="collapse" />
    </div>

    <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: uiProp?.footer })">
      <slot name="footer" :collapsed="isCollapsed" :collapse="collapse" />
    </div>
  </div>

  <ReuseResizeHandleTemplate v-if="side === 'left'" />

  <Menu
    v-model:open="open"
    :title="t('dashboardSidebar.title')"
    :description="t('dashboardSidebar.description')"
    v-bind="menuProps"
    :ui="{
  overlay: ui.overlay({ class: uiProp?.overlay }),
  content: ui.content({ class: uiProp?.content })
}"
  >
    <template #content="contentData">
      <slot name="content" v-bind="contentData">
        <div v-if="!!slots.header || mode !== 'drawer'" data-slot="header" :class="ui.header({ class: uiProp?.header, menu: true })">
          <ReuseToggleTemplate v-if="mode !== 'drawer' && toggleSide === 'left'" />

          <slot name="header" :collapsed="false" :collapse="() => {
}" />

          <ReuseToggleTemplate v-if="mode !== 'drawer' && toggleSide === 'right'" />
        </div>

        <div data-slot="body" :class="ui.body({ class: uiProp?.body, menu: true })">
          <slot :collapsed="false" :collapse="() => {
}" />
        </div>

        <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: uiProp?.footer, menu: true })">
          <slot name="footer" :collapsed="false" :collapse="() => {
}" />
        </div>
      </slot>
    </template>
  </Menu>
</template>
