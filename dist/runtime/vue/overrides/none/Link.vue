<script>
import theme from "#build/ui/link";
</script>

<script setup>
import { computed, inject } from "vue";
import { defu } from "defu";
import { Slot } from "reka-ui";
import { hasProtocol } from "ufo";
import { useAppConfig } from "#imports";
import { mergeClasses } from "../../../utils";
import { tv } from "../../../utils/tv";
import ULinkBase from "../../../components/LinkBase.vue";
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
  activeClass: { type: String, required: false },
  ariaCurrentValue: { type: String, required: false, default: "page" },
  custom: { type: Boolean, required: false },
  raw: { type: Boolean, required: false },
  class: { type: null, required: false },
  to: { type: String, required: false },
  href: { type: String, required: false },
  external: { type: Boolean, required: false },
  target: { type: [String, Object, null], required: false },
  rel: { type: [String, Object, null], required: false },
  noRel: { type: Boolean, required: false }
});
defineSlots();
const appConfig = useAppConfig();
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
  return hasProtocol(href.value, { acceptRelative: true });
});
const isLinkActive = computed(() => {
  if (props.active !== void 0) {
    return props.active;
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
const linkRel = computed(() => {
  if (props.noRel) {
    return null;
  }
  if (props.rel) {
    return props.rel;
  }
  if (isExternal.value) {
    return "noopener noreferrer";
  }
  return null;
});
const handleNavigation = inject("nuxtui:router", void 0);
const navigate = handleNavigation ? (e) => {
  handleNavigation(e, {
    href: href.value || "",
    external: isExternal.value,
    target: props.target || (isExternal.value ? "_blank" : void 0)
  });
} : void 0;
</script>

<template>
  <Slot v-if="custom">
    <slot
      v-bind="{
  ...$attrs,
  as,
  type,
  disabled,
  href,
  navigate,
  rel: linkRel,
  target: target || (isExternal ? '_blank' : void 0),
  isExternal,
  active: isLinkActive
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
  href,
  navigate,
  rel: linkRel,
  target: target || (isExternal ? '_blank' : void 0),
  isExternal
}"
    :class="linkClass"
  >
    <slot :active="isLinkActive" />
  </ULinkBase>
</template>
