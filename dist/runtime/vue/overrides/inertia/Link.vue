<script>
import theme from "#build/ui/link";
</script>

<script setup>
import { computed } from "vue";
import { defu } from "defu";
import { useForwardProps, Slot } from "reka-ui";
import { reactiveOmit } from "@vueuse/core";
import { usePage } from "@inertiajs/vue3";
import { hasProtocol } from "ufo";
import { useAppConfig } from "#imports";
import { tv } from "../../../utils/tv";
import { mergeClasses } from "../../../utils";
import ULinkBase from "./LinkBase.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false, default: "button" },
  activeClass: { type: String, required: false },
  to: { type: String, required: false },
  href: { type: String, required: false },
  external: { type: Boolean, required: false },
  target: { type: [String, Object, null], required: false },
  rel: { type: [String, Object, null], required: false },
  noRel: { type: Boolean, required: false },
  ariaCurrentValue: { type: String, required: false, default: "page" },
  type: { type: null, required: false, default: "button" },
  disabled: { type: Boolean, required: false },
  active: { type: Boolean, required: false, default: void 0 },
  exact: { type: Boolean, required: false },
  inactiveClass: { type: String, required: false },
  custom: { type: Boolean, required: false },
  raw: { type: Boolean, required: false },
  class: { type: null, required: false },
  data: { type: null, required: false },
  method: { type: String, required: false },
  replace: { type: Boolean, required: false },
  preserveScroll: { type: [Boolean, String, Function], required: false },
  preserveState: { type: [Boolean, String, Function], required: false },
  preserveUrl: { type: Boolean, required: false },
  only: { type: Array, required: false },
  except: { type: Array, required: false },
  headers: { type: Object, required: false },
  queryStringArrayFormat: { type: String, required: false },
  async: { type: Boolean, required: false },
  viewTransition: { type: [Boolean, Function], required: false },
  onCancelToken: { type: Function, required: false },
  onBefore: { type: Function, required: false },
  onBeforeUpdate: { type: Function, required: false },
  onStart: { type: Function, required: false },
  onProgress: { type: Function, required: false },
  onFinish: { type: Function, required: false },
  onCancel: { type: Function, required: false },
  onSuccess: { type: Function, required: false },
  onError: { type: Function, required: false },
  onFlash: { type: Function, required: false },
  onPrefetched: { type: Function, required: false },
  onPrefetching: { type: Function, required: false },
  prefetch: { type: [Boolean, String, Array], required: false },
  cacheFor: { type: null, required: false },
  cacheTags: { type: [String, Array], required: false }
});
defineSlots();
const page = usePage();
const appConfig = useAppConfig();
const routerLinkProps = useForwardProps(reactiveOmit(props, "as", "type", "disabled", "active", "exact", "activeClass", "inactiveClass", "to", "href", "raw", "custom", "class", "noRel"));
const ui = computed(() => tv({
  extend: tv(theme),
  ...defu({
    variants: {
      active: {
        true: mergeClasses(appConfig.ui?.link?.variants?.active?.true, props.activeClass),
        false: mergeClasses(appConfig.ui?.link?.variants?.active?.false, props.inactiveClass)
      }
    }
  }, appConfig.ui?.link || {})
}));
const href = computed(() => props.to ?? props.href);
const isExternal = computed(() => {
  if (props.target === "_blank") {
    return true;
  }
  if (props.external) {
    return true;
  }
  if (!href.value) {
    return false;
  }
  return typeof href.value === "string" && hasProtocol(href.value, { acceptRelative: true });
});
const hasTarget = computed(() => !!props.target && props.target !== "_self");
const rel = computed(() => {
  if (props.noRel) {
    return null;
  }
  if (props.rel !== void 0) {
    return props.rel || null;
  }
  if (isExternal.value || hasTarget.value) {
    return "noopener noreferrer";
  }
  return null;
});
const isLinkActive = computed(() => {
  if (props.active !== void 0) {
    return props.active;
  }
  if (!href.value) {
    return false;
  }
  if (props.exact && page.url === href.value) {
    return true;
  }
  if (!props.exact && page.url.startsWith(href.value)) {
    return true;
  }
  return false;
});
const linkClass = computed(() => {
  const active = isLinkActive.value;
  if (props.raw) {
    return [props.class, active ? props.activeClass : props.inactiveClass];
  }
  return ui.value({ class: props.class, active, disabled: props.disabled });
});
</script>

<template>
  <Slot v-if="custom">
    <slot
      v-bind="{
  ...$attrs,
  ...routerLinkProps,
  as,
  type,
  disabled,
  href,
  rel,
  target,
  active: isLinkActive,
  isExternal
}"
    />
  </Slot>
  <ULinkBase
    v-else
    v-bind="{
  ...$attrs,
  ...routerLinkProps,
  as,
  type,
  disabled,
  href,
  rel,
  target,
  isExternal
}"
    :class="linkClass"
  >
    <slot :active="isLinkActive" />
  </ULinkBase>
</template>
