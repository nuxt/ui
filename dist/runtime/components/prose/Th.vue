<script>
import theme from "#build/ui/prose/th";
</script>

<script setup>
import { computed } from "vue";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../../composables/useComponentUI";
import { tv } from "../../utils/tv";
const props = defineProps({
  align: { type: String, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("prose.th", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.th || {} }));
</script>

<template>
  <th :class="ui({ align: props.align, class: [uiProp?.base, props.class] })">
    <slot />
  </th>
</template>
