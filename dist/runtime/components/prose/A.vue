<script>
import theme from "#build/ui/prose/a";
</script>

<script setup>
import { computed } from "vue";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../../composables/useComponentProps";
import { tv } from "../../utils/tv";
import ULink from "../Link.vue";
const _props = defineProps({
  href: { type: String, required: false },
  target: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const props = useComponentProps("prose.a", _props);
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.a || {} }));
</script>

<template>
  <ULink :href="props.href" :target="props.target" :class="ui({ class: [props.ui?.base, props.class] })" raw>
    <slot />
  </ULink>
</template>
