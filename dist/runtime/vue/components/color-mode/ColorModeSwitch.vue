<script>

</script>

<script setup>
import { computed } from "vue";
import { useForwardProps } from "reka-ui";
import { useAppConfig, useColorMode } from "#imports";
import { useLocale } from "../../../composables/useLocale";
import USwitch from "../../../components/Switch.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  color: { type: null, required: false },
  size: { type: null, required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: null, required: false },
  label: { type: String, required: false },
  description: { type: String, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  disabled: { type: Boolean, required: false },
  id: { type: String, required: false },
  name: { type: String, required: false },
  required: { type: Boolean, required: false },
  value: { type: String, required: false },
  defaultValue: { type: null, required: false },
  trueValue: { type: null, required: false },
  falseValue: { type: null, required: false }
});
const { t } = useLocale();
const colorMode = useColorMode();
const appConfig = useAppConfig();
const switchProps = useForwardProps(props);
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
  <USwitch
    v-model="isDark"
    :checked-icon="appConfig.ui.icons.dark"
    :unchecked-icon="appConfig.ui.icons.light"
    v-bind="{
  ...switchProps,
  'aria-label': isDark ? t('colorMode.switchToLight') : t('colorMode.switchToDark'),
  ...$attrs
}"
  />
</template>
