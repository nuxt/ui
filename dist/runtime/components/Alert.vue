<script>
import theme from "#build/ui/alert";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useLocale } from "../composables/useLocale";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
import UAvatar from "./Avatar.vue";
import UButton from "./Button.vue";
const props = defineProps({
  as: { type: null, required: false },
  title: { type: String, required: false },
  description: { type: String, required: false },
  icon: { type: null, required: false },
  avatar: { type: Object, required: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  orientation: { type: null, required: false, default: "vertical" },
  actions: { type: Array, required: false },
  close: { type: [Boolean, Object], required: false },
  closeIcon: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const emits = defineEmits(["update:open"]);
const slots = defineSlots();
const { t } = useLocale();
const appConfig = useAppConfig();
const uiProp = useComponentUI("alert", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.alert || {} })({
  color: props.color,
  variant: props.variant,
  orientation: props.orientation,
  title: !!props.title || !!slots.title
}));
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <slot name="leading" :ui="ui">
      <UAvatar v-if="avatar" :size="uiProp?.avatarSize || ui.avatarSize()" v-bind="avatar" data-slot="avatar" :class="ui.avatar({ class: uiProp?.avatar })" />
      <UIcon v-else-if="icon" :name="icon" data-slot="icon" :class="ui.icon({ class: uiProp?.icon })" />
    </slot>

    <div data-slot="wrapper" :class="ui.wrapper({ class: uiProp?.wrapper })">
      <div v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: uiProp?.title })">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: uiProp?.description })">
        <slot name="description">
          {{ description }}
        </slot>
      </div>

      <div v-if="orientation === 'vertical' && (actions?.length || !!slots.actions)" data-slot="actions" :class="ui.actions({ class: uiProp?.actions })">
        <slot name="actions">
          <UButton v-for="(action, index) in actions" :key="index" size="xs" v-bind="action" />
        </slot>
      </div>
    </div>

    <div v-if="orientation === 'horizontal' && (actions?.length || !!slots.actions) || close" data-slot="actions" :class="ui.actions({ class: uiProp?.actions, orientation: 'horizontal' })">
      <template v-if="orientation === 'horizontal' && (actions?.length || !!slots.actions)">
        <slot name="actions">
          <UButton v-for="(action, index) in actions" :key="index" size="xs" v-bind="action" />
        </slot>
      </template>

      <slot name="close" :ui="ui">
        <UButton
          v-if="close"
          :icon="closeIcon || appConfig.ui.icons.close"
          color="neutral"
          variant="link"
          :aria-label="t('alert.close')"
          v-bind="typeof close === 'object' ? close : {}"
          data-slot="close"
          :class="ui.close({ class: uiProp?.close })"
          @click="emits('update:open', false)"
        />
      </slot>
    </div>
  </Primitive>
</template>
