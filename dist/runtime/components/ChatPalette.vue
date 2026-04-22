<script>
import theme from "#build/ui/chat-palette";
</script>

<script setup>
import { computed } from "vue";
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
const uiProp = useComponentUI("chatPalette", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.chatPalette || {} })());
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div data-slot="content" :class="ui.content({ class: uiProp?.content })">
      <Slot compact>
        <slot />
      </Slot>
    </div>

    <Slot v-if="!!slots.prompt" data-slot="prompt" :class="ui.prompt({ class: uiProp?.prompt })">
      <slot name="prompt" />
    </Slot>
  </Primitive>
</template>
