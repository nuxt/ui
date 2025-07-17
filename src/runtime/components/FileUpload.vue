<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { UseFileDialogReturn } from '@vueuse/core'
import theme from '#build/ui/file-upload'
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
   * @defaultValue false
   */
  dropzone?: boolean
  defaultValue?: File[]
  class?: any
  ui?: FileUpload['slots']
}

export interface FileUploadEmits<M extends boolean = false> {
  (e: 'update:modelValue', value: M extends true ? File[] : File | null): void
}

export interface FileUploadSlots {
  default(props: {
    open: UseFileDialogReturn['open']
    reset: UseFileDialogReturn['reset']
    previewUrls: string[]
    files: FileList[]
  }): any
}
</script>

<script setup lang="ts" generic="M extends boolean = false">
import { ref, computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useFileDialog, useDropZone } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useFormField } from '../composables/useFormField'

import { tv } from '../utils/tv'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FileUploadProps<M>>(), {
  accept: '*'
})
defineEmits<FileUploadEmits<M>>()
defineSlots<FileUploadSlots>()

const modelValue = defineModel<(M extends true ? File[] : File) | null>()

const appConfig = useAppConfig() as FileUpload['AppConfig']

const { emitFormInput, emitFormChange, id, name, disabled, ariaAttrs } = useFormField<FileUploadProps>(props, { deferInputValidation: true })

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.fileUpload || {}) })({
  dropzone: props.dropzone
}))

const inputRef = ref<HTMLInputElement>()

const { files, open, reset, onCancel, onChange } = useFileDialog({
  multiple: props.multiple,
  accept: props.accept,
  reset: props.reset,
  input: inputRef.value,
  initialFiles: props.defaultValue
})

const previewUrls = computed(() => Array.from(files.value || []).map(file => URL.createObjectURL(file)))

onChange((files) => {
  modelValue.value = (props.multiple ? files : files?.[0]) as (M extends true ? File[] : File) | null
})

onCancel(() => {
  /** do something on cancel */
})
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot :open="open" :files="files" :reset="reset" :preview-urls="previewUrls" />

    <input
      :id="id"
      ref="inputRef"
      type="file"
      :name="name"
      :accept="accept"
      :multiple="multiple"
      :required="required"
      :disabled="disabled"
      hidden
      tabindex="-1"
      v-bind="{ ...$attrs, ...ariaAttrs }"
    >
  </Primitive>
</template>
