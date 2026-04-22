<script>
import theme from "#build/ui/chat-shimmer";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { tv } from "../utils/tv";
const props = defineProps({
  as: { type: null, required: false, default: "span" },
  text: { type: String, required: true },
  duration: { type: Number, required: false, default: 2 },
  spread: { type: Number, required: false, default: 2 },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const appConfig = useAppConfig();
const uiProp = useComponentUI("chatShimmer", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.chatShimmer || {} }));
const spread = computed(() => props.text.length * props.spread);
</script>

<template>
  <Primitive
    :as="as"
    :style="{
  '--spread': `${spread}px`,
  '--duration': `${duration}s`
}"
    data-slot="base"
    :class="ui({ class: [uiProp?.base, props.class] })"
  >
    {{ text }}
  </Primitive>
</template>
