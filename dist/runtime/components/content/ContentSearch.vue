<script>
import theme from "#build/ui/content/content-search";
</script>

<script setup>
import { computed, shallowRef, useTemplateRef, watch } from "vue";
import { defu } from "defu";
import { reactivePick, refDebounced } from "@vueuse/core";
import { useAppConfig, useColorMode, defineShortcuts } from "#imports";
import { useComponentProps } from "../../composables/useComponentProps";
import { useForwardProps } from "../../composables/useForwardProps";
import { useContentSearch } from "../../composables/useContentSearch";
import { useLocale } from "../../composables/useLocale";
import { omit, transformUI } from "../../utils";
import { tv } from "../../utils/tv";
import UModal from "../Modal.vue";
import UCommandPalette from "../CommandPalette.vue";
const _props = defineProps({
  size: { type: null, required: false },
  close: { type: [Boolean, Object], required: false, default: true },
  shortcut: { type: String, required: false, default: "meta_k" },
  links: { type: Array, required: false },
  navigation: { type: Array, required: false },
  files: { type: Array, required: false },
  fuse: { type: Object, required: false },
  search: { type: Function, required: false },
  searchStatus: { type: String, required: false },
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
const props = useComponentProps("contentSearch", _props);
const searchTerm = defineModel("searchTerm", { type: String, ...{ default: "" } });
const { t } = useLocale();
const { open, mapNavigationItems, mapLinks, mapSearchResults, postFilter } = useContentSearch();
const colorMode = useColorMode();
const appConfig = useAppConfig();
const commandPaletteProps = useForwardProps(reactivePick(props, "size", "icon", "trailingIcon", "selectedIcon", "childrenIcon", "placeholder", "autofocus", "loading", "loadingIcon", "close", "closeIcon", "back", "backIcon", "disabled", "highlightOnHover", "labelKey", "descriptionKey", "preserveGroupOrder", "virtualize", "searchDelay"));
const modalProps = useForwardProps(reactivePick(props, "overlay", "transition", "content", "dismissible", "fullscreen", "modal", "portal"));
const getProxySlots = () => omit(slots, ["content"]);
const fuse = computed(() => defu({}, props.fuse, {
  fuseOptions: {
    includeMatches: true,
    useTokenSearch: true
  },
  resultLimit: 12
}));
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.contentSearch || {} })({
  size: props.size,
  fullscreen: props.fullscreen
}));
const commandPaletteRef = useTemplateRef("commandPaletteRef");
const debouncedSearchTerm = refDebounced(searchTerm, () => props.searchDelay);
const rawSearchResults = shallowRef([]);
const searchResults = computed(() => mapSearchResults(rawSearchResults.value, props.navigation));
let searchRequestId = 0;
async function runSearch(term) {
  const requestId = ++searchRequestId;
  if (!props.search || !term) {
    rawSearchResults.value = [];
    return;
  }
  try {
    const results = await props.search(term, {
      limit: fuse.value.resultLimit,
      snippet: { columns: ["title", "content"], around: 20 }
    });
    if (requestId !== searchRequestId) return;
    rawSearchResults.value = results;
  } catch (err) {
    if (requestId !== searchRequestId) return;
    console.error("[ContentSearch] search failed:", err);
    rawSearchResults.value = [];
  }
}
watch(debouncedSearchTerm, runSearch);
watch(() => props.search, () => {
  if (debouncedSearchTerm.value) {
    runSearch(debouncedSearchTerm.value);
  }
});
watch(() => props.searchStatus, (status) => {
  if (status === "ready" && debouncedSearchTerm.value) {
    runSearch(debouncedSearchTerm.value);
  }
});
const linksGroup = computed(() => {
  if (!props.links?.length) {
    return null;
  }
  return { id: "links", label: t("contentSearch.links"), items: mapLinks(props.links) };
});
const searchGroups = computed(() => {
  if (!searchTerm.value || !searchResults.value.length) return [];
  return [{ id: "search", label: t("contentSearch.search"), items: searchResults.value, ignoreFilter: true }];
});
const navigationGroups = computed(() => {
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
  if (linksGroup.value) {
    groups2.push(linksGroup.value);
  }
  if (props.search) {
    groups2.push(...searchGroups.value);
  } else {
    groups2.push(...navigationGroups.value);
  }
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
    :title="props.title || t('contentSearch.title')"
    :description="props.description || t('contentSearch.description')"
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
