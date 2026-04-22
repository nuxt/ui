<script>
import theme from "#build/ui/link";
</script>

<script setup>
import { computed } from "vue";
import { defu } from "defu";
import { isEqual } from "ohash/utils";
import { useForwardProps, Slot } from "reka-ui";
import { reactiveOmit } from "@vueuse/core";
import { hasProtocol } from "ufo";
import { useRoute, RouterLink } from "vue-router";
import { useAppConfig } from "#imports";
import { tv } from "../../../utils/tv";
import { mergeClasses } from "../../../utils";
import { isPartiallyEqual } from "../../../utils/link";
import ULinkBase from "../../../components/LinkBase.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false, default: "button" },
  href: { type: null, required: false },
  external: { type: Boolean, required: false },
  target: { type: [String, Object, null], required: false },
  rel: { type: [String, Object, null], required: false },
  noRel: { type: Boolean, required: false },
  type: { type: null, required: false, default: "button" },
  disabled: { type: Boolean, required: false },
  active: { type: Boolean, required: false, default: void 0 },
  exact: { type: Boolean, required: false },
  exactQuery: { type: [Boolean, String], required: false },
  exactHash: { type: Boolean, required: false },
  inactiveClass: { type: String, required: false },
  custom: { type: Boolean, required: false },
  raw: { type: Boolean, required: false },
  class: { type: null, required: false },
  activeClass: { type: String, required: false },
  exactActiveClass: { type: String, required: false },
  ariaCurrentValue: { type: String, required: false, default: "page" },
  viewTransition: { type: Boolean, required: false },
  to: { type: null, required: false },
  replace: { type: Boolean, required: false }
});
defineSlots();
const route = useRoute();
const appConfig = useAppConfig();
const routerLinkProps = useForwardProps(reactiveOmit(props, "as", "type", "disabled", "active", "exact", "exactQuery", "exactHash", "activeClass", "inactiveClass", "to", "href", "raw", "custom", "class", "noRel"));
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
const to = computed(() => props.to ?? props.href);
const isExternal = computed(() => {
  if (props.external) {
    return true;
  }
  if (!to.value) {
    return false;
  }
  return typeof to.value === "string" && hasProtocol(to.value, { acceptRelative: true });
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
function isLinkActive({ route: linkRoute, isActive, isExactActive }) {
  if (props.active !== void 0) {
    return props.active;
  }
  if (!to.value) {
    return false;
  }
  if (props.exactQuery === "partial") {
    if (!isPartiallyEqual(linkRoute.query, route.query)) return false;
  } else if (props.exactQuery === true) {
    if (!isEqual(linkRoute.query, route.query)) return false;
  }
  if (props.exactHash && linkRoute.hash !== route.hash) {
    return false;
  }
  if (props.exact && isExactActive) {
    return true;
  }
  if (!props.exact && isActive) {
    return true;
  }
  return false;
}
function resolveLinkClass({ route: route2, isActive, isExactActive } = {}) {
  const active = isLinkActive({ route: route2, isActive, isExactActive });
  if (props.raw) {
    return [props.class, active ? props.activeClass : props.inactiveClass];
  }
  return ui.value({ class: props.class, active, disabled: props.disabled });
}
</script>

<template>
  <RouterLink v-if="!isExternal && !!to" v-slot="{ href, navigate, route: linkRoute, isActive, isExactActive }" v-bind="routerLinkProps" :to="to" custom>
    <Slot v-if="custom">
      <slot
        v-bind="{
  ...$attrs,
  ...exact && isExactActive ? { 'aria-current': props.ariaCurrentValue } : {},
  as,
  type,
  disabled,
  href,
  navigate,
  rel,
  target,
  isExternal,
  active: isLinkActive({ route: linkRoute, isActive, isExactActive })
}"
      />
    </Slot>
    <ULinkBase
      v-else
      v-bind="{
  ...$attrs,
  ...exact && isExactActive ? { 'aria-current': props.ariaCurrentValue } : {},
  as,
  type,
  disabled,
  href,
  navigate,
  rel,
  target,
  isExternal
}"
      :class="resolveLinkClass({ route: linkRoute, isActive, isExactActive })"
    >
      <slot :active="isLinkActive({ route: linkRoute, isActive, isExactActive })" />
    </ULinkBase>
  </RouterLink>

  <Slot v-else-if="custom">
    <slot
      v-bind="{
  ...$attrs,
  as,
  type,
  disabled,
  href: to,
  rel,
  target,
  active: active ?? false,
  isExternal
}"
    />
  </Slot>
  <ULinkBase
    v-else
    v-bind="{
  ...$attrs,
  as,
  type,
  disabled,
  href: to,
  rel,
  target,
  isExternal
}"
    :class="resolveLinkClass()"
  >
    <slot :active="active ?? false" />
  </ULinkBase>
</template>
