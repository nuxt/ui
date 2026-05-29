<script>
import theme from "#build/ui/chat-message";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { omit } from "../utils";
import { tv } from "../utils/tv";
import UButton from "./Button.vue";
import UTooltip from "./Tooltip.vue";
import UAvatar from "./Avatar.vue";
import UIcon from "./Icon.vue";
const _props = defineProps({
  as: { type: null, required: false, default: "article" },
  icon: { type: null, required: false },
  avatar: { type: Object, required: false },
  variant: { type: null, required: false },
  color: { type: null, required: false },
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
const props = useComponentProps("chatMessage", _props);
const appConfig = useAppConfig();
const fileParts = computed(() => props.parts?.filter((part) => part.type === "file") ?? []);
const textParts = computed(() => props.parts?.filter((part) => part.type === "text") ?? []);
const messageProps = computed(() => omit(props, ["as", "icon", "avatar", "variant", "color", "side", "actions", "compact", "class", "ui", "content"]));
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.chatMessage || {} })({
  variant: props.variant,
  color: props.color,
  side: props.side,
  leading: !!props.icon || !!props.avatar || !!slots.leading,
  actions: !!props.actions || !!slots.actions,
  compact: props.compact
}));
</script>

<template>
  <Primitive :as="props.as" :data-role="props.role" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="!!slots.files && fileParts.length || !!slots.header" data-slot="header" :class="ui.header({ class: props.ui?.header })">
      <slot name="header" v-bind="{ ...messageProps }">
        <div v-if="!!slots.files && fileParts.length" data-slot="files" :class="ui.files({ class: props.ui?.files })">
          <slot name="files" v-bind="{ ...messageProps, parts: fileParts }" />
        </div>
      </slot>
    </div>

    <div data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <div v-if="props.icon || props.avatar || !!slots.leading" data-slot="leading" :class="ui.leading({ class: props.ui?.leading })">
        <slot name="leading" v-bind="{ ...messageProps, avatar: props.avatar, ui }">
          <UIcon v-if="props.icon" :name="props.icon" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
          <UAvatar v-else-if="props.avatar" :size="props.ui?.leadingAvatarSize || ui.leadingAvatarSize()" v-bind="props.avatar" data-slot="leadingAvatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })" />
        </slot>
      </div>

      <div v-if="props.content || textParts.length || !!slots.content || props.actions || !!slots.actions || !!slots.body" data-slot="body" :class="ui.body({ class: props.ui?.body })">
        <slot name="body" v-bind="{ ...messageProps }">
          <div v-if="props.content || textParts.length || !!slots.content" data-slot="content" :class="ui.content({ class: props.ui?.content })">
            <slot name="content" v-bind="{ ...messageProps, content: props.content }">
              <template v-if="props.content">
                {{ props.content }}
              </template>
              <template v-else>
                <template v-for="(part, index) in textParts" :key="`${props.id}-${part.type}-${index}`">
                  {{ part.text }}
                </template>
              </template>
            </slot>
          </div>

          <div v-if="props.actions || !!slots.actions" data-slot="actions" :class="ui.actions({ class: props.ui?.actions })">
            <slot name="actions" v-bind="{ ...messageProps, actions: props.actions }">
              <UTooltip v-for="(action, index) in props.actions" :key="index" :text="action.label">
                <UButton
                  size="sm"
                  color="neutral"
                  variant="ghost"
                  v-bind="omit(action, ['onClick'])"
                  :label="undefined"
                  @click="typeof action.onClick === 'function' ? action.onClick($event, messageProps) : void 0"
                />
              </UTooltip>
            </slot>
          </div>
        </slot>
      </div>
    </div>
  </Primitive>
</template>
