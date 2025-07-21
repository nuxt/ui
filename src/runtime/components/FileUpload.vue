<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { UseFileDialogReturn } from '@vueuse/core'
import theme from '#build/ui/file-upload'
import type { ButtonProps } from '../types'
import type { ComponentConfig } from '../types/utils'

type FileUpload = ComponentConfig<typeof theme, AppConfig, 'fileUpload'>

export interface FileUploadProps<M extends boolean = false> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  id?: string
  name?: string
  /**
   * The icon to display.
   * @defaultValue appConfig.ui.icons.upload
   * @IconifyIcon
   */
  icon?: string
  label?: string
  description?: string
  actions?: ButtonProps[]
  /**
   * @defaultValue 'primary'
   */
  color?: FileUpload['variants']['color']
  /**
   * @defaultValue 'md'
   */
  size?: FileUpload['variants']['size']
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  required?: boolean
  disabled?: boolean
  multiple?: M & boolean
  /**
   * Specifies the allowed file types for the input. Provide a comma-separated list of MIME types or file extensions (e.g., "image/png,application/pdf,.jpg").
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept
   * @defaultValue '*'
   */
  accept?: string
  /**
   * Reset the file input when the dialog is opened.
   * @defaultValue false
   */
  reset?: boolean
  /**
   * Create a zone that allows the user to drop files onto it.
   * @defaultValue true
   */
  dropzone?: boolean
  /**
   * The icon to display for the file.
   * @defaultValue appConfig.ui.icons.file
   * @IconifyIcon
   */
  fileIcon?: string
  class?: any
  ui?: FileUpload['slots']
}

export interface FileUploadEmits<M extends boolean = false> {
  (e: 'update:modelValue', value: M extends true ? File[] : File | null): void
  (e: 'change', event: Event): void
}

export interface FileUploadSlots<M extends boolean = false> {
  'default'(props: {
    open: UseFileDialogReturn['open']
    remove: (index?: number) => void
  }): any
  'leading'(props?: {}): any
  'label'(props?: {}): any
  'description'(props?: {}): any
  'actions'(props?: {}): any
  'files'(props: { files: M extends true ? File[] : File | null }): any
  'files-top'(props: { remove: (index?: number) => void }): any
  'files-bottom'(props: { remove: (index?: number) => void }): any
  'file'(props: { file: File, index: number }): any
  'file-leading'(props: { file: File, index: number }): any
  'file-name'(props: { file: File, index: number }): any
  'file-size'(props: { file: File, index: number }): any
  'file-trailing'(props: { file: File, index: number }): any
}
</script>

<script setup lang="ts" generic="M extends boolean = false">
import { ref, computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useFormField } from '../composables/useFormField'
import { useFileUpload } from '../composables/useFileUpload'
import { tv } from '../utils/tv'
import UAvatar from './Avatar.vue'
import UButton from './Button.vue'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FileUploadProps<M>>(), {
  accept: '*',
  multiple: false as never,
  reset: false,
  dropzone: true
})
const emits = defineEmits<FileUploadEmits<M>>()
const slots = defineSlots<FileUploadSlots<M>>()

const modelValue = defineModel<(M extends true ? File[] : File) | null>()

const appConfig = useAppConfig() as FileUpload['AppConfig']

const inputRef = ref<HTMLInputElement>()
const dropzoneRef = ref<HTMLDivElement>()

const { isDragging, open } = useFileUpload({
  accept: props.accept,
  reset: props.reset,
  multiple: props.multiple,
  dropzone: props.dropzone,
  dropzoneRef,
  inputRef,
  onUpdate
})
const { emitFormInput, emitFormChange, id, name, disabled, ariaAttrs } = useFormField<FileUploadProps>(props, { deferInputValidation: true })

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.fileUpload || {}) })({
  dropzone: props.dropzone,
  color: props.color,
  size: props.size,
  highlight: props.highlight
}))

function createObjectUrl(file: File): string {
  return URL.createObjectURL(file)
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return '0B'
  }

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  const size = bytes / Math.pow(k, i)
  const formattedSize = i === 0 ? size.toString() : size.toFixed(2)

  return `${formattedSize}${sizes[i]}`
}

