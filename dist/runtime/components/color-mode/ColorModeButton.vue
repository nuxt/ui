<script>

</script>

<script setup>
import { computed } from "vue";
import { useForwardProps } from "reka-ui";
import { reactiveOmit } from "@vueuse/core";
import { useColorMode, useAppConfig } from "#imports";
import { useComponentUI } from "../../composables/useComponentUI";
import { useLocale } from "../../composables/useLocale";
import UButton from "../Button.vue";
import UIcon from "../Icon.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  color: { type: null, required: false, default: "neutral" },
  variant: { type: null, required: false, default: "ghost" },
  label: { type: String, required: false },
  activeColor: { type: null, required: false },
  activeVariant: { type: null, required: false },
  size: { type: null, required: false },
  square: { type: Boolean, required: false },
  block: { type: Boolean, required: false },
  loadingAuto: { type: Boolean, required: false },
  onClick: { type: [Function, Array], required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  icon: { type: null, required: false },
  avatar: { type: Object, required: false },
  leading: { type: Boolean, required: false },
  leadingIcon: { type: null, required: false },
  trailing: { type: Boolean, required: false },
  trailingIcon: { type: null, required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: null, required: false },
  as: { type: null, required: false },
  type: { type: null, required: false },
  disabled: { type: Boolean, required: false },
  exactActiveClass: { type: String, required: false },
  viewTransition: { type: Boolean, required: false }
});
const { t } = useLocale();
const colorMode = useColorMode();
const appConfig = useAppConfig();
const uiProp = useComponentUI("button", props);
const buttonProps = useForwardProps(reactiveOmit(props, "icon"));
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  }
});
</script>

<template>
  <UButton
    v-bind="{
  ...buttonProps,
  'aria-label': isDark ? t('colorMode.switchToLight') : t('colorMode.switchToDark'),
  ...$attrs
}"
    @click="isDark = !isDark"
  >
    <template #leading="{ ui }">
      <UIcon :class="ui.leadingIcon({ class: [uiProp?.leadingIcon, 'hidden dark:inline-block'] })" :name="appConfig.ui.icons.dark" />
      <UIcon :class="ui.leadingIcon({ class: [uiProp?.leadingIcon, 'dark:hidden'] })" :name="appConfig.ui.icons.light" />
    </template>
  </UButton>
</template>
