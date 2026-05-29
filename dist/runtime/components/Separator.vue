<script>
import theme from "#build/ui/separator";
</script>

<script setup>
import { computed } from "vue";
import { Separator } from "reka-ui";
import { reactivePick, createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useForwardProps } from "../composables/useForwardProps";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
import UAvatar from "./Avatar.vue";
const _props = defineProps({
  as: { type: null, required: false },
  label: { type: String, required: false },
  icon: { type: null, required: false },
  avatar: { type: Object, required: false },
  color: { type: null, required: false },
  size: { type: null, required: false },
  type: { type: null, required: false },
  orientation: { type: null, required: false, default: "horizontal" },
  position: { type: null, required: false, default: "center" },
  class: { type: null, required: false },
  ui: { type: null, required: false },
  decorative: { type: Boolean, required: false }
});
const slots = defineSlots();
const props = useComponentProps("separator", _props);
const appConfig = useAppConfig();
const rootProps = useForwardProps(reactivePick(props, "as", "decorative", "orientation"));
const [DefineContainer, ReuseContainer] = createReusableTemplate();
const hasContent = computed(() => !!(props.label || props.icon || props.avatar || slots.default));
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.separator || {} })({
  color: props.color,
  orientation: props.orientation,
  size: props.size,
  position: props.position,
  type: props.type
}));
</script>

<template>
  <DefineContainer>
    <div data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <slot :ui="ui">
        <span v-if="props.label" data-slot="label" :class="ui.label({ class: props.ui?.label })">{{ props.label }}</span>
        <UIcon v-else-if="props.icon" :name="props.icon" data-slot="icon" :class="ui.icon({ class: props.ui?.icon })" />
        <UAvatar v-else-if="props.avatar" :size="props.ui?.avatarSize || ui.avatarSize()" v-bind="props.avatar" data-slot="avatar" :class="ui.avatar({ class: props.ui?.avatar })" />
      </slot>
    </div>
  </DefineContainer>

  <Separator v-bind="rootProps" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <ReuseContainer v-if="hasContent && props.position === 'start'" />

    <div data-slot="border" :class="ui.border({ class: props.ui?.border })" />

    <template v-if="hasContent && props.position === 'center'">
      <ReuseContainer />

      <div data-slot="border" :class="ui.border({ class: props.ui?.border })" />
    </template>

    <ReuseContainer v-if="hasContent && props.position === 'end'" />
  </Separator>
</template>