function onUpdate(files: File[], reset = false) {
  console.log('onUpdate', files)
  if (props.multiple) {
    if (reset) {
      modelValue.value = files as (M extends true ? File[] : File) | null
    } else {
      const existingFiles = (modelValue.value as File[]) || []
      modelValue.value = [...existingFiles, ...(files || [])] as (M extends true ? File[] : File) | null
    }
  } else {
    modelValue.value = files?.[0] as (M extends true ? File[] : File) | null
  }

  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value: modelValue.value } })
  emits('change', event)
  emitFormChange()
  emitFormInput()
}

function remove(index?: number) {
  if (!modelValue.value) {
    return
  }

  if (!props.multiple || !index) {
    onUpdate([], true)
    return
  }

  const files = Array.from(modelValue.value as File[])
  files.splice(index, 1)

  onUpdate(files, true)
}

defineExpose({
  inputRef
})
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot :open="open" :remove="remove">
      <div
        ref="dropzoneRef"
        role="button"
        :data-dragging="isDragging"
        :class="ui.base({ class: props.ui?.base })"
        tabindex="0"
        @click="open()"
      >
        <div :class="ui.wrapper({ class: props.ui?.wrapper })">
          <div :class="ui.leading({ class: props.ui?.leading })">
            <slot name="leading">
              <UIcon :name="icon || appConfig.ui.icons.upload" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
            </slot>
          </div>

          <div v-if="label || !!slots.label" :class="ui.label({ class: props.ui?.label })">
            <slot name="label">
              {{ label }}
            </slot>
          </div>
          <div v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
            <slot name="description">
              {{ description }}
            </slot>
          </div>

          <div v-if="actions?.length || !!slots.actions" :class="ui.actions({ class: props.ui?.actions })">
            <slot name="actions">
              <UButton v-for="(action, index) in actions" :key="index" size="xs" v-bind="action" />
            </slot>
          </div>
        </div>
      </div>

      <div v-if="modelValue" :class="ui.files({ class: props.ui?.files })">
        <slot name="files-top" :remove="remove" />

        <slot name="files" :files="modelValue">
          <div v-for="(file, index) in Array.isArray(modelValue) ? modelValue : [modelValue]" :key="(file as File).name" :class="ui.file({ class: props.ui?.file })">
            <slot name="file" :file="file" :index="index">
              <slot name="file-leading" :file="file" :index="index">
                <UAvatar :src="createObjectUrl(file)" :icon="fileIcon || appConfig.ui.icons.file" :size="props.size" :class="ui.fileLeadingAvatar({ class: props.ui?.fileLeadingAvatar })" />
              </slot>

              <div :class="ui.fileWrapper({ class: props.ui?.fileWrapper })">
                <span :class="ui.fileName({ class: props.ui?.fileName })">
                  <slot name="file-name" :file="file" :index="index">
                    {{ (file as File).name }}
                  </slot>
                </span>

                <span :class="ui.fileSize({ class: props.ui?.fileSize })">
                  <slot name="file-size" :file="file" :index="index">
                    {{ formatFileSize((file as File).size) }}
                  </slot>
                </span>
              </div>

              <slot name="file-trailing" :file="file" :index="index">
                <UButton
                  color="neutral"
                  variant="link"
                  :size="size"
                  :trailing-icon="appConfig.ui.icons.close"
                  :class="ui.fileTrailing({ class: props.ui?.fileTrailing })"
                  @click="remove(index)"
                />
              </slot>
            </slot>
          </div>
        </slot>

        <slot name="files-bottom" :remove="remove" />
      </div>
    </slot>

    <input
      :id="id"
      ref="inputRef"
      type="file"
      :name="name"
      :accept="accept"
      :multiple="(multiple as boolean)"
      :required="required"
      :disabled="disabled"
      v-bind="{ ...$attrs, ...ariaAttrs }"
      hidden
    >
  </Primitive>
</template>
