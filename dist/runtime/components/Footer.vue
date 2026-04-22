<script>
import theme from "#build/ui/footer";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { tv } from "../utils/tv";
import UContainer from "./Container.vue";
const props = defineProps({
  as: { type: null, required: false, default: "footer" },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("footer", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.footer || {} })());
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div v-if="!!slots.top" data-slot="top" :class="ui.top({ class: uiProp?.top })">
      <slot name="top" />
    </div>

    <UContainer data-slot="container" :class="ui.container({ class: uiProp?.container })">
      <div data-slot="right" :class="ui.right({ class: uiProp?.right })">
        <slot name="right" />
      </div>

      <div data-slot="center" :class="ui.center({ class: uiProp?.center })">
        <slot />
      </div>

      <div data-slot="left" :class="ui.left({ class: uiProp?.left })">
        <slot name="left" />
      </div>
    </UContainer>

    <div v-if="!!slots.bottom" data-slot="bottom" :class="ui.bottom({ class: uiProp?.bottom })">
      <slot name="bottom" />
    </div>
  </Primitive>
</template>
