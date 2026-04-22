<script>
import theme from "#build/ui/marquee";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { tv } from "../utils/tv";
const props = defineProps({
  as: { type: null, required: false },
  pauseOnHover: { type: Boolean, required: false },
  reverse: { type: Boolean, required: false },
  orientation: { type: null, required: false, default: "horizontal" },
  repeat: { type: Number, required: false, default: 4 },
  overlay: { type: Boolean, required: false, default: true },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("marquee", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.marquee || {} })({
  pauseOnHover: props.pauseOnHover,
  orientation: props.orientation,
  reverse: props.reverse,
  overlay: props.overlay
}));
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div v-for="i in repeat" :key="i" data-slot="content" :class="ui.content({ class: [uiProp?.content] })">
      <slot />
    </div>
  </Primitive>
</template>
