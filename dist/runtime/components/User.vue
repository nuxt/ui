<script>
import theme from "#build/ui/user";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { tv } from "../utils/tv";
import UChip from "./Chip.vue";
import UAvatar from "./Avatar.vue";
import ULink from "./Link.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  name: { type: String, required: false },
  description: { type: String, required: false },
  avatar: { type: Object, required: false },
  chip: { type: [Boolean, Object], required: false },
  size: { type: null, required: false },
  orientation: { type: null, required: false, default: "horizontal" },
  to: { type: null, required: false },
  target: { type: [String, Object, null], required: false },
  onClick: { type: Function, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("user", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.user || {} })({
  size: props.size,
  orientation: props.orientation,
  to: !!props.to || !!props.onClick
}));
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })" @click="onClick">
    <slot name="avatar" :ui="ui">
      <UChip v-if="chip && avatar" inset v-bind="typeof chip === 'object' ? chip : {}" :size="size">
        <UAvatar :alt="name" v-bind="avatar" :size="size" data-slot="avatar" :class="ui.avatar({ class: uiProp?.avatar })" />
      </UChip>
      <UAvatar
        v-else-if="avatar"
        :alt="name"
        v-bind="avatar"
        :size="size"
        data-slot="avatar"
        :class="ui.avatar({ class: uiProp?.avatar })"
      />
    </slot>

    <div data-slot="wrapper" :class="ui.wrapper({ class: uiProp?.wrapper })">
      <ULink
        v-if="to"
        :aria-label="name"
        v-bind="{ to, target, ...$attrs }"
        class="focus:outline-none peer"
        raw
      >
        <span class="absolute inset-0" aria-hidden="true" />
      </ULink>

      <slot>
        <p v-if="name || !!slots.name" data-slot="name" :class="ui.name({ class: uiProp?.name })">
          <slot name="name">
            {{ name }}
          </slot>
        </p>
        <p v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: uiProp?.description })">
          <slot name="description">
            {{ description }}
          </slot>
        </p>
      </slot>
    </div>
  </Primitive>
</template>
