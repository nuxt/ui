<script lang="ts">
import type { ComponentPublicInstance, VNode } from 'vue'
import type { ChatStatus } from 'ai'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/chat-prompt'
import type { IconProps } from './Icon.vue'
import type { TextareaProps, TextareaSlots } from './Textarea.vue'
import type { ChatAttachmentProps } from './ChatAttachment.vue'
import type { ComponentConfig } from '../types/tv'

type ChatPrompt = ComponentConfig<typeof theme, AppConfig, 'chatPrompt'>

export interface ChatPromptQueueItem {
  text: string
  files?: File[]
  /**
   * Any other data the app keeps with the message, like the page it was asked on.
   */
  [key: string]: any
}

export interface ChatPromptProps extends Pick<TextareaProps, 'rows' | 'autofocus' | 'autofocusDelay' | 'autoresize' | 'autoresizeDelay' | 'maxrows' | 'icon' | 'avatar' | 'loading' | 'loadingIcon' | 'disabled'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'form'
   */
  as?: any
  /**
   * The placeholder text for the textarea.
   * @defaultValue t('chatPrompt.placeholder')
   */
  placeholder?: string
  /**
   * @defaultValue 'primary'
   */
  color?: ChatPrompt['variants']['color']
  /**
   * @defaultValue 'outline'
   */
  variant?: ChatPrompt['variants']['variant']
  /**
   * When `true`, pressing `Enter` submits and `Shift+Enter` inserts a newline.
   * When `false`, pressing `Enter` inserts a newline and `Ctrl+Enter` / `Cmd+Enter` submits.
   * @defaultValue true
   */
  submitOnEnter?: boolean
  /**
   * The status of the chat. Submitting while it is `submitted` or `streaming` is ignored, or queued with `v-model:queue`.
   */
  status?: ChatStatus
  error?: Error
  /**
   * The file types accepted when pasting or dropping files, used with `v-model:files`.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept
   * @defaultValue '*'
   */
  accept?: string
  /**
   * Allow more than one file, used with `v-model:files`.
   * @defaultValue true
   */
  multiple?: boolean
  /**
   * The props of the attachments displayed above the textarea, used with `v-model:files`.
   * `{ removable: true }`{lang="ts-type"}
   */
  attachment?: Pick<ChatAttachmentProps, 'variant' | 'size' | 'orientation' | 'removable' | 'icon' | 'removeIcon' | 'class' | 'ui'>
  /**
   * The icon displayed to collapse the queue, used with `v-model:queue`.
   * @defaultValue appConfig.ui.icons.chevronDown
   * @IconifyIcon
   */
  queueIcon?: IconProps['name']
  class?: any
  ui?: ChatPrompt['slots'] & TextareaProps['ui']
}

export interface ChatPromptEmits {
  submit: [event: Event]
  close: [event: Event]
  /**
   * Emitted when a queued message is picked to be sent now, after it moved to the front of `v-model:queue`.
   */
  send: [item: ChatPromptQueueItem]
}

export interface ChatPromptSlots extends TextareaSlots {
  header?(props?: {}): VNode[]
  /**
   * Replace the queued messages rendered above the textarea when using `v-model:queue`.
   */
  queue?(props: { queue: ChatPromptQueueItem[], send: (index: number) => void, edit: (index: number) => void, remove: (index: number) => void }): VNode[]
  /**
   * Replace the attachments rendered above the textarea when using `v-model:files`.
   */
  files?(props: { files: File[], remove: (index: number) => void }): VNode[]
  footer?(props: { open: () => void }): VNode[]
  /**
   * Replace the internal textarea, e.g. to render an [Editor](/docs/components/editor) with mentions.
   */
  body?(props: { submit: (event?: Event) => void, close: (event?: Event) => void, placeholder: string, disabled: boolean, ui: any }): VNode[]
}
</script>

