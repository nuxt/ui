<script>
import theme from "#build/ui/dashboard-navbar";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useDashboard } from "../utils/dashboard";
import { tv } from "../utils/tv";
import UDashboardSidebarToggle from "./DashboardSidebarToggle.vue";
import UIcon from "./Icon.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  icon: { type: null, required: false },
  title: { type: String, required: false },
  toggle: { type: [Boolean, Object], required: false, default: true },
  toggleSide: { type: String, required: false, default: "left" },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("dashboardNavbar", props);
const dashboardContext = useDashboard({});
const [DefineToggleTemplate, ReuseToggleTemplate] = createReusableTemplate();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.dashboardNavbar || {} })());
</script>

<template>
  <DefineToggleTemplate>
    <slot name="toggle" v-bind="{ ...dashboardContext, ui }">
      <UDashboardSidebarToggle
        v-if="toggle"
        v-bind="typeof toggle === 'object' ? toggle : {}"
        :side="toggleSide"
        data-slot="toggle"
        :class="ui.toggle({ class: uiProp?.toggle, toggleSide })"
      />
    </slot>
  </DefineToggleTemplate>

  <Primitive :as="as" v-bind="$attrs" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div data-slot="left" :class="ui.left({ class: uiProp?.left })">
      <ReuseToggleTemplate v-if="toggleSide === 'left'" />

      <slot name="left" v-bind="dashboardContext">
        <slot name="leading" v-bind="{ ...dashboardContext, ui }">
          <UIcon v-if="icon" :name="icon" data-slot="icon" :class="ui.icon({ class: uiProp?.icon })" />
        </slot>

        <h1 data-slot="title" :class="ui.title({ class: uiProp?.title })">
          <slot name="title">
            {{ title }}
          </slot>
        </h1>

        <slot name="trailing" v-bind="{ ...dashboardContext, ui }" />
      </slot>
    </div>

    <div v-if="!!slots.default" data-slot="center" :class="ui.center({ class: uiProp?.center })">
      <slot v-bind="dashboardContext" />
    </div>

    <div data-slot="right" :class="ui.right({ class: uiProp?.right })">
      <slot name="right" v-bind="dashboardContext" />

      <ReuseToggleTemplate v-if="toggleSide === 'right'" />
    </div>
  </Primitive>
</template>
