<script>
import theme from "#build/ui/footer";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { tv } from "../utils/tv";
import UContainer from "./Container.vue";
const _props = defineProps({
  as: { type: null, required: false, default: "footer" },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const props = useComponentProps("footer", _props);
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.footer || {} })());
</script>

<template>
  <Primitive :as="props.as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="!!slots.top" data-slot="top" :class="ui.top({ class: props.ui?.top })">
      <slot name="top" />
    </div>

    <UContainer data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <div data-slot="right" :class="ui.right({ class: props.ui?.right })">
        <slot name="right" />
      </div>

      <div data-slot="center" :class="ui.center({ class: props.ui?.center })">
        <slot />
      </div>

      <div data-slot="left" :class="ui.left({ class: props.ui?.left })">
        <slot name="left" />
      </div>
    </UContainer>

    <div v-if="!!slots.bottom" data-slot="bottom" :class="ui.bottom({ class: props.ui?.bottom })">
      <slot name="bottom" />
    </div>
  </Primitive>
</template>
