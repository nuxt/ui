<script>
import theme from "#build/ui/prose/code-preview";
</script>

<script setup>
import { computed } from "vue";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../../composables/useComponentUI";
import { tv } from "../../utils/tv";
const props = defineProps({
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("prose.codePreview", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.codePreview || {} })({ code: !!slots.code }));
</script>

<template>
  <div :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div :class="ui.preview({ class: [uiProp?.preview] })">
      <slot />
    </div>

    <div v-if="!!slots.code" :class="ui.code({ class: [uiProp?.code] })">
      <slot name="code" />
    </div>
  </div>
</template>
