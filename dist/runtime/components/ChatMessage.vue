<script>
import theme from "#build/ui/chat-message";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { omit } from "../utils";
import { tv } from "../utils/tv";
import UButton from "./Button.vue";
import UTooltip from "./Tooltip.vue";
import UAvatar from "./Avatar.vue";
import UIcon from "./Icon.vue";
const props = defineProps({
  as: { type: null, required: false, default: "article" },
  icon: { type: null, required: false },
  avatar: { type: Object, required: false },
  variant: { type: null, required: false },
  side: { type: null, required: false },
  actions: { type: Array, required: false },
  compact: { type: Boolean, required: false },
  content: { type: String, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  id: { type: String, required: true },
  role: { type: String, required: true },
  metadata: { type: null, required: false },
  parts: { type: Array, required: true }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("chatMessage", props);
const fileParts = computed(() => props.parts?.filter((part) => part.type === "file") ?? []);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.chatMessage || {} })({
  variant: props.variant,
  side: props.side,
  leading: !!props.icon || !!props.avatar || !!slots.leading,
  actions: !!props.actions || !!slots.actions,
  compact: props.compact
}));
</script>

<template>
  <Primitive :as="as" :data-role="role" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div v-if="!!slots.files && fileParts.length" data-slot="files" :class="ui.files({ class: uiProp?.files })">
      <slot name="files" :parts="fileParts" />
    </div>

    <div data-slot="container" :class="ui.container({ class: uiProp?.container })">
      <div v-if="icon || avatar || !!slots.leading" data-slot="leading" :class="ui.leading({ class: uiProp?.leading })">
        <slot name="leading" :avatar="avatar" :ui="ui">
          <UIcon v-if="icon" :name="icon" data-slot="leadingIcon" :class="ui.leadingIcon({ class: uiProp?.leadingIcon })" />
          <UAvatar v-else-if="avatar" :size="uiProp?.leadingAvatarSize || ui.leadingAvatarSize()" v-bind="avatar" data-slot="leadingAvatar" :class="ui.leadingAvatar({ class: uiProp?.leadingAvatar })" />
        </slot>
      </div>

      <div v-if="content || parts.length || !!slots.content" data-slot="content" :class="ui.content({ class: uiProp?.content })">
        <slot
          :id="id"
          name="content"
          :role="role"
          :content="content"
          :parts="parts"
        >
          <template v-if="content">
            {{ content }}
          </template>
          <template v-else>
            <template v-for="(part, index) in parts" :key="`${id}-${part.type}-${index}`">
              <template v-if="part.type === 'text'">
                {{ part.text }}
              </template>
            </template>
          </template>
        </slot>
      </div>

      <div v-if="actions || !!slots.actions" data-slot="actions" :class="ui.actions({ class: uiProp?.actions })">
        <slot name="actions" :actions="actions">
          <UTooltip v-for="(action, index) in actions" :key="index" :text="action.label">
            <UButton
              size="sm"
              color="neutral"
              variant="ghost"
              v-bind="omit(action, ['onClick'])"
              :label="undefined"
              @click="typeof action.onClick === 'function' ? action.onClick($event, props) : void 0"
            />
          </UTooltip>
        </slot>
      </div>
    </div>
  </Primitive>
</template>
