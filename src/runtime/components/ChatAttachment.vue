<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/chat-attachment'
import type { IconProps } from './Icon.vue'
import type { ComponentConfig } from '../types/tv'

type ChatAttachment = ComponentConfig<typeof theme, AppConfig, 'chatAttachment'>

export interface ChatAttachmentProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The file to display, its `name`, `type` and size are read from it and images are previewed.
   */
  file?: File
  /**
   * The name of the file.
   */
  name?: string
  /**
   * The media type of the file, images are previewed.
   */
  type?: string
  /**
   * The URL of the file, used to preview images.
   */
  url?: string
  /**
   * The text displayed under the name. Defaults to the file extension and size.
   */
  description?: string
  /**
   * The upload status of the file.
   * @defaultValue 'idle'
   */
  status?: 'idle' | 'uploading' | 'error'
  /**
   * @defaultValue 'md'
   */
  size?: ChatAttachment['variants']['size']
  /**
   * The orientation of the attachment, `vertical` gives an image a large preview.
   * @defaultValue 'horizontal'
   */
  orientation?: ChatAttachment['variants']['orientation']
  /**
   * Display a button to remove the file.
   * @defaultValue false
   */
  removable?: boolean
  /**
   * The icon displayed for files that are not images, while their upload has not failed.
   * @defaultValue appConfig.ui.icons.file
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /**
   * The icon displayed while the file uploads.
   * @defaultValue appConfig.ui.icons.loading
   * @IconifyIcon
   */
  loadingIcon?: IconProps['name']
  /**
   * The icon displayed when the upload fails.
   * @defaultValue appConfig.ui.icons.error
   * @IconifyIcon
   */
  errorIcon?: IconProps['name']
  /**
   * The icon of the remove button.
   * @defaultValue appConfig.ui.icons.close
   * @IconifyIcon
   */
  removeIcon?: IconProps['name']
  class?: any
  ui?: ChatAttachment['slots']
}

export interface ChatAttachmentEmits {
  remove: [event: MouseEvent]
}
</script>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { Primitive, VisuallyHidden } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useLocale } from '../composables/useLocale'
import { formatFileSize } from '../utils/file'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UButton from './Button.vue'
import UChatShimmer from './ChatShimmer.vue'

const _props = withDefaults(defineProps<ChatAttachmentProps>(), {
  as: 'div',
  status: 'idle',
  orientation: 'horizontal'
})
const emits = defineEmits<ChatAttachmentEmits>()

const props = useComponentProps('chatAttachment', _props)

const { t } = useLocale()
const appConfig = useAppConfig() as ChatAttachment['AppConfig']

const fileName = computed(() => props.name ?? props.file?.name)
const fileType = computed(() => props.type || props.file?.type)

// A `File` has no URL, preview it through an object URL released when the file changes
const fileUrl = ref<string>()
watchEffect((onCleanup) => {
  if (props.url || !props.file || !fileType.value?.startsWith('image/')) {
    fileUrl.value = undefined
    return
  }

  const url = URL.createObjectURL(props.file)
  fileUrl.value = url
  onCleanup(() => URL.revokeObjectURL(url))
})

const previewUrl = computed(() => props.url ?? fileUrl.value)
const isImage = computed(() => !!previewUrl.value && !!fileType.value?.startsWith('image/'))

const fileDescription = computed(() => {
  if (props.description !== undefined) return props.description

  const extension = fileName.value?.includes('.') ? fileName.value.split('.').pop()?.toUpperCase() : undefined

  return [extension, formatFileSize(props.file?.size)].filter(Boolean).join(' · ')
})

const leadingIcon = computed(() => {
  if (props.status === 'uploading') return props.loadingIcon || appConfig.ui.icons.loading
  if (props.status === 'error') return props.errorIcon || appConfig.ui.icons.error

  return props.icon || appConfig.ui.icons.file
})

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.chatAttachment || {}) })({
  size: props.size,
  orientation: props.orientation,
  status: props.status
}))
</script>

<template>
  <Primitive
    :as="props.as"
    :data-status="props.status"
    :data-orientation="props.orientation"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <div data-slot="leading" :class="ui.leading({ class: props.ui?.leading })">
      <img v-if="isImage" :src="previewUrl" :alt="fileName ?? ''" data-slot="image" :class="ui.image({ class: props.ui?.image })">
      <UIcon v-else :name="leadingIcon" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
    </div>

    <div data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
      <UChatShimmer v-if="props.status === 'uploading' && fileName" :text="fileName" data-slot="name" :class="ui.name({ class: props.ui?.name })" />
      <span v-else data-slot="name" :class="ui.name({ class: props.ui?.name })">{{ fileName }}</span>

      <span v-if="fileDescription" data-slot="description" :class="ui.description({ class: props.ui?.description })">{{ fileDescription }}</span>
    </div>

    <VisuallyHidden aria-live="polite">
      {{ props.status === 'idle' ? '' : t(`chatAttachment.${props.status}`) }}
    </VisuallyHidden>

    <UButton
      v-if="props.removable"
      :icon="props.removeIcon || appConfig.ui.icons.close"
      color="neutral"
      variant="ghost"
      size="xs"
      :aria-label="t('fileUpload.removeFile', { filename: fileName ?? '' })"
      data-slot="remove"
      :class="ui.remove({ class: props.ui?.remove })"
      @click="emits('remove', $event)"
    />
  </Primitive>
</template>
