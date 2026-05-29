<script>
import theme from "#build/ui/chat-shimmer";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { tv } from "../utils/tv";
const _props = defineProps({
  as: { type: null, required: false, default: "span" },
  text: { type: String, required: true },
  duration: { type: Number, required: false, default: 2 },
  spread: { type: Number, required: false, default: 2 },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const props = useComponentProps("chatShimmer", _props);
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.chatShimmer || {} }));
const spread = computed(() => props.text.length * props.spread);
</script>

<template>
  <Primitive
    :as="props.as"
    :style="{
  '--spread': `${spread}px`,
  '--duration': `${props.duration}s`
}"
    data-slot="base"
    :class="ui({ class: [props.ui?.base, props.class] })"
  >
    {{ props.text }}
  </Primitive>
</template>
