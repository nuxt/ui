<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { UIDataTypes, UIMessage, UITools, FileUIPart, TextUIPart } from 'ai'
import theme from '#build/ui/chat-message'
import type { AvatarProps, ButtonProps, IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type ChatMessage = ComponentConfig<typeof theme, AppConfig, 'chatMessage'>

export interface ChatMessageProps<TMetadata = unknown, TDataParts extends UIDataTypes = UIDataTypes, TTools extends UITools = UITools> extends UIMessage<TMetadata, TDataParts, TTools> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'article'
   */
  as?: any
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  avatar?: AvatarProps & { [key: string]: any }
  /**
   * @defaultValue 'naked'
   */
  variant?: ChatMessage['variants']['variant']
  /**
   * @defaultValue 'left'
   */
  side?: ChatMessage['variants']['side']
  /**
   * Display a list of actions under the message.
   * The `label` will be used in a tooltip.
   * `{ size: 'xs', color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   */
  actions?: (Omit<ButtonProps, 'onClick'> & { onClick?: (e: MouseEvent, message: UIMessage<TMetadata, TDataParts, TTools>) => void })[]
  /**
   * Render the message in a compact style.
   * This is done automatically when used inside a `UChatPalette`{lang="ts-type"}.
   * @defaultValue false
   */
  compact?: boolean
  /**
   * @deprecated Use `parts` instead. (https://ai-sdk.dev/docs/migration-guides/migration-guide-5-0#content--parts-array)
   * Use to display the content of the message.
   */
  content?: string
  class?: any
  ui?: ChatMessage['slots']
}

export interface ChatMessageSlots<TMetadata = unknown, TDataParts extends UIDataTypes = UIDataTypes, TTools extends UITools = UITools> {
  leading?(props: UIMessage<TMetadata, TDataParts, TTools> & { avatar: ChatMessageProps<TMetadata, TDataParts, TTools>['avatar'], ui: ChatMessage['ui'] }): VNode[]
  files?(props: Omit<UIMessage<TMetadata, TDataParts, TTools>, 'parts'> & { parts: FileUIPart[] }): VNode[]
  content?(props: UIMessage<TMetadata, TDataParts, TTools> & { content?: string }): VNode[]
  actions?(props: UIMessage<TMetadata, TDataParts, TTools> & { actions: ChatMessageProps<TMetadata, TDataParts, TTools>['actions'] }): VNode[]
}
</script>

<script setup lang="ts" generic="TMetadata, TDataParts extends UIDataTypes, TTools extends UITools">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { omit } from '../utils'
import { tv } from '../utils/tv'
import UButton from './Button.vue'
import UTooltip from './Tooltip.vue'
import UAvatar from './Avatar.vue'
import UIcon from './Icon.vue'

const props = withDefaults(defineProps<ChatMessageProps<TMetadata, TDataParts, TTools>>(), {
  as: 'article'
})
const slots = defineSlots<ChatMessageSlots<TMetadata, TDataParts, TTools>>()

const appConfig = useAppConfig() as ChatMessage['AppConfig']
const uiProp = useComponentUI('chatMessage', props)

const fileParts = computed(() => props.parts?.filter((part): part is FileUIPart => part.type === 'file') ?? [])
const textParts = computed(() => props.parts?.filter((part): part is TextUIPart => part.type === 'text') ?? [])

const messageProps = computed(() => omit(props, ['as', 'icon', 'avatar', 'variant', 'side', 'actions', 'compact', 'class', 'ui', 'content']))

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.chatMessage || {}) })({
  variant: props.variant,
  side: props.side,
  leading: !!props.icon || !!props.avatar || !!slots.leading,
  actions: !!props.actions || !!slots.actions,
  compact: props.compact
}))
</script>

<template>
  <Primitive :as="as" :data-role="role" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div v-if="!!slots.files && fileParts.length" data-slot="files" :class="ui.files({ class: uiProp?.files })">
      <slot name="files" v-bind="{ ...messageProps, parts: fileParts }" />
    </div>

    <div data-slot="container" :class="ui.container({ class: uiProp?.container })">
      <div v-if="icon || avatar || !!slots.leading" data-slot="leading" :class="ui.leading({ class: uiProp?.leading })">
        <slot name="leading" v-bind="{ ...messageProps, avatar, ui }">
          <UIcon v-if="icon" :name="icon" data-slot="leadingIcon" :class="ui.leadingIcon({ class: uiProp?.leadingIcon })" />
          <UAvatar v-else-if="avatar" :size="((uiProp?.leadingAvatarSize || ui.leadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" data-slot="leadingAvatar" :class="ui.leadingAvatar({ class: uiProp?.leadingAvatar })" />
        </slot>
      </div>

      <div v-if="content || textParts.length || !!slots.content" data-slot="content" :class="ui.content({ class: uiProp?.content })">
        <slot name="content" v-bind="{ ...messageProps, content }">
          <template v-if="content">
            {{ content }}
          </template>
          <template v-else>
            <template v-for="(part, index) in textParts" :key="`${id}-${part.type}-${index}`">
              {{ part.text }}
            </template>
          </template>
        </slot>
      </div>

      <div v-if="actions || !!slots.actions" data-slot="actions" :class="ui.actions({ class: uiProp?.actions })">
        <slot name="actions" v-bind="{ ...messageProps, actions }">
          <UTooltip v-for="(action, index) in actions" :key="index" :text="action.label">
            <UButton
              size="sm"
              color="neutral"
              variant="ghost"
              v-bind="omit(action, ['onClick'])"
              :label="undefined"
              @click="typeof action.onClick === 'function' ? action.onClick($event, messageProps) : undefined"
            />
          </UTooltip>
        </slot>
      </div>
    </div>
  </Primitive>
</template>