<script setup lang="ts">
import { computed, ref, toRaw, toRef, useId, useTemplateRef } from 'vue'
import { Primitive } from 'reka-ui'
import { reactivePick, useElementSize } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useForwardProps } from '../composables/useForwardProps'
import { useFileUpload, isFileAccepted } from '../composables/useFileUpload'
import { useIMEGuard } from '../composables/useIMEGuard'
import { useLocale } from '../composables/useLocale'
import { omit, transformUI } from '../utils'
import { tv } from '../utils/tv'
import UTextarea from './Textarea.vue'
import UChatAttachment from './ChatAttachment.vue'
import UButton from './Button.vue'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<ChatPromptProps>(), {
  as: 'form',
  autofocus: true,
  autoresize: true,
  rows: 1,
  submitOnEnter: true,
  accept: '*',
  multiple: true
})
const emits = defineEmits<ChatPromptEmits>()
const slots = defineSlots<ChatPromptSlots>()

const props = useComponentProps('chatPrompt', _props)

const model = defineModel<string>({ default: '' })
const files = defineModel<File[]>('files')
const queue = defineModel<ChatPromptQueueItem[]>('queue')

const { t } = useLocale()
const appConfig = useAppConfig() as ChatPrompt['AppConfig']

const textareaProps = useForwardProps(reactivePick(props, 'rows', 'autofocus', 'autofocusDelay', 'autoresize', 'autoresizeDelay', 'maxrows', 'icon', 'avatar', 'loading', 'loadingIcon'))

const getProxySlots = () => omit(slots, ['header', 'footer', 'body', 'files', 'queue'])

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, appConfig.ui?.chatPrompt)({
  color: props.color,
  variant: props.variant
}))

const textareaRef = useTemplateRef('textareaRef')

// Attachments are only handled when the files are bound with `v-model:files`, and not while the prompt is disabled
const hasFiles = computed(() => files.value !== undefined)
const canAttach = computed(() => hasFiles.value && !props.disabled && !props.error)

function addFiles(newFiles: File[]) {
  if (!canAttach.value) {
    return
  }

  files.value = props.multiple ? [...(files.value ?? []), ...newFiles] : newFiles.slice(0, 1)
}

function removeFile(index: number) {
  files.value = files.value?.filter((_, i) => i !== index)
}

const { isDragging, open: openFileDialog, dropzoneRef } = useFileUpload({
  accept: toRef(() => props.accept),
  multiple: toRef(() => props.multiple),
  dropzone: canAttach,
  reset: true,
  onUpdate: addFiles
})

function open() {
  if (canAttach.value) {
    openFileDialog()
  }
}

// The root is the drop zone, `Primitive` hands back a component instance
function setRoot(el: Element | ComponentPublicInstance | null) {
  dropzoneRef.value = ((el as ComponentPublicInstance | null)?.$el ?? el) as HTMLDivElement | undefined
}

function onPaste(event: ClipboardEvent) {
  // Listened on the root so a custom `#body` like an editor gets it too, unless it handled the paste itself
  if (event.defaultPrevented || !canAttach.value || !event.clipboardData?.files.length) {
    return
  }

  const pasted = Array.from(event.clipboardData.files).filter(file => isFileAccepted(file, props.accept))
  if (!pasted.length) {
    return
  }

  // A paste that also holds text still inserts it, a file-only one is not inserted by an editor body
  if (!event.clipboardData.getData('text/plain')) {
    event.preventDefault()
  }

  addFiles(pasted)
}

const isBusy = computed(() => props.status === 'submitted' || props.status === 'streaming')

function submit(e?: Event) {
  if (model.value.trim() === '' && !files.value?.length) {
    return
  }

  if (isBusy.value) {
    // Without `v-model:queue` a submit during a response is ignored, the AI SDK would start a second one
    if (queue.value === undefined) {
      return
    }

    queue.value = [...queue.value, { text: model.value, ...(files.value?.length ? { files: [...files.value] } : {}) }]
    model.value = ''
    if (files.value) {
      files.value = []
    }
    return
  }

  emits('submit', e ?? new Event('submit'))
}

const queueOpen = ref(true)

