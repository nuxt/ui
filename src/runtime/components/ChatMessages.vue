<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { ComponentPublicInstance, VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { UIDataTypes, UIMessage, UITools, ChatStatus } from 'ai'
import theme from '#build/ui/chat-messages'
import type { ButtonProps } from './Button.vue'
import type { ChatMessageProps, ChatMessageSlots } from './ChatMessage.vue'
import type { IconProps } from './Icon.vue'
import type { LinkPropsKeys } from './Link.vue'
import type { ComponentConfig } from '../types/tv'

type ChatMessages = ComponentConfig<typeof theme, AppConfig, 'chatMessages'>

type MessageBase<T extends UIMessage[]>
  = T[number] extends UIMessage<infer M, infer D, infer U>
    ? UIMessage<M, D, U>
    : UIMessage<unknown, UIDataTypes, UITools>

type PropsBase<T extends UIMessage[]>
  = MessageBase<T> extends UIMessage<infer M, infer D, infer U>
    ? ChatMessageProps<M, D, U>
    : never

type SlotsBase<T extends UIMessage[]>
  = MessageBase<T> extends UIMessage<infer M, infer D, infer U>
    ? ChatMessageSlots<M, D, U>
    : never

export interface ChatMessagesProps<T extends UIMessage[] = UIMessage[]> {
  messages?: T
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
  autoScroll?: boolean | Omit<ButtonProps, LinkPropsKeys>
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
  user?: Pick<PropsBase<T>, 'icon' | 'avatar' | 'variant' | 'side' | 'actions' | 'ui' | 'color'>
  /**
   * The `assistant` messages props.
   * `{ side: 'left', variant: 'naked' }`{lang="ts-type"}
   */
  assistant?: Pick<PropsBase<T>, 'icon' | 'avatar' | 'variant' | 'side' | 'actions' | 'ui' | 'color'>
  /**
   * Render the messages in a compact style.
   * This is done automatically when used inside a `UChatPalette`{lang="ts-type"}.
   * @defaultValue false
   */
  compact?: boolean
  /**
   * The spacing offset for the last message in px. Can be useful when the prompt is sticky for example.
   * @deprecated Use the `footer` slot to render a sticky prompt, its height is measured automatically.
   * @defaultValue 0
   */
  spacingOffset?: number
  class?: any
  ui?: ChatMessages['slots']
}

export type ChatMessagesSlots<T extends UIMessage[] = UIMessage[]> = {
  default?(props: { registerMessageRef: (id: string, element: ComponentPublicInstance | null) => void }): VNode[]
  indicator?(props: { ui: ChatMessages['ui'] }): VNode[]
  viewport?(props: { ui: ChatMessages['ui'], onClick: () => void }): VNode[]
  /**
   * Render a sticky element at the bottom of the list, like a prompt. Its height is measured to keep room for the last message and the auto scroll button above it.
   */
  footer?(props?: {}): VNode[]
} & {
  [K in keyof ChatMessageSlots]?: NonNullable<SlotsBase<T>[K]> extends (props: infer P) => VNode[]
    ? (props: P & { message: MessageBase<T>, streaming: boolean }) => VNode[]
    : never
}

</script>

<script setup lang="ts" generic="T extends UIMessage[] = UIMessage[]">
import { ref, computed, watch, nextTick, toRef, readonly, onMounted, onBeforeUnmount } from 'vue'
import { Presence } from 'reka-ui'
import { defu } from 'defu'
import { useElementSize, useEventListener, useMutationObserver, watchThrottled } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useLocale } from '../composables/useLocale'
import { omit } from '../utils'
import { tv } from '../utils/tv'
import UChatMessage from './ChatMessage.vue'
import UButton from './Button.vue'

const _props = withDefaults(defineProps<ChatMessagesProps<T>>(), {
  autoScroll: true,
  shouldAutoScroll: false,
  shouldScrollToBottom: true,
  spacingOffset: 0
})
const slots = defineSlots<ChatMessagesSlots<T>>()

const props = useComponentProps<ChatMessagesProps<T>>('chatMessages', _props)

const getProxySlots = () => omit(slots, ['default', 'indicator', 'viewport', 'footer'])

// This is intentionally a function (not a `computed`) so it is re-evaluated on
// every render. `@ai-sdk/vue` stores messages in a `shallowRef` and grows them
// via in-place mutation + `triggerRef`, so the array reference and the message
// objects never change identity. A `computed` would cache its result on the
// first `streaming` render (when the assistant message is still empty) and never
// recompute as parts stream in, leaving the indicator stuck. Evaluating during
// render ties the indicator to the same re-render that displays the streamed content.
function showIndicator() {
  if (props.status === 'submitted') return true
  if (props.status !== 'streaming') return false

  const lastMessage = props.messages?.[props.messages.length - 1]
  return lastMessage?.role === 'assistant' && !lastMessage.parts?.length
}

