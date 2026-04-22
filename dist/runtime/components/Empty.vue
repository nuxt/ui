<script>
import theme from "#build/ui/empty";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { tv } from "../utils/tv";
import UAvatar from "./Avatar.vue";
import UButton from "./Button.vue";
const props = defineProps({
  as: { type: null, required: false },
  icon: { type: null, required: false },
  avatar: { type: Object, required: false },
  title: { type: String, required: false },
  description: { type: String, required: false },
  actions: { type: Array, required: false },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("empty", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.empty || {} })({
  variant: props.variant,
  size: props.size
}));
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div v-if="!!slots.header || (icon || avatar || !!slots.leading) || (title || !!slots.title) || (description || !!slots.description)" data-slot="header" :class="ui.header({ class: uiProp?.header })">
      <slot name="header">
        <slot name="leading" :ui="ui">
          <UAvatar v-if="icon || avatar" :icon="icon" v-bind="typeof avatar === 'object' ? avatar : {}" data-slot="avatar" :class="ui.avatar({ class: uiProp?.avatar })" />
        </slot>

        <h2 v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: uiProp?.title })">
          <slot name="title">
            {{ title }}
          </slot>
        </h2>

        <div v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: uiProp?.description })">
          <slot name="description">
            {{ description }}
          </slot>
        </div>
      </slot>
    </div>

    <div v-if="!!slots.body || (actions?.length || !!slots.actions)" data-slot="body" :class="ui.body({ class: uiProp?.body })">
      <slot name="body">
        <div v-if="actions?.length || !!slots.actions" data-slot="actions" :class="ui.actions({ class: uiProp?.actions })">
          <slot name="actions">
            <UButton v-for="(action, index) in actions" :key="index" :size="size" v-bind="action" />
          </slot>
        </div>
      </slot>
    </div>

    <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: uiProp?.footer })">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