// The queue floats above the prompt, its height is kept as a top margin so it covers nothing, a caller margin takes over
const queueRef = useTemplateRef<HTMLElement>('queueRef')
const { height: queueHeight } = useElementSize(queueRef, undefined, { box: 'border-box' })
const queueId = useId()

// Rows are keyed by item, the key also backs the label id the row actions are described by
const queueKeys = new WeakMap<ChatPromptQueueItem, string>()
let queueKeyCount = 0

function getQueueKey(item: ChatPromptQueueItem) {
  const raw = toRaw(item)
  let key = queueKeys.get(raw)
  if (!key) {
    key = `${queueId}-${queueKeyCount++}`
    queueKeys.set(raw, key)
  }
  return key
}

function takeQueued(index: number) {
  const item = queue.value?.[index]
  queue.value = queue.value?.filter((_, i) => i !== index)
  return item
}

// Sending and editing wait like the textarea while the prompt is disabled or the chat errored
const queueDisabled = computed(() => Boolean(props.error) || props.disabled)

// Without `v-model:files`, or past the `multiple` limit, a queued message with files can't go back to the prompt as a whole
function canEditQueued(item: ChatPromptQueueItem) {
  return !queueDisabled.value && (!item.files?.length || (files.value !== undefined && (props.multiple || item.files.length + files.value.length <= 1)))
}

// Moves a queued message to the front, the app stops the current response and sends it
function sendQueued(index: number) {
  if (queueDisabled.value) {
    return
  }

  // One update from a snapshot, a bound `v-model` only reflects the new queue after the parent renders
  const current = queue.value ?? []
  const item = current[index]
  if (!item) {
    return
  }

  queue.value = [item, ...current.filter((_, i) => i !== index)]
  emits('send', item)

  // Moving or removing the row drops the focus of its buttons
  textareaRef.value?.textareaRef?.focus()
}

// Puts a queued message back in the prompt, ahead of the current draft
function editQueued(index: number) {
  if (!queue.value?.[index] || !canEditQueued(queue.value[index])) {
    return
  }

  const item = takeQueued(index)
  if (!item) {
    return
  }

  model.value = [item.text, model.value].filter(Boolean).join('\n')
  if (item.files?.length && files.value) {
    files.value = [...item.files, ...files.value]
  }
  textareaRef.value?.textareaRef?.focus()
}

function removeQueued(index: number) {
  takeQueued(index)
  textareaRef.value?.textareaRef?.focus()
}

function blur(e?: Event) {
  textareaRef.value?.textareaRef?.blur()

  emits('close', e ?? new Event('close'))
}

const { onKeydown: onEnter, onCompositionEnd } = useIMEGuard((event) => {
  submit(event)
})

function handleEnter(event: KeyboardEvent) {
  if (props.submitOnEnter) {
    if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) return
  } else {
    if (!event.ctrlKey && !event.metaKey) return
  }

  onEnter(event)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleEnter(event)
  } else if (event.key === 'Escape') {
    blur(event)
  }
}

defineExpose({
  textareaRef: toRef(() => textareaRef.value?.textareaRef),
  open
})
</script>

