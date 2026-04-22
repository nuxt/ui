<script>
import theme from "#build/ui/prose/h2";
</script>

<script setup>
import { computed } from "vue";
import { useRuntimeConfig, useAppConfig } from "#imports";
import { useComponentUI } from "../../composables/useComponentUI";
import { tv } from "../../utils/tv";
import UIcon from "../Icon.vue";
const props = defineProps({
  id: { type: String, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("prose.h2", props);
const { headings } = useRuntimeConfig().public?.mdc || {};
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.h2 || {} })());
const generate = computed(() => props.id && typeof headings?.anchorLinks === "object" && headings.anchorLinks.h2);
</script>

<template>
  <h2 :id="id" :class="ui.base({ class: [uiProp?.base, props.class] })">
    <a v-if="id && generate" :href="`#${id}`" :class="ui.link({ class: uiProp?.link })">
      <span :class="ui.leading({ class: uiProp?.leading })">
        <UIcon :name="appConfig.ui.icons.hash" :class="ui.leadingIcon({ class: uiProp?.leadingIcon })" />
      </span>

      <slot />
    </a>
    <slot v-else />
  </h2>
</template>
