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
  /**
   * @defaultValue 'primary'
   */
  color?: FileUpload['variants']['color']
  /**
   * The `button` variant is only available when `multiple` is `false`.
   * @defaultValue 'area'
   */
  variant?: FileUpload['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: FileUpload['variants']['size']
  /**
   * The layout of how files are displayed.
   * Only works when `variant` is `area`.
   * @defaultValue 'list'
   */
  layout?: FileUpload['variants']['layout']
  /**
   * The position of the files.
   * Only works when `variant` is `area` and when `layout` is `list`.
   * @defaultValue 'outside'
   */
  position?: FileUpload['variants']['position']
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  /**
   * Specifies the allowed file types for the input. Provide a comma-separated list of MIME types or file extensions (e.g., "image/png,application/pdf,.jpg").
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept
   * @defaultValue '*'
   */
  accept?: string
  multiple?: M & boolean
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
   * Make the dropzone interactive when the user is clicking on it.
   * @defaultValue true
   */
  interactive?: boolean
  required?: boolean
  disabled?: boolean
  /**
   * The icon to display for the file.
   * @defaultValue appConfig.ui.icons.file
   * @IconifyIcon
   */
  fileIcon?: string
  /**
   * Configure the delete button for the file.
   * When `layout` is `grid`, the default is `{ color: 'neutral', variant: 'solid', size: 'xs' }`{lang="ts-type"}
   * When `layout` is `list`, the default is `{ color: 'neutral', variant: 'link' }`{lang="ts-type"}
   */
  fileDelete?: boolean | Partial<ButtonProps>
  /**
   * The icon displayed to delete a file.
   * @defaultValue appConfig.ui.icons.close
   * @IconifyIcon
   */
  fileDeleteIcon?: string
  class?: any
  ui?: FileUpload['slots']
}

export interface FileUploadEmits<M extends boolean = false> {
  'update:modelValue': [payload: M extends true ? File[] : File | null]
  'change': [event: Event]
}

type FileUploadFiles<M> = (M extends true ? File[] : File) | null

export interface FileUploadSlots<M extends boolean = false> {
  'default'(props: {
    open: UseFileDialogReturn['open']
    removeFile: (index?: number) => void
  }): any
  'leading'(props?: {}): any
  'label'(props?: {}): any
  'description'(props?: {}): any
  'actions'(props: { files?: FileUploadFiles<M>, open: UseFileDialogReturn['open'], removeFile: (index?: number) => void }): any
  'files'(props: { files?: FileUploadFiles<M> }): any
  'files-top'(props: { files?: FileUploadFiles<M>, open: UseFileDialogReturn['open'], removeFile: (index?: number) => void }): any
  'files-bottom'(props: { files?: FileUploadFiles<M>, open: UseFileDialogReturn['open'], removeFile: (index?: number) => void }): any
  'file'(props: { file: File, index: number }): any
  'file-leading'(props: { file: File, index: number }): any
  'file-name'(props: { file: File, index: number }): any
  'file-size'(props: { file: File, index: number }): any
  'file-trailing'(props: { file: File, index: number }): any
}
</script>

<script setup lang="ts" generic="M extends boolean = false">
import { computed, watch } from 'vue'
import { Primitive } from 'reka-ui'
import { createReusableTemplate } from '@vueuse/core'
import { useAppConfig, useLocale } from '#imports'
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
  dropzone: true,
  interactive: true,
  layout: 'grid',
  position: 'outside'
})
const emits = defineEmits<FileUploadEmits<M>>()
const slots = defineSlots<FileUploadSlots<M>>()

const modelValue = defineModel<(M extends true ? File[] : File) | null>()

const appConfig = useAppConfig() as FileUpload['AppConfig']

const { t } = useLocale()

const [DefineFilesTemplate, ReuseFilesTemplate] = createReusableTemplate()

const { isDragging, open, inputRef, dropzoneRef } = useFileUpload({
  accept: props.accept,
  reset: props.reset,
  multiple: props.multiple,
  dropzone: props.dropzone,
  onUpdate
})
const { emitFormInput, emitFormChange, id, name, disabled, ariaAttrs } = useFormField<FileUploadProps>(props)