// Only the last message streams, and nothing does once the chat is stopped
function isMessageStreaming(message: UIMessage) {
  if (props.status !== 'submitted' && props.status !== 'streaming') return false

  return message.id === props.messages?.[props.messages.length - 1]?.id
}

const { t } = useLocale()
const appConfig = useAppConfig() as ChatMessages['AppConfig']

const userProps = toRef(() => defu(props.user, { side: 'right' as const, variant: 'soft' as const }))
const assistantProps = toRef(() => defu(props.assistant, { side: 'left' as const, variant: 'naked' as const }))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.chatMessages || {}) })({
  compact: props.compact,
  footer: !!slots.footer
}))

const el = ref<HTMLElement | null>(null)
const parent = ref<HTMLElement | null>(null)
const messagesRefs = ref(new Map<string, HTMLElement>())

const showAutoScroll = ref(false)
const isAtBottom = ref(true)
const lastMessageHeight = ref(0)
const footerRef = ref<HTMLElement | null>(null)
const { height: footerHeight } = useElementSize(footerRef, undefined, { box: 'border-box' })
const bottomOffset = computed(() => (props.spacingOffset || 0) + footerHeight.value)
const lastMessageSubmitted = ref(false)
const lastScrollTop = ref(0)
const userScrolledUp = ref(false)

function registerMessageRef(id: string, element: ComponentPublicInstance | null) {
  const elInstance = element?.$el
  if (elInstance) {
    messagesRefs.value.set(id, elInstance)
  } else if (!element) {
    messagesRefs.value.delete(id)
  }
}

