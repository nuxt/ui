<script>
import theme from "#build/ui/link";
</script>

<script setup>
import { computed } from "vue";
import { isEqual } from "ohash/utils";
import { useForwardProps, Slot } from "reka-ui";
import { defu } from "defu";
import { hasProtocol } from "ufo";
import { reactiveOmit } from "@vueuse/core";
import { useRoute, useAppConfig, useNuxtApp } from "#imports";
import { mergeClasses } from "../utils";
import { tv } from "../utils/tv";
import { isPartiallyEqual } from "../utils/link";
import ULinkBase from "./LinkBase.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false, default: "button" },
  type: { type: null, required: false, default: "button" },
  disabled: { type: Boolean, required: false },
  active: { type: Boolean, required: false, default: void 0 },
  exact: { type: Boolean, required: false },
  exactQuery: { type: [Boolean, String], required: false },
  exactHash: { type: Boolean, required: false },
  inactiveClass: { type: String, required: false },
  custom: { type: Boolean, required: false },
  raw: { type: Boolean, required: false },
  locale: { type: [Boolean, String], required: false },
  class: { type: null, required: false },
  to: { type: null, required: false },
  href: { type: null, required: false },
  external: { type: Boolean, required: false },
  target: { type: [String, Object, null], required: false },
  rel: { type: [String, Object, null], required: false },
  noRel: { type: Boolean, required: false },
  prefetchedClass: { type: String, required: false },
  prefetch: { type: Boolean, required: false },
  prefetchOn: { type: [String, Object], required: false },
  noPrefetch: { type: Boolean, required: false },
  trailingSlash: { type: String, required: false },
  activeClass: { type: String, required: false },
  exactActiveClass: { type: String, required: false },
  ariaCurrentValue: { type: String, required: false, default: "page" },
  viewTransition: { type: Boolean, required: false },
  replace: { type: Boolean, required: false }
});
defineSlots();
const route = useRoute();
const appConfig = useAppConfig();
const nuxtApp = useNuxtApp();
const nuxtLinkProps = useForwardProps(reactiveOmit(props, "as", "type", "disabled", "active", "exact", "exactQuery", "exactHash", "activeClass", "inactiveClass", "to", "href", "raw", "custom", "locale", "class"));
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
const to = computed(() => {
  const path = props.to ?? props.href;
  if (!path) return path;
  if (typeof path !== "string") return path;
  if (props.external || hasProtocol(path, { acceptRelative: true })) {
    return path;
  }
  if (props.locale === false) {
    return path;
  }
  const localePath = nuxtApp.$localePath;
  if (!localePath) {
    return path;
  }
  const i18n = nuxtApp.$i18n;
  const codes = i18n?.localeCodes?.value;
  if (codes?.length && new RegExp(`^/(${codes.join("|")})($|[/?#])`).test(path)) {
    return path;
  }
  return localePath(path, typeof props.locale === "string" ? props.locale : void 0);
});
const isInternalLink = computed(() => {
  if (!to.value) return false;
  if (props.external) return false;
  if (typeof to.value !== "string") return true;
  if (hasProtocol(to.value, { acceptRelative: true })) return false;
  if (props.target && props.target !== "_self") return false;
  return true;
});
const externalRel = computed(() => {
  if (props.noRel) return null;
  if (props.rel) return props.rel;
  return "noopener noreferrer";
});
function isLinkActive({ route: linkRoute, isActive, isExactActive } = {}) {
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
  <NuxtLink v-if="isInternalLink" v-slot="{ href, navigate, route: linkRoute, isActive, isExactActive, ...rest }" v-bind="nuxtLinkProps" :to="to" custom>
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
  rel: rest.rel,
  target: rest.target,
  isExternal: rest.isExternal,
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
  rel: rest.rel,
  target: rest.target,
  isExternal: rest.isExternal
}"
      :class="resolveLinkClass({ route: linkRoute, isActive, isExactActive })"
    >
      <slot :active="isLinkActive({ route: linkRoute, isActive, isExactActive })" />
    </ULinkBase>
  </NuxtLink>

  <Slot v-else-if="custom">
    <slot
      v-bind="{
  ...$attrs,
  as,
  type,
  disabled,
  ...to ? { href: String(to), target: props.target, rel: externalRel, isExternal: true } : {},
  active: active ?? false
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
  ...to ? { href: String(to), target: props.target, rel: externalRel, isExternal: true } : {}
}"
    :class="resolveLinkClass()"
  >
    <slot :active="active ?? false" />
  </ULinkBase>
</template>