<template>
  <Primitive
    :ref="setRoot"
    :as="props.as"
    :method="props.as === 'form' ? 'post' : undefined"
    :data-dragging="hasFiles ? isDragging : undefined"
    :data-slot="($attrs['data-slot'] as string | undefined) ?? 'root'"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :style="queueHeight ? { '--chat-prompt-queue-height': `${queueHeight}px` } : undefined"
    @submit.prevent="submit"
    @paste="onPaste"
  >
    <div v-if="!!slots.header" data-slot="header" :class="ui.header({ class: props.ui?.header })">
      <slot name="header" />
    </div>

    <div v-if="queue?.length" ref="queueRef" data-slot="queue" :class="ui.queue({ class: props.ui?.queue })">
      <slot name="queue" :queue="queue" :send="sendQueued" :edit="editQueued" :remove="removeQueued">
        <button
          type="button"
          :aria-expanded="queueOpen"
          :aria-controls="queueId"
          data-slot="queueTrigger"
          :class="ui.queueTrigger({ class: props.ui?.queueTrigger })"
          @click="queueOpen = !queueOpen"
        >
          <UIcon :name="props.queueIcon || appConfig.ui.icons.chevronDown" :data-state="queueOpen ? 'open' : 'closed'" data-slot="queueTriggerIcon" :class="ui.queueTriggerIcon({ class: props.ui?.queueTriggerIcon })" />
          <span>{{ t('chatPrompt.queue') }}</span>
          <span data-slot="queueCount" :class="ui.queueCount({ class: props.ui?.queueCount })">{{ queue.length }}</span>
        </button>

        <ul v-show="queueOpen" :id="queueId" data-slot="queueList" :class="ui.queueList({ class: props.ui?.queueList })">
          <li v-for="(item, index) in queue" :key="getQueueKey(item)" data-slot="queueItem" :class="ui.queueItem({ class: props.ui?.queueItem })">
            <span data-slot="queueItemLeading" :class="ui.queueItemLeading({ class: props.ui?.queueItemLeading })" />
            <span :id="getQueueKey(item)" data-slot="queueItemLabel" :class="ui.queueItemLabel({ class: props.ui?.queueItemLabel })">
              {{ item.text.trim() || item.files?.map(file => file.name).join(', ') }}
            </span>

            <div data-slot="queueItemActions" :class="ui.queueItemActions({ class: props.ui?.queueItemActions })">
              <UButton
                :icon="appConfig.ui.icons.arrowUp"
                color="neutral"
                variant="link"
                size="xs"
                :disabled="queueDisabled"
                :aria-label="t('chatPrompt.sendNow')"
                :aria-describedby="getQueueKey(item)"
                @click="sendQueued(index)"
              />
              <UButton
                :icon="appConfig.ui.icons.edit"
                color="neutral"
                variant="link"
                size="xs"
                :disabled="!canEditQueued(item)"
                :aria-label="t('chatPrompt.edit')"
                :aria-describedby="getQueueKey(item)"
                @click="editQueued(index)"
              />
              <UButton
                :icon="appConfig.ui.icons.trash"
                color="neutral"
                variant="link"
                size="xs"
                :aria-label="t('chatPrompt.remove')"
                :aria-describedby="getQueueKey(item)"
                @click="removeQueued(index)"
              />
            </div>
          </li>
        </ul>
      </slot>
    </div>

    <div v-if="files?.length" data-slot="files" :class="ui.files({ class: props.ui?.files })">
      <slot name="files" :files="files" :remove="removeFile">
        <UChatAttachment
          v-for="(file, index) in files"
          :key="`${file.name}-${file.lastModified}-${index}`"
          :file="file"
          removable
          v-bind="props.attachment"
          @remove="removeFile(index)"
        />
      </slot>
    </div>

    <slot
      name="body"
      :submit="submit"
      :close="blur"
      :placeholder="props.placeholder ?? t('chatPrompt.placeholder')"
      :disabled="Boolean(props.error) || props.disabled"
      :ui="ui"
    >
      <UTextarea
        ref="textareaRef"
        v-model="model"
        :placeholder="props.placeholder ?? t('chatPrompt.placeholder')"
        :disabled="Boolean(props.error) || props.disabled"
        variant="none"
        fixed
        v-bind="{ ...textareaProps, ...$attrs }"
        :ui="transformUI(omit(ui, ['root', 'body', 'header', 'footer', 'files', 'queue', 'queueTrigger', 'queueTriggerIcon', 'queueCount', 'queueList', 'queueItem', 'queueItemLeading', 'queueItemLabel', 'queueItemActions']), props.ui)"
        data-slot="body"
        :class="ui.body({ class: props.ui?.body })"
        @keydown="onKeydown"
        @compositionend="onCompositionEnd"
      >
        <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>
      </UTextarea>
    </slot>

    <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer" :open="open" />
    </div>
  </Primitive>
</template>
