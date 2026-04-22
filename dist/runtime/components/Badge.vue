<script>
import theme from "#build/ui/badge";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useFieldGroup } from "../composables/useFieldGroup";
import { useComponentIcons } from "../composables/useComponentIcons";
import { useComponentUI } from "../composables/useComponentUI";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
import UAvatar from "./Avatar.vue";
const props = defineProps({
  as: { type: null, required: false, default: "span" },
  label: { type: [String, Number], required: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  square: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  icon: { type: null, required: false },
  avatar: { type: Object, required: false },
  leading: { type: Boolean, required: false },
  leadingIcon: { type: null, required: false },
  trailing: { type: Boolean, required: false },
  trailingIcon: { type: null, required: false }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("badge", props);
const { orientation, size: fieldGroupSize } = useFieldGroup(props);
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.badge || {} })({
  color: props.color,
  variant: props.variant,
  size: fieldGroupSize.value || props.size,
  square: props.square || !slots.default && !props.label,
  fieldGroup: orientation.value
}));
</script>

<template>
  <Primitive :as="as" data-slot="base" :class="ui.base({ class: [uiProp?.base, props.class] })">
    <slot name="leading" :ui="ui">
      <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon" :class="ui.leadingIcon({ class: uiProp?.leadingIcon })" />
      <UAvatar v-else-if="!!avatar" :size="uiProp?.leadingAvatarSize || ui.leadingAvatarSize()" v-bind="avatar" data-slot="leadingAvatar" :class="ui.leadingAvatar({ class: uiProp?.leadingAvatar })" />
    </slot>

    <slot :ui="ui">
      <span v-if="label !== void 0 && label !== null" data-slot="label" :class="ui.label({ class: uiProp?.label })">
        {{ label }}
      </span>
    </slot>

    <slot name="trailing" :ui="ui">
      <UIcon v-if="isTrailing && trailingIconName" :name="trailingIconName" data-slot="trailingIcon" :class="ui.trailingIcon({ class: uiProp?.trailingIcon })" />
    </slot>
  </Primitive>
</template>
