<script>
import theme from "#build/ui/content/content-search";
</script>

<script setup>
import { computed, useTemplateRef } from "vue";
import { useForwardProps } from "reka-ui";
import { defu } from "defu";
import { reactivePick } from "@vueuse/core";
import { useAppConfig, useColorMode, defineShortcuts } from "#imports";
import { useComponentUI } from "../../composables/useComponentUI";
import { useContentSearch } from "../../composables/useContentSearch";
import { useLocale } from "../../composables/useLocale";
import { omit, transformUI } from "../../utils";
import { tv } from "../../utils/tv";
import UModal from "../Modal.vue";
import UCommandPalette from "../CommandPalette.vue";
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
  links: { type: Array, required: false },
  navigation: { type: Array, required: false },
  groups: { type: Array, required: false },
  files: { type: Array, required: false },
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
const searchTerm = defineModel("searchTerm", { type: String, ...{ default: "" } });
const { t } = useLocale();
const { open, mapNavigationItems, postFilter } = useContentSearch();
const colorMode = useColorMode();
const appConfig = useAppConfig();
const uiProp = useComponentUI("contentSearch", props);
const commandPaletteProps = useForwardProps(reactivePick(props, "size", "icon", "placeholder", "autofocus", "loading", "loadingIcon", "close", "closeIcon"));
const modalProps = useForwardProps(reactivePick(props, "overlay", "transition", "content", "dismissible", "fullscreen", "modal", "portal"));
const getProxySlots = () => omit(slots, ["content"]);
const fuse = computed(() => defu({}, props.fuse, {
  fuseOptions: {
    includeMatches: true
  }
}));
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.contentSearch || {} })({
  size: props.size,
  fullscreen: props.fullscreen
}));
const commandPaletteRef = useTemplateRef("commandPaletteRef");
const mappedLinksItems = computed(() => {
  if (!props.links?.length) {
    return [];
  }
  return props.links.flatMap((link) => [{
    ...link,
    suffix: link.description,
    description: void 0,
    icon: link.icon || appConfig.ui.icons.file,
    children: void 0
  }, ...link.children?.map((child) => ({
    ...child,
    prefix: link.label + " >",
    suffix: child.description,
    description: void 0,
    icon: child.icon || link.icon || appConfig.ui.icons.file
  })) || []]);
});
const mappedNavigationGroups = computed(() => {
  if (!props.navigation?.length) {
    return [];
  }
  if (props.navigation.some((link) => !!link.children?.length)) {
    return props.navigation.map((group) => ({
      id: group.path,
      label: group.title,
      items: mapNavigationItems(group.children || [], props.files || []),
      postFilter
    }));
  } else {
    return [{ id: "docs", items: mapNavigationItems(props.navigation, props.files || []), postFilter }];
  }
});
const themeGroup = computed(() => {
  if (!props.colorMode || colorMode?.forced) {
    return null;
  }
  return {
    id: "theme",
    label: t("contentSearch.theme"),
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
  };
});
const groups = computed(() => {
  const groups2 = [];
  if (mappedLinksItems.value.length) {
    groups2.push({ id: "links", label: t("contentSearch.links"), items: mappedLinksItems.value });
  }
  groups2.push(...mappedNavigationGroups.value);
  groups2.push(...props.groups || []);
  if (themeGroup.value) {
    groups2.push(themeGroup.value);
  }
  return groups2;
});
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
    :title="title || t('contentSearch.title')"
    :description="description || t('contentSearch.description')"
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
