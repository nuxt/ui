<script>
import theme from "#build/ui/button";
</script>

<script setup>
import { computed, ref, inject } from "vue";
import { defu } from "defu";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useForwardProps } from "../composables/useForwardProps";
import { useComponentIcons } from "../composables/useComponentIcons";
import { useFieldGroup } from "../composables/useFieldGroup";
import { formLoadingInjectionKey } from "../composables/useFormField";
import { omit, mergeClasses } from "../utils";
import { tv } from "../utils/tv";
import { pickLinkProps } from "../utils/link";
import UIcon from "./Icon.vue";
import UAvatar from "./Avatar.vue";
import ULink from "./Link.vue";
import ULinkBase from "./LinkBase.vue";
const _props = defineProps({
  label: { type: String, required: false },
  color: { type: null, required: false },
  activeColor: { type: null, required: false },
  variant: { type: null, required: false },
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
  active: { type: Boolean, required: false },
  exact: { type: Boolean, required: false },
  exactQuery: { type: [Boolean, String], required: false },
  exactHash: { type: Boolean, required: false },
  inactiveClass: { type: String, required: false },
  locale: { type: [Boolean, String], required: false },
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
  ariaCurrentValue: { type: String, required: false },
  viewTransition: { type: Boolean, required: false },
  replace: { type: Boolean, required: false }
});
const slots = defineSlots();
const props = useComponentProps("button", _props);
const appConfig = useAppConfig();
const { orientation, size: buttonSize } = useFieldGroup(_props);
const linkProps = useForwardProps(pickLinkProps(props));
const loadingAutoState = ref(false);
const formLoading = inject(formLoadingInjectionKey, void 0);
async function onClickWrapper(event) {
  loadingAutoState.value = true;
  const callbacks = Array.isArray(props.onClick) ? props.onClick : [props.onClick];
  try {
    await Promise.all(callbacks.map((fn) => fn?.(event)));
  } finally {
    loadingAutoState.value = false;
  }
}
const isLoading = computed(() => {
  return props.loading || props.loadingAuto && (loadingAutoState.value || formLoading?.value && props.type === "submit");
});
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(
  computed(() => ({ ...props, loading: isLoading.value }))
);
const ui = computed(() => tv({
  extend: tv(theme),
  ...defu({
    variants: {
      active: {
        true: {
          base: mergeClasses(appConfig.ui?.button?.variants?.active?.true?.base, props.activeClass)
        },
        false: {
          base: mergeClasses(appConfig.ui?.button?.variants?.active?.false?.base, props.inactiveClass)
        }
      }
    }
  }, appConfig.ui?.button || {})
})({
  color: props.color,
  variant: props.variant,
  size: buttonSize.value ?? props.size,
  loading: isLoading.value,
  block: props.block,
  square: props.square || !slots.default && !props.label,
  leading: isLeading.value,
  trailing: isTrailing.value,
  fieldGroup: orientation.value
}));
</script>

<template>
  <ULink
    v-slot="{ active, ...slotProps }"
    :type="props.type"
    :disabled="props.disabled || isLoading"
    v-bind="omit(linkProps, ['type', 'disabled', 'onClick'])"
    custom
  >
    <ULinkBase
      v-bind="slotProps"
      data-slot="base"
      :class="ui.base({
  class: [props.ui?.base, props.class],
  active,
  ...active && props.activeVariant ? { variant: props.activeVariant } : {},
  ...active && props.activeColor ? { color: props.activeColor } : {}
})"
      @click="onClickWrapper"
    >
      <slot name="leading" :ui="ui">
        <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon, active })" />
        <UAvatar v-else-if="!!props.avatar" :size="props.ui?.leadingAvatarSize || ui.leadingAvatarSize()" v-bind="props.avatar" data-slot="leadingAvatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar, active })" />
      </slot>

      <slot :ui="ui">
        <span v-if="props.label !== void 0 && props.label !== null" data-slot="label" :class="ui.label({ class: props.ui?.label, active })">
          {{ props.label }}
        </span>
      </slot>

      <slot name="trailing" :ui="ui">
        <UIcon v-if="isTrailing && trailingIconName" :name="trailingIconName" data-slot="trailingIcon" :class="ui.trailingIcon({ class: props.ui?.trailingIcon, active })" />
      </slot>
    </ULinkBase>
  </ULink>
</template>