function scrollToMessage(id: string, smooth: boolean = true) {
  const element = messagesRefs.value.get(id)
  if (!element || !parent.value) {
    return
  }

  // Scroll the parent only, `scrollIntoView` would also scroll outer containers and move the page
  const isDocument = parent.value === document.documentElement
  const parentTop = isDocument ? 0 : parent.value.getBoundingClientRect().top + parent.value.clientTop
  const scrollMarginTop = Number.parseFloat(window.getComputedStyle(element).scrollMarginTop) || 0
  const scrollPaddingTop = Number.parseFloat(window.getComputedStyle(parent.value).scrollPaddingTop) || 0
  const top = parent.value.scrollTop + element.getBoundingClientRect().top - parentTop - scrollMarginTop - scrollPaddingTop

  parent.value.scrollTo({ top, behavior: smooth ? 'smooth' : 'instant' })
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

watchThrottled([() => props.messages, () => props.status], () => {
  if (!props.messages?.length) {
    showAutoScroll.value = false
    isAtBottom.value = true
    userScrolledUp.value = false
    lastScrollTop.value = 0
    messagesRefs.value.clear()
    return
  }

  // Measure once the new content is rendered, so `isAtBottom` and the scroll button stay in sync
  nextTick(checkScrollPosition)
}, { deep: true, throttle: 50, leading: true })

watch(() => props.status, (status) => {
  if (status !== 'submitted') {
    return
  }

  const lastMessage = props.messages?.[props.messages.length - 1]
  if (!lastMessage || lastMessage.role !== 'user') {
    return
  }

  userScrolledUp.value = false

  nextTick(() => {
    lastMessageSubmitted.value = true

    // Measure on the next frame: the prompt shrinks once cleared and the previous answer can render again
    // when it stops streaming, both move the layout the room and the scroll are measured against
    requestAnimationFrame(() => {
      const id = updateLastMessageHeight()
      if (!id) {
        return
      }

      nextTick(() => {
        scrollToMessage(id)
      })
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
  isAtBottom.value = (scrollHeight - scrollPosition) <= 1

  // Only resume following at the very bottom, otherwise streaming pulls the user back down
  if (isAtBottom.value) {
    userScrolledUp.value = false
  } else if (parent.value.scrollTop < lastScrollTop.value) {
    userScrolledUp.value = true
  }

  lastScrollTop.value = parent.value.scrollTop
}

function onAutoScrollClick() {
  userScrolledUp.value = false
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

// Returns the id of the message the room was measured for, the one to scroll to after a submit
function updateLastMessageHeight() {
  if (!el.value || !parent.value || !props.messages?.length || !lastMessageSubmitted.value) {
    return
  }

  const parentHeight = parent.value.getBoundingClientRect().height

  const lastMessage = props.messages.findLast(m => m.role === 'user')
  if (!lastMessage) {
    return
  }

  const lastMessageEl = messagesRefs.value.get(lastMessage.id)
  if (!lastMessageEl) {
    return
  }

  // Read the footer live, the prompt usually shrinks in the same render as the submit and the observed size lags a frame
  let spacingOffset = (props.spacingOffset || 0) + (footerRef.value?.offsetHeight ?? 0)
  const elComputedStyle = window.getComputedStyle(el.value)
  const parentComputedStyle = window.getComputedStyle(parent.value)

  // One gap after the last message, two when the footer follows it in the flow
  spacingOffset += (Number.parseFloat(elComputedStyle.rowGap) || Number.parseFloat(elComputedStyle.gap) || 0) * (slots.footer ? 2 : 1)
  spacingOffset += Number.parseFloat(parentComputedStyle.paddingTop) || 0
  spacingOffset += Number.parseFloat(parentComputedStyle.paddingBottom) || 0
  // `scrollToMessage` stops below the container's scroll padding (e.g. a floating header)
  spacingOffset += Number.parseFloat(parentComputedStyle.scrollPaddingTop) || 0

  lastMessageHeight.value = Math.max(parentHeight - lastMessageEl.offsetHeight - spacingOffset, 0)

  return lastMessage.id
}

// Keep the room for the last message in sync when the footer grows (multiline prompt, attachments)
watch(footerHeight, () => nextTick(updateLastMessageHeight))

onMounted(() => {
  // Find first scrollable parent element
  parent.value = getScrollParent(el.value)
  if (!parent.value) {
    return
  }

  lastScrollTop.value = parent.value.scrollTop

  if (props.shouldScrollToBottom) {
    // Scroll to bottom immediately to avoid flash, then again after a delay to account for async content
    scrollToBottom(false)
    setTimeout(() => {
      scrollToBottom(false)
    }, 100)
  } else {
    nextTick(() => {
      checkScrollPosition()
    })
  }

  // Add event listener to check scroll position to show the auto scroll button
  useEventListener(parent, 'scroll', checkScrollPosition)

  // Add event listener to update the last message height when the window is resized
  useEventListener(window, 'resize', () => nextTick(updateLastMessageHeight))

  // Watch for DOM changes (e.g. async code block rendering) and scroll to bottom
  if (el.value) {
    let frame: number | undefined

    useMutationObserver(el, () => {
      if (props.shouldAutoScroll && props.status === 'streaming' && !userScrolledUp.value) {
        scrollToBottom(false)
      }

      // Measure at most once per frame, streaming mutates the DOM many times per frame
      if (frame === undefined) {
        frame = requestAnimationFrame(() => {
          frame = undefined
          checkScrollPosition()
        })
      }
    }, { childList: true, subtree: true })

    onBeforeUnmount(() => {
      if (frame !== undefined) {
        cancelAnimationFrame(frame)
      }
    })
  }
})

defineExpose({
  registerMessageRef,
  scrollToBottom,
  scrollToMessage,
  isAtBottom: readonly(isAtBottom)
})
</script>

<template>
  <div
    ref="el"
    role="log"
    :aria-busy="props.status === 'submitted' || props.status === 'streaming' ? 'true' : undefined"
    :data-status="props.status"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :style="{ '--last-message-height': `${lastMessageHeight}px`, '--bottom-offset': slots.footer ? `${bottomOffset}px` : undefined }"
  >
    <slot :register-message-ref="registerMessageRef">
      <template v-for="message in props.messages" :key="message.id">
        <UChatMessage
          v-if="message.parts?.length"
          v-bind="{ ...(message.role === 'user' ? userProps : assistantProps), ...message }"
          :ref="el => registerMessageRef(message.id, el as ComponentPublicInstance)"
          :compact="props.compact"
        >
          <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
            <slot :name="name" v-bind="{ ...(slotData as any), message, streaming: isMessageStreaming(message) }" />
          </template>
        </UChatMessage>
      </template>
    </slot>

    <UChatMessage
      v-if="showIndicator()"
      id="indicator"
      role="assistant"
      v-bind="{ ...assistantProps, actions: undefined, parts: [] }"
      :compact="props.compact"
    >
      <template #content>
        <slot name="indicator" :ui="ui">
          <div data-slot="indicator" :class="ui.indicator({ class: props.ui?.indicator })">
            <span />
            <span />
            <span />
          </div>
        </slot>
      </template>
    </UChatMessage>

    <Presence :present="showAutoScroll">
      <div :data-state="showAutoScroll ? 'open' : 'closed'" data-slot="viewport" :class="ui.viewport({ class: props.ui?.viewport })">
        <slot name="viewport" :ui="ui" :on-click="onAutoScrollClick">
          <UButton
            v-if="props.autoScroll"
            :icon="props.autoScrollIcon || appConfig.ui.icons.arrowDown"
            color="neutral"
            variant="outline"
            :aria-label="t('chatMessages.autoScroll')"
            v-bind="(typeof props.autoScroll === 'object' ? props.autoScroll : {})"
            data-slot="autoScroll"
            :class="ui.autoScroll({ class: props.ui?.autoScroll })"
            @click="onAutoScrollClick"
          />
        </slot>
      </div>
    </Presence>

    <div v-if="!!slots.footer" ref="footerRef" aria-live="off" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer" />
    </div>
  </div>
</template>
