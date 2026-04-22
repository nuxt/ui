<script>
import theme from "#build/ui/context-menu";
</script>

<script setup>
import { computed, toRef } from "vue";
import { ContextMenuRoot, ContextMenuTrigger, useForwardPropsEmits } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { omit } from "../utils";
import { tv } from "../utils/tv";
import UContextMenuContent from "./ContextMenuContent.vue";
const props = defineProps({
  size: { type: null, required: false },
  items: { type: null, required: false },
  checkedIcon: { type: null, required: false },
  loadingIcon: { type: null, required: false },
  externalIcon: { type: [Boolean, String], required: false, skipCheck: true, default: true },
  content: { type: Object, required: false },
  portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
  labelKey: { type: null, required: false, default: "label" },
  descriptionKey: { type: null, required: false, default: "description" },
  disabled: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  pressOpenDelay: { type: Number, required: false },
  modal: { type: Boolean, required: false, default: true }
});
const emits = defineEmits(["update:open"]);
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("contextMenu", props);
const rootProps = useForwardPropsEmits(reactivePick(props, "modal"), emits);
const contentProps = toRef(() => props.content);
const getProxySlots = () => omit(slots, ["default"]);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.contextMenu || {} })({
  size: props.size
}));
</script>

<template>
  <ContextMenuRoot v-bind="rootProps">
    <ContextMenuTrigger v-if="!!slots.default" as-child :disabled="disabled" :class="props.class">
      <slot />
    </ContextMenuTrigger>

    <UContextMenuContent
      :class="ui.content({ class: [!slots.default && props.class, uiProp?.content] })"
      :ui="ui"
      :ui-override="uiProp"
      v-bind="contentProps"
      :items="items"
      :portal="portal"
      :label-key="labelKey"
      :description-key="descriptionKey"
      :checked-icon="checkedIcon"
      :loading-icon="loadingIcon"
      :external-icon="externalIcon"
    >
      <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </UContextMenuContent>
  </ContextMenuRoot>
</template>
