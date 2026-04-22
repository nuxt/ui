<script>
import theme from "#build/ui/dashboard-panel";
</script>

<script setup>
import { computed, useId, toRef } from "vue";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useResizable } from "../composables/useResizable";
import { useDashboard } from "../utils/dashboard";
import { tv } from "../utils/tv";
import UDashboardResizeHandle from "./DashboardResizeHandle.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  id: { type: String, required: false },
  minSize: { type: Number, required: false, default: 15 },
  maxSize: { type: Number, required: false },
  defaultSize: { type: Number, required: false },
  resizable: { type: Boolean, required: false, default: false }
});
defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("dashboardPanel", props);
const dashboardContext = useDashboard({ storageKey: "dashboard", unit: "%" });
const id = `${dashboardContext.storageKey}-panel-${props.id || useId()}`;
const { el, size, isDragging, onMouseDown, onTouchStart, onDoubleClick } = useResizable(id, toRef(() => ({ ...dashboardContext, ...props })));
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.dashboardPanel || {} })({
  size: !!size.value
}));
</script>

<template>
  <div
    :id="id"
    ref="el"
    v-bind="$attrs"
    :data-dragging="isDragging"
    data-slot="root"
    :class="ui.root({ class: [uiProp?.root, props.class] })"
    :style="[size ? { '--width': `${size}${dashboardContext.unit}` } : void 0]"
  >
    <slot>
      <slot name="header" />

      <div data-slot="body" :class="ui.body({ class: uiProp?.body })">
        <slot name="body" />
      </div>

      <slot name="footer" />
    </slot>
  </div>

  <slot name="resize-handle" :on-mouse-down="onMouseDown" :on-touch-start="onTouchStart" :on-double-click="onDoubleClick">
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
</template>
