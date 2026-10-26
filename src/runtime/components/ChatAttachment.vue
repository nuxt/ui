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
   * The file to display, its `name`, `type` and a preview `url` are read from it.
   */
  file?: File
  /**
   * The name of the file.
   */
  name?: string
  /**
   * The media type of the file, images are displayed as a thumbnail.
   */
  type?: string
  /**
   * The URL of the file, used to preview images.
   */
  url?: string
  /**
   * The upload status of the file.
   * @defaultValue 'idle'
   */
  status?: 'idle' | 'uploading' | 'error'
  /**
   * Display a button to remove the file.
   * @defaultValue false
   */
  removable?: boolean
  /**
   * The icon displayed for files that are not images.
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
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'

const _props = withDefaults(defineProps<ChatAttachmentProps>(), {
  as: 'div',
  status: 'idle'
})
const emits = defineEmits<ChatAttachmentEmits>()

const props = useComponentProps('chatAttachment', _props)

const { t } = useLocale()
const appConfig = useAppConfig() as ChatAttachment['AppConfig']

const fileName = computed(() => props.name ?? props.file?.name)
const fileType = computed(() => props.type ?? props.file?.type)

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

const statusIcon = computed(() => {
  if (props.status === 'uploading') return props.loadingIcon || appConfig.ui.icons.loading
  if (props.status === 'error') return props.errorIcon || appConfig.ui.icons.error

  return undefined
})

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.chatAttachment || {}) })({
  image: isImage.value,
  status: props.status
}))
</script>

<template>
  <Primitive :as="props.as" :data-status="props.status" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <template v-if="isImage">
      <img :src="previewUrl" :alt="fileName" data-slot="image" :class="ui.image({ class: props.ui?.image })">

      <div v-if="statusIcon" data-slot="overlay" :class="ui.overlay({ class: props.ui?.overlay })">
        <UIcon :name="statusIcon" data-slot="icon" :class="ui.icon({ class: props.ui?.icon })" />
      </div>
    </template>

    <template v-else>
      <UIcon :name="statusIcon || props.icon || appConfig.ui.icons.file" data-slot="icon" :class="ui.icon({ class: props.ui?.icon })" />

      <span data-slot="name" :class="ui.name({ class: props.ui?.name })">{{ fileName }}</span>
    </template>

    <button
      v-if="props.removable"
      type="button"
      :aria-label="t('fileUpload.removeFile', { filename: fileName ?? '' })"
      data-slot="remove"
      :class="ui.remove({ class: props.ui?.remove })"
      @click="emits('remove', $event)"
    >
      <UIcon :name="props.removeIcon || appConfig.ui.icons.close" data-slot="removeIcon" :class="ui.removeIcon({ class: props.ui?.removeIcon })" />
    </button>
  </Primitive>
</template>
