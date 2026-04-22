<script>
import theme from "#build/ui/dashboard-search";
</script>

<script setup>
import { computed, useTemplateRef } from "vue";
import { useForwardProps } from "reka-ui";
import { defu } from "defu";
import { reactivePick } from "@vueuse/core";
import { useAppConfig, useColorMode, defineShortcuts, useRuntimeHook } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useLocale } from "../composables/useLocale";
import { omit, transformUI } from "../utils";
import { tv } from "../utils/tv";
import UCommandPalette from "./CommandPalette.vue";
import UModal from "./Modal.vue";
const props = defineProps({
  size: { type: null, required: false },
  icon: { type: null, required: false },
  placeholder: { type: String, required: false },
  autofocus: { type: Boolean, required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: null, required: false },
  close: { type: [Boolean, Object], required: false, default: true },
  closeIcon: { type: null, required: false },
  shortcut: { type: String, required: false, default: "meta_k" },
  groups: { type: Array, required: false },
  fuse: { type: Object, required: false },
  colorMode: { type: Boolean, required: false, default: true },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  title: { type: String, required: false },
  description: { type: String, required: false },
  overlay: { type: Boolean, required: false },
  transition: { type: Boolean, required: false },
  content: { type: Object, required: false },
  dismissible: { type: Boolean, required: false },
  fullscreen: { type: Boolean, required: false, default: false },
  modal: { type: Boolean, required: false },
  portal: { type: [Boolean, String], required: false, skipCheck: true }
});
const slots = defineSlots();
const open = defineModel("open", { type: Boolean, ...{ default: false } });
const searchTerm = defineModel("searchTerm", { type: String, ...{ default: "" } });
useRuntimeHook("dashboard:search:toggle", () => {
  open.value = !open.value;
});
const { t } = useLocale();
const colorMode = useColorMode();
const appConfig = useAppConfig();
const uiProp = useComponentUI("dashboardSearch", props);
const commandPaletteProps = useForwardProps(reactivePick(props, "size", "icon", "placeholder", "autofocus", "loading", "loadingIcon", "close", "closeIcon"));
const modalProps = useForwardProps(reactivePick(props, "overlay", "transition", "content", "dismissible", "fullscreen", "modal", "portal"));
const getProxySlots = () => omit(slots, ["content"]);
const fuse = computed(() => defu({}, props.fuse, {
  fuseOptions: {}
}));
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.dashboardSearch || {} })({
  size: props.size,
  fullscreen: props.fullscreen
}));
const groups = computed(() => {
  const groups2 = [];
  groups2.push(...props.groups || []);
  if (props.colorMode && !colorMode?.forced) {
    groups2.push({
      id: "theme",
      label: t("dashboardSearch.theme"),
      items: [{
        label: t("colorMode.system"),
        icon: appConfig.ui.icons.system,
        active: colorMode.preference === "system",
        onSelect: () => {
          colorMode.preference = "system";
        }
      }, {
        label: t("colorMode.light"),
        icon: appConfig.ui.icons.light,
        active: colorMode.preference === "light",
        onSelect: () => {
          colorMode.preference = "light";
        }
      }, {
        label: t("colorMode.dark"),
        icon: appConfig.ui.icons.dark,
        active: colorMode.preference === "dark",
        onSelect: () => {
          colorMode.preference = "dark";
        }
      }]
    });
  }
  return groups2;
});
const commandPaletteRef = useTemplateRef("commandPaletteRef");
function onSelect(item) {
  if (item.disabled) {
    return;
  }
  open.value = false;
  searchTerm.value = "";
}
defineShortcuts({
  [props.shortcut]: {
    usingInput: true,
    handler: () => open.value = !open.value
  }
});
defineExpose({
  commandPaletteRef
});
</script>

<template>
  <UModal
    v-model:open="open"
    :title="title || t('dashboardSearch.title')"
    :description="description || t('dashboardSearch.description')"
    v-bind="modalProps"
    data-slot="modal"
    :class="ui.modal({ class: [uiProp?.modal, props.class] })"
  >
    <template #content="contentData">
      <slot name="content" v-bind="contentData">
        <UCommandPalette
          ref="commandPaletteRef"
          v-model:search-term="searchTerm"
          v-bind="commandPaletteProps"
          :groups="groups"
          :fuse="fuse"
          :input="{ fixed: true }"
          :ui="transformUI(omit(ui, ['modal']), uiProp)"
          @update:model-value="onSelect"
          @update:open="open = $event"
        >
          <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </UCommandPalette>
      </slot>
    </template>
  </UModal>
</template>
