<script>
import theme from "#build/ui/prose/a";
</script>

<script setup>
import { computed } from "vue";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../../composables/useComponentUI";
import { tv } from "../../utils/tv";
import ULink from "../Link.vue";
const props = defineProps({
  href: { type: String, required: false },
  target: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("prose.a", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.a || {} }));
</script>

<template>
  <ULink :href="href" :target="target" :class="ui({ class: [uiProp?.base, props.class] })" raw>
    <slot />
  </ULink>
</template>
