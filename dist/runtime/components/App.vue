<script>
export default {
  name: "App"
};
</script>

<script setup>
import { toRef, useId, provide } from "vue";
import { ConfigProvider, TooltipProvider, useForwardProps } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { localeContextInjectionKey } from "../composables/useLocale";
import { portalTargetInjectionKey } from "../composables/usePortal";
import UToaster from "./Toaster.vue";
import UOverlayProvider from "./OverlayProvider.vue";
const props = defineProps({
  tooltip: { type: Object, required: false },
  toaster: { type: [Object, null], required: false },
  locale: { type: Object, required: false },
  portal: { type: [Boolean, String], required: false, skipCheck: true, default: "body" },
  dir: { type: String, required: false },
  scrollBody: { type: [Boolean, Object], required: false },
  nonce: { type: String, required: false }
});
defineSlots();
const configProviderProps = useForwardProps(reactivePick(props, "scrollBody"));
const tooltipProps = toRef(() => props.tooltip);
const toasterProps = toRef(() => props.toaster);
const locale = toRef(() => props.locale);
provide(localeContextInjectionKey, locale);
const portal = toRef(() => props.portal);
provide(portalTargetInjectionKey, portal);
</script>

<template>
  <ConfigProvider :use-id="() => useId()" :dir="props.dir || locale?.dir" :locale="locale?.code" v-bind="configProviderProps">
    <TooltipProvider v-bind="tooltipProps">
      <UToaster v-if="toaster !== null" v-bind="toasterProps">
        <slot />
      </UToaster>
      <slot v-else />

      <UOverlayProvider />
    </TooltipProvider>
  </ConfigProvider>
</template>
