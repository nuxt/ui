<script>
import theme from "#build/ui/dropdown-menu";
</script>

<script setup>
import { computed, toRef } from "vue";
import { defu } from "defu";
import { DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuArrow, useForwardPropsEmits } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { omit } from "../utils";
import { tv } from "../utils/tv";
import UDropdownMenuContent from "./DropdownMenuContent.vue";
const props = defineProps({
  size: { type: null, required: false },
  items: { type: null, required: false },
  checkedIcon: { type: null, required: false },
  loadingIcon: { type: null, required: false },
  externalIcon: { type: [Boolean, String], required: false, skipCheck: true, default: true },
  content: { type: Object, required: false },
  arrow: { type: [Boolean, Object], required: false },
  portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
  labelKey: { type: null, required: false, default: "label" },
  descriptionKey: { type: null, required: false, default: "description" },
  filter: { type: [Boolean, Object], required: false, default: false },
  filterFields: { type: Array, required: false },
  ignoreFilter: { type: Boolean, required: false, default: false },
  disabled: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  defaultOpen: { type: Boolean, required: false },
  open: { type: Boolean, required: false },
  modal: { type: Boolean, required: false, default: true }
});
const emits = defineEmits(["update:open"]);
const slots = defineSlots();
const searchTerm = defineModel("searchTerm", { type: String, ...{ default: "" } });
const appConfig = useAppConfig();
const uiProp = useComponentUI("dropdownMenu", props);
const rootProps = useForwardPropsEmits(reactivePick(props, "defaultOpen", "open", "modal"), emits);
const contentProps = toRef(() => defu(props.content, { side: "bottom", sideOffset: 8, collisionPadding: 8 }));
const arrowProps = toRef(() => defu(props.arrow, { rounded: true }));
const getProxySlots = () => omit(slots, ["default"]);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.dropdownMenu || {} })({
  size: props.size
}));
</script>

<template>
  <DropdownMenuRoot v-slot="{ open }" v-bind="rootProps">
    <DropdownMenuTrigger v-if="!!slots.default" as-child :class="props.class" :disabled="disabled">
      <slot :open="open" />
    </DropdownMenuTrigger>

    <UDropdownMenuContent
      v-model:search-term="searchTerm"
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
      :size="size"
      :filter="filter"
      :filter-fields="filterFields"
      :ignore-filter="ignoreFilter"
    >
      <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>

      <DropdownMenuArrow v-if="!!arrow" v-bind="arrowProps" data-slot="arrow" :class="ui.arrow({ class: uiProp?.arrow })" />
    </UDropdownMenuContent>
  </DropdownMenuRoot>
</template>
