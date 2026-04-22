<script>
import theme from "#build/ui/collapsible";
</script>

<script setup>
import { computed } from "vue";
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent, useForwardPropsEmits } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { tv } from "../utils/tv";
const props = defineProps({
  as: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  defaultOpen: { type: Boolean, required: false },
  open: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false },
  unmountOnHide: { type: Boolean, required: false, default: true }
});
const emits = defineEmits(["update:open"]);
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("collapsible", props);
const rootProps = useForwardPropsEmits(reactivePick(props, "as", "defaultOpen", "open", "disabled", "unmountOnHide"), emits);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.collapsible || {} })());
</script>

<template>
  <CollapsibleRoot v-slot="{ open }" v-bind="rootProps" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <CollapsibleTrigger v-if="!!slots.default" as-child>
      <slot :open="open" />
    </CollapsibleTrigger>

    <CollapsibleContent data-slot="content" :class="ui.content({ class: uiProp?.content })">
      <slot name="content" />
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