const variant = computed(() => props.multiple ? 'area' : props.variant)
const layout = computed(() => props.variant === 'button' && !props.multiple ? 'grid' : props.layout)
const position = computed(() => {
  if (layout.value === 'grid' && props.multiple) {
    return 'inside'
  }
  if (variant.value === 'button') {
    return 'outside'
  }

  return props.position
})

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.fileUpload || {}) })({
  dropzone: props.dropzone,
  interactive: props.interactive,
  color: props.color,
  size: props.size,
  variant: variant.value,
  layout: layout.value,
  position: position.value,
  multiple: props.multiple,
  highlight: props.highlight,
  disabled: props.disabled
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
  const formattedSize = i === 0 ? size.toString() : size.toFixed(0)

  return `${formattedSize}${sizes[i]}`
}

function onUpdate(files: File[], reset = false) {
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

function removeFile(index?: number) {
  if (!modelValue.value) {
    return
  }

  if (!props.multiple || index === undefined) {
    onUpdate([], true)

    dropzoneRef.value?.focus()
    return
  }

  const files = [...modelValue.value as File[]]
  files.splice(index, 1)

  onUpdate(files, true)

  dropzoneRef.value?.focus()
}

watch(modelValue, (newValue) => {
  const hasModelReset = !Array.isArray(newValue) || !newValue.length

  if (hasModelReset && inputRef.value) {
    inputRef.value.value = ''
  }
})

defineExpose({
  inputRef,
  dropzoneRef
})
</script>

<template>
  <DefineFilesTemplate>
    <template v-if="modelValue && (Array.isArray(modelValue) ? modelValue.length : true)">
      <slot name="files-top" :files="modelValue" :open="open" :remove-file="removeFile" />

      <div :class="ui.files({ class: props.ui?.files })">
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
                  v-bind="{
                    ...(layout === 'grid' ? {
                      variant: 'solid',
                      size: 'xs'
                    } : {
                      variant: 'link',
                      size
                    }),
                    ...typeof fileDelete === 'object' ? fileDelete : undefined
                  }"
                  :aria-label="t('fileUpload.removeFile', { filename: (file as File).name })"
                  :trailing-icon="fileDeleteIcon || appConfig.ui.icons.close"
                  :class="ui.fileTrailingButton({ class: props.ui?.fileTrailingButton })"
                  @click.stop.prevent="removeFile(index)"
                />
              </slot>
            </slot>
          </div>
        </slot>
      </div>

      <slot name="files-bottom" :files="modelValue" :open="open" :remove-file="removeFile" />
    </template>
  </DefineFilesTemplate>

  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot :open="open" :remove-file="removeFile">
      <component
        :is="variant === 'button' ? 'button' : 'div'"
        ref="dropzoneRef"
        :role="variant === 'button' ? undefined : 'button'"
        :data-dragging="isDragging"
        :class="ui.base({ class: props.ui?.base })"
        :tabindex="interactive && !disabled ? 0 : -1"
        @click="interactive && !disabled && open()"
        @keyup.enter.space="interactive && !disabled && open()"
      >
        <ReuseFilesTemplate v-if="position === 'inside'" />

        <div v-if="position === 'inside' ? (multiple ? !(modelValue as File[])?.length : !modelValue) : true" :class="ui.wrapper({ class: props.ui?.wrapper })">
          <slot name="leading">
            <UIcon v-if="variant === 'button'" :name="icon || appConfig.ui.icons.upload" :class="ui.icon({ class: props.ui?.icon })" />
            <UAvatar v-else :icon="icon || appConfig.ui.icons.upload" :size="props.size" :class="ui.avatar({ class: props.ui?.avatar })" />
          </slot>

          <template v-if="variant !== 'button'">
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

            <div v-if="!!slots.actions" :class="ui.actions({ class: props.ui?.actions })">
              <slot name="actions" :files="modelValue" :open="open" :remove-file="removeFile" />
            </div>
          </template>
        </div>
      </component>

      <ReuseFilesTemplate v-if="position === 'outside'" />
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
      class="sr-only"
      tabindex="-1"
    >
  </Primitive>
</template>
