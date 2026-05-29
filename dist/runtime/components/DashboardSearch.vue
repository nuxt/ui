<script>
import theme from "#build/ui/dashboard-search";
</script>

<script setup>
import { computed, useTemplateRef } from "vue";
import { defu } from "defu";
import { reactivePick } from "@vueuse/core";
import { useAppConfig, useColorMode, defineShortcuts, useRuntimeHook } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useForwardProps } from "../composables/useForwardProps";
import { useLocale } from "../composables/useLocale";
import { omit, transformUI } from "../utils";
import { tv } from "../utils/tv";
import UCommandPalette from "./CommandPalette.vue";
import UModal from "./Modal.vue";
const _props = defineProps({
  size: { type: null, required: false },
  close: { type: [Boolean, Object], required: false, default: true },
  shortcut: { type: String, required: false, default: "meta_k" },
  fuse: { type: Object, required: false },
  searchDelay: { type: Number, required: false, default: 100 },
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
  portal: { type: [Boolean, String], required: false, skipCheck: true },
  icon: { type: null, required: false },
  trailingIcon: { type: null, required: false },
  selectedIcon: { type: null, required: false },
  childrenIcon: { type: null, required: false },
  placeholder: { type: String, required: false },
  autofocus: { type: Boolean, required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: null, required: false },
  closeIcon: { type: null, required: false },
  back: { type: [Boolean, Object], required: false },
  backIcon: { type: null, required: false },
  disabled: { type: Boolean, required: false },
  highlightOnHover: { type: Boolean, required: false },
  labelKey: { type: null, required: false },
  descriptionKey: { type: null, required: false },
  preserveGroupOrder: { type: Boolean, required: false },
  virtualize: { type: [Boolean, Object], required: false },
  groups: { type: Array, required: false }
});
const slots = defineSlots();
const props = useComponentProps("dashboardSearch", _props);
const open = defineModel("open", { type: Boolean, ...{ default: false } });
const searchTerm = defineModel("searchTerm", { type: String, ...{ default: "" } });
useRuntimeHook("dashboard:search:toggle", () => {
  open.value = !open.value;
});
const { t } = useLocale();
const colorMode = useColorMode();
const appConfig = useAppConfig();
const commandPaletteProps = useForwardProps(reactivePick(props, "size", "icon", "trailingIcon", "selectedIcon", "childrenIcon", "placeholder", "autofocus", "loading", "loadingIcon", "close", "closeIcon", "back", "backIcon", "disabled", "highlightOnHover", "labelKey", "descriptionKey", "preserveGroupOrder", "virtualize", "searchDelay"));
const modalProps = useForwardProps(reactivePick(props, "overlay", "transition", "content", "dismissible", "fullscreen", "modal", "portal"));
const getProxySlots = () => omit(slots, ["content"]);
const fuse = computed(() => defu({}, props.fuse, {
  fuseOptions: {
    useTokenSearch: true
  }
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
    :title="props.title || t('dashboardSearch.title')"
    :description="props.description || t('dashboardSearch.description')"
    v-bind="modalProps"
    data-slot="modal"
    :class="ui.modal({ class: [props.ui?.modal, props.class] })"
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
          :ui="transformUI(omit(ui, ['modal']), props.ui)"
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
