<script>

</script>

<script setup>
import { useForwardProps } from "reka-ui";
import { reactiveOmit } from "@vueuse/core";
import USelectMenu from "../SelectMenu.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  locales: { type: Array, required: false },
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
  valueKey: { type: String, required: false, default: "code" },
  labelKey: { type: null, required: false, default: "name" },
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
  icon: { type: null, required: false },
  avatar: { type: Object, required: false },
  leading: { type: Boolean, required: false },
  leadingIcon: { type: null, required: false },
  trailing: { type: Boolean, required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: null, required: false }
});
const selectMenuProps = useForwardProps(reactiveOmit(props, "locales"));
const modelValue = defineModel({ type: String, ...{ required: true } });
function getEmojiFlag(locale) {
  const languageToCountry = {
    ar: "sa",
    // Arabic -> Saudi Arabia
    bn: "bd",
    // Bengali -> Bangladesh
    ca: "es",
    // Catalan -> Spain
    ckb: "iq",
    // Central Kurdish -> Iraq
    cs: "cz",
    // Czech -> Czech Republic (note: modern country code is actually 'cz')
    da: "dk",
    // Danish -> Denmark
    el: "gr",
    // Greek -> Greece
    en: "us",
    // English -> United States (default)
    et: "ee",
    // Estonian -> Estonia
    gl: "es",
    // Galician -> Spain
    he: "il",
    // Hebrew -> Israel
    hi: "in",
    // Hindi -> India
    hy: "am",
    // Armenian -> Armenia
    ja: "jp",
    // Japanese -> Japan
    ka: "ge",
    // Georgian -> Georgia
    kk: "kz",
    // Kazakh -> Kazakhstan
    km: "kh",
    // Khmer -> Cambodia
    ko: "kr",
    // Korean -> South Korea
    ky: "kg",
    // Kyrgyz -> Kyrgyzstan
    lb: "lu",
    // Luxembourgish -> Luxembourg
    ms: "my",
    // Malay -> Malaysia
    nb: "no",
    // Norwegian Bokmål -> Norway
    sl: "si",
    // Slovenian -> Slovenia
    sq: "al",
    // Albanian -> Albania
    sv: "se",
    // Swedish -> Sweden
    uk: "ua",
    // Ukrainian -> Ukraine
    ur: "pk",
    // Urdu -> Pakistan
    vi: "vn"
    // Vietnamese -> Vietnam
  };
  if (locale.includes("-")) {
    const countryCode2 = locale.split("-")[1]?.toLowerCase();
    if (countryCode2) {
      return countryCode2.toUpperCase().split("").map((char) => String.fromCodePoint(127397 + char.charCodeAt(0))).join("");
    }
  }
  const baseLanguage = locale.split("-")[0]?.toLowerCase() || locale;
  const countryCode = languageToCountry[baseLanguage] || locale.slice(0, 2);
  return countryCode.toUpperCase().split("").map((char) => String.fromCodePoint(127397 + char.charCodeAt(0))).join("");
}
</script>

<template>
  <USelectMenu
    v-model="modelValue"
    v-bind="{ ...selectMenuProps, ...$attrs }"
    :items="locales"
  >
    <template #leading>
      <span v-if="modelValue" class="size-5 text-center">
        {{ getEmojiFlag(modelValue) }}
      </span>
    </template>

    <template #item-leading="{ item }">
      <span class="size-5 text-center">
        {{ getEmojiFlag(item.code) }}
      </span>
    </template>
  </USelectMenu>
</template>
