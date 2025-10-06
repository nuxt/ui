<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { UIMessage, ChatStatus } from 'ai'
import theme from '#build/ui/chat-messages'
import type { ButtonProps, ChatMessageProps, IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type ChatMessages = ComponentConfig<typeof theme, AppConfig, 'chatMessages'>

export interface ChatMessagesProps {
  messages?: UIMessage[]
  status?: ChatStatus
  /**
   * Whether to automatically scroll to the bottom when a message is streaming.
   * @defaultValue false
   */
  shouldAutoScroll?: boolean
  /**
   * Whether to scroll to the bottom on mounted.
   * @defaultValue true
   */
  shouldScrollToBottom?: boolean
  /**
   * Display an auto scroll button.
   * `{ size: 'md', color: 'neutral', variant: 'outline' }`{lang="ts-type"}
   * @defaultValue true
   */
  autoScroll?: boolean | Partial<ButtonProps>
  /**
   * The icon displayed in the auto scroll button.
   * @defaultValue appConfig.ui.icons.arrowDown
   * @IconifyIcon
   */
  autoScrollIcon?: IconProps['name']
  /**
   * The `user` messages props.
   * `{ side: 'right', variant: 'soft' }`{lang="ts-type"}
   */
  user?: Pick<ChatMessageProps, 'icon' | 'avatar' | 'variant' | 'side' | 'actions'>
  /**
   * The `assistant` messages props.
   * `{ side: 'left', variant: 'naked' }`{lang="ts-type"}
   */
  assistant?: Pick<ChatMessageProps, 'icon' | 'avatar' | 'variant' | 'side' | 'actions'>
  /**
   * Render the messages in a compact style.
   * This is done automatically when used inside a `UChatPalette`{lang="ts-type"}.
   * @defaultValue false
   */
  compact?: boolean
  /**
   * The spacing offset for the last message in px. Can be useful when the prompt is sticky for example.
   * @defaultValue 0
   */
  spacingOffset?: number
  class?: any
  ui?: ChatMessages['slots']
}

export interface ChatMessagesSlots {
  default(props?: {}): any
  indicator(props?: {}): any
  viewport(props: { onClick: () => void }): any
  content(props: { message: UIMessage }): any
  leading(props: { message: UIMessage }): any
  actions(props: { message: UIMessage }): any
}
</script>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { ref, computed, watch, nextTick, toRef, onMounted } from 'vue'
import { Presence } from 'reka-ui'
import { defu } from 'defu'
import { useElementBounding, useEventListener, watchThrottled } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { omit } from '../utils'
import { tv } from '../utils/tv'
import UChatMessage from './ChatMessage.vue'
import UButton from './Button.vue'

const props = withDefaults(defineProps<ChatMessagesProps>(), {
  autoScroll: true,
  shouldAutoScroll: false,
  shouldScrollToBottom: true,
  spacingOffset: 0
})
const slots = defineSlots<ChatMessagesSlots>()

const getProxySlots = () => omit(slots, ['default', 'indicator', 'viewport'])

const appConfig = useAppConfig() as ChatMessages['AppConfig']

const userProps = toRef(() => defu(props.user, { side: 'right' as const, variant: 'soft' as const }))
const assistantProps = toRef(() => defu(props.assistant, { side: 'left' as const, variant: 'naked' as const }))

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.chatMessages || {}) })({
  compact: props.compact
}))

const el = ref<HTMLElement | null>(null)
const parent = ref<HTMLElement | null>(null)
const messagesRefs = ref(new Map<string, HTMLElement>())

const showAutoScroll = ref(false)
const lastMessageHeight = ref(0)
const lastMessageSubmitted = ref(false)

function registerMessageRef(id: string, element: ComponentPublicInstance | null) {
  const elInstance = element?.$el
  if (elInstance) {
    messagesRefs.value.set(id, elInstance)
  }
}

