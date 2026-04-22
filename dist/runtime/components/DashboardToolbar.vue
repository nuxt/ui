<script>
import theme from "#build/ui/dashboard-toolbar";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { tv } from "../utils/tv";
const props = defineProps({
  as: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("dashboardToolbar", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.dashboardToolbar || {} })());
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <slot>
      <div data-slot="left" :class="ui.left({ class: [uiProp?.left] })">
        <slot name="left" />
      </div>

      <div data-slot="right" :class="ui.right({ class: [uiProp?.right] })">
        <slot name="right" />
      </div>
    </slot>
  </Primitive>
</template>
