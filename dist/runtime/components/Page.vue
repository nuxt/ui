<script>
import theme from "#build/ui/page";
</script>

<script setup>
import { computed, onBeforeUpdate, shallowRef } from "vue";
import { Primitive, Slot } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { tv } from "../utils/tv";
const _props = defineProps({
  as: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const props = useComponentProps("page", _props);
const appConfig = useAppConfig();
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
  <Primitive :as="props.as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <Slot v-if="!!slots.left" data-slot="left" :class="ui.left({ class: props.ui?.left })">
      <slot name="left" />
    </Slot>

    <div data-slot="center" :class="ui.center({ class: props.ui?.center })">
      <slot />
    </div>

    <Slot v-if="!!slots.right" data-slot="right" :class="ui.right({ class: props.ui?.right })">
      <slot name="right" />
    </Slot>
  </Primitive>
</template>
