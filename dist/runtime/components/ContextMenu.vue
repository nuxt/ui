<script>
import theme from "#build/ui/context-menu";
</script>

<script setup>
import { computed, toRef } from "vue";
import { ContextMenuRoot, ContextMenuTrigger } from "reka-ui";
import { useForwardProps } from "../composables/useForwardProps";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { omit } from "../utils";
import { tv } from "../utils/tv";
import UContextMenuContent from "./ContextMenuContent.vue";
const _props = defineProps({
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
const props = useComponentProps("contextMenu", _props);
const appConfig = useAppConfig();
const rootProps = useForwardProps(reactivePick(props, "modal"), emits);
const contentProps = toRef(() => props.content);
const getProxySlots = () => omit(slots, ["default"]);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.contextMenu || {} })({
  size: props.size
}));
</script>

<template>
  <ContextMenuRoot v-bind="rootProps">
    <ContextMenuTrigger v-if="!!slots.default" as-child :disabled="props.disabled" :class="props.class">
      <slot />
    </ContextMenuTrigger>

    <UContextMenuContent
      :class="ui.content({ class: [!slots.default && props.class, props.ui?.content] })"
      :ui="ui"
      :ui-override="props.ui"
      v-bind="contentProps"
      :items="props.items"
      :portal="props.portal"
      :label-key="props.labelKey"
      :description-key="props.descriptionKey"
      :checked-icon="props.checkedIcon"
      :loading-icon="props.loadingIcon"
      :external-icon="props.externalIcon"
    >
      <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </UContextMenuContent>
  </ContextMenuRoot>
</template>
