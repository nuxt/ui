<script>
import theme from "#build/ui/page-aside";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { tv } from "../utils/tv";
const props = defineProps({
  as: { type: null, required: false, default: "aside" },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("pageAside", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pageAside || {} })());
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div data-slot="container" :class="ui.container({ class: uiProp?.container })">
      <div v-if="!!slots.top" data-slot="top" :class="ui.top({ class: uiProp?.top })">
        <div data-slot="topHeader" :class="ui.topHeader({ class: uiProp?.topHeader })" />
        <div data-slot="topBody" :class="ui.topBody({ class: uiProp?.topBody })">
          <slot name="top" />
        </div>
        <div data-slot="topFooter" :class="ui.topFooter({ class: uiProp?.topFooter })" />
      </div>

      <slot />

      <slot name="bottom" />
    </div>
  </Primitive>
</template>
