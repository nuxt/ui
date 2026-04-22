<script>
import theme from "#build/ui/card";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { tv } from "../utils/tv";
const props = defineProps({
  as: { type: null, required: false },
  variant: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("card", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.card || {} })({
  variant: props.variant
}));
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div v-if="!!slots.header" data-slot="header" :class="ui.header({ class: uiProp?.header })">
      <slot name="header" />
    </div>

    <div v-if="!!slots.default" data-slot="body" :class="ui.body({ class: uiProp?.body })">
      <slot />
    </div>

    <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: uiProp?.footer })">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