function scrollToMessage(id: string) {
  const element = messagesRefs.value.get(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function scrollToBottom(smooth: boolean = true) {
  if (!parent.value) {
    return
  }

  if (smooth) {
    parent.value.scrollTo({ top: parent.value.scrollHeight, behavior: 'smooth' })
  } else {
    parent.value.scrollTop = parent.value.scrollHeight
  }
}

watchThrottled([() => props.messages, () => props.status], ([_, status]) => {
  if (status !== 'streaming') {
    return
  }

  if (props.shouldAutoScroll) {
    // Scroll to bottom when message is streaming if `props.shouldAutoScroll` is true
    requestAnimationFrame(() => nextTick(scrollToBottom))
  } else {
    // Check scroll position when message is streaming to show the auto scroll button
    checkScrollPosition()
  }
}, { deep: true, throttle: 100, leading: true })

watch(() => props.status, (status) => {
  if (status !== 'submitted') {
    return
  }

  const lastMessage = props.messages?.[props.messages.length - 1]
  if (!lastMessage || lastMessage.role !== 'user') {
    return
  }

  nextTick(() => {
    lastMessageSubmitted.value = true

    updateLastMessageHeight()

    nextTick(() => {
      scrollToMessage(lastMessage.id)
    })
  })
})

function checkScrollPosition() {
  if (!parent.value) {
    return
  }

  const scrollPosition = parent.value.scrollTop + parent.value.clientHeight
  const scrollHeight = parent.value.scrollHeight
  const threshold = 100

  showAutoScroll.value = (scrollHeight - scrollPosition) >= threshold
}

function onAutoScrollClick() {
  scrollToBottom()
}

function getScrollParent(node: HTMLElement | null): HTMLElement {
  if (!node) {
    return document.documentElement
  }

  const overflowRegex = /auto|scroll/

  let current: HTMLElement | null = node
  while (current && current !== document.body && current !== document.documentElement) {
    const style = window.getComputedStyle(current)
    if (overflowRegex.test(style.overflowY)) {
      return current
    }

    current = current.parentElement
  }

  return document.documentElement
}

function updateLastMessageHeight() {
  if (!el.value || !parent.value || !props.messages?.length || !lastMessageSubmitted.value) {
    return
  }

  const { height: parentHeight } = useElementBounding(parent.value)

  const lastMessage = props.messages.findLast(m => m.role === 'user')
  if (!lastMessage) {
    return
  }

  const lastMessageEl = messagesRefs.value.get(lastMessage.id)
  if (!lastMessageEl) {
    return
  }

  let spacingOffset = props.spacingOffset || 0
  const elComputedStyle = window.getComputedStyle(el.value)
  const parentComputedStyle = window.getComputedStyle(parent.value)

  spacingOffset += Number.parseFloat(elComputedStyle.rowGap) || Number.parseFloat(elComputedStyle.gap) || 0
  spacingOffset += Number.parseFloat(parentComputedStyle.paddingTop) || 0
  spacingOffset += Number.parseFloat(parentComputedStyle.paddingBottom) || 0

  lastMessageHeight.value = Math.max(parentHeight.value - lastMessageEl.offsetHeight - spacingOffset, 0)
}

onMounted(() => {
  // Find first scrollable parent element
  parent.value = getScrollParent(el.value)
  if (!parent.value) {
    return
  }

  // Wait for content to fully render (especially MDC components in ChatPalette)
  setTimeout(() => {
    if (props.shouldScrollToBottom) {
      // Scroll to bottom on mount without smooth animation when `props.shouldScrollToBottom` is true
      scrollToBottom(false)
    } else {
      checkScrollPosition()
    }
  }, 100)

  // Add event listener to check scroll position to show the auto scroll button
  useEventListener(parent, 'scroll', checkScrollPosition)

  // Add event listener to update the last message height when the window is resized
  useEventListener(window, 'resize', () => nextTick(updateLastMessageHeight))
})
</script>

<template>
  <div
    ref="el"
    :data-status="status"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :style="{ '--last-message-height': `${lastMessageHeight}px` }"
  >
    <slot>
      <UChatMessage
        v-for="message in messages"
        :key="message.id"
        v-bind="{ ...message, ...(message.role === 'user' ? userProps : assistantProps) }"
        :ref="(el) => registerMessageRef(message.id, el as ComponentPublicInstance)"
        :compact="compact"
      >
        <template v-for="(_, name) in getProxySlots()" #[name]>
          <slot :name="name" v-bind="{ message }" />
        </template>
      </UChatMessage>
    </slot>

    <UChatMessage
      v-if="status === 'submitted'"
      id="indicator"
      role="assistant"
      v-bind="{ ...assistantProps, actions: undefined, parts: [] }"
      :compact="compact"
    >
      <template #content>
        <slot name="indicator">
          <div :class="ui.indicator({ class: props.ui?.indicator })">
            <span />
            <span />
            <span />
          </div>
        </slot>
      </template>
    </UChatMessage>

    <Presence :present="showAutoScroll">
      <div :data-state="showAutoScroll ? 'open' : 'closed'" :class="ui.viewport({ class: props.ui?.viewport })">
        <slot name="viewport" :on-click="onAutoScrollClick">
          <UButton
            v-if="autoScroll"
            :icon="autoScrollIcon || appConfig.ui.icons.arrowDown"
            color="neutral"
            variant="outline"
            v-bind="(typeof autoScroll === 'object' ? autoScroll as Partial<ButtonProps> : {})"
            :class="ui.autoScroll({ class: props.ui?.autoScroll })"
            @click="onAutoScrollClick"
          />
        </slot>
      </div>
    </Presence>
  </div>
</template>
