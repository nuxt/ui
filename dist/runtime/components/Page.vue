<script>
import theme from "#build/ui/page";
</script>

<script setup>
import { computed, onBeforeUpdate, shallowRef } from "vue";
import { Primitive, Slot } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { tv } from "../utils/tv";
const props = defineProps({
  as: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("page", props);
const hasLeft = shallowRef(!!slots.left);
const hasRight = shallowRef(!!slots.right);
onBeforeUpdate(() => {
  hasLeft.value = !!slots.left;
  hasRight.value = !!slots.right;
});
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.page || {} })({
  left: hasLeft.value,
  right: hasRight.value
}));
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <Slot v-if="!!slots.left" data-slot="left" :class="ui.left({ class: uiProp?.left })">
      <slot name="left" />
    </Slot>

    <div data-slot="center" :class="ui.center({ class: uiProp?.center })">
      <slot />
    </div>

    <Slot v-if="!!slots.right" data-slot="right" :class="ui.right({ class: uiProp?.right })">
      <slot name="right" />
    </Slot>
  </Primitive>
</template>
