<script>

</script>

<script setup>
import { computed } from "vue";
import { useForwardProps } from "reka-ui";
import { useColorMode, useAppConfig } from "#imports";
import { useLocale } from "../../composables/useLocale";
import USelectMenu from "../SelectMenu.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  id: { type: String, required: false },
  placeholder: { type: String, required: false },
  searchInput: { type: [Boolean, Object], required: false, default: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  required: { type: Boolean, required: false },
  trailingIcon: { type: null, required: false },
  selectedIcon: { type: null, required: false },
  clear: { type: [Boolean, Object], required: false },
  clearIcon: { type: null, required: false },
  content: { type: Object, required: false },
  arrow: { type: [Boolean, Object], required: false },
  portal: { type: [Boolean, String], required: false, skipCheck: true },
  virtualize: { type: [Boolean, Object], required: false },
  valueKey: { type: null, required: false },
  labelKey: { type: null, required: false },
  descriptionKey: { type: null, required: false },
  defaultValue: { type: null, required: false },
  modelModifiers: { type: null, required: false },
  multiple: { type: Boolean, required: false },
  highlight: { type: Boolean, required: false },
  createItem: { type: [Boolean, String, Object], required: false },
  filterFields: { type: Array, required: false },
  ignoreFilter: { type: Boolean, required: false },
  autofocus: { type: Boolean, required: false },
  autofocusDelay: { type: Number, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  open: { type: Boolean, required: false },
  defaultOpen: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false },
  name: { type: String, required: false },
  resetSearchTermOnBlur: { type: Boolean, required: false },
  resetSearchTermOnSelect: { type: Boolean, required: false },
  resetModelValueOnClear: { type: Boolean, required: false },
  highlightOnHover: { type: Boolean, required: false },
  by: { type: [String, Function], required: false },
  avatar: { type: Object, required: false },
  leading: { type: Boolean, required: false },
  leadingIcon: { type: null, required: false },
  trailing: { type: Boolean, required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: null, required: false }
});
const { t } = useLocale();
const colorMode = useColorMode();
const appConfig = useAppConfig();
const selectMenuProps = useForwardProps(props);
const items = computed(() => [
  { label: t("colorMode.system"), value: "system", icon: appConfig.ui.icons.system },
  { label: t("colorMode.light"), value: "light", icon: appConfig.ui.icons.light },
  { label: t("colorMode.dark"), value: "dark", icon: appConfig.ui.icons.dark }
]);
const preference = computed({
  get() {
    return items.value.find((option) => option.value === colorMode.preference) || items.value[0];
  },
  set(option) {
    colorMode.preference = option.value;
  }
});
</script>

<template>
  <ClientOnly v-if="!colorMode?.forced">
    <USelectMenu
      v-model="preference"
      :icon="preference?.icon"
      v-bind="{ ...selectMenuProps, ...$attrs }"
      :items="items"
    />

    <template #fallback>
      <USelectMenu
        :icon="items[0]?.icon"
        :model-value="items[0]"
        v-bind="{ ...selectMenuProps, ...$attrs }"
        :items="items"
        disabled
      />
    </template>
  </ClientOnly>
</template>
