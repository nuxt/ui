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
   * @defaultValue 'md'
   */
  size?: FileUpload['variants']['size']
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
  defaultValue?: File[]
  class?: any
  ui?: FileUpload['slots']
}

export interface FileUploadEmits<M extends boolean = false> {
  (e: 'update:modelValue', value: M extends true ? File[] : File | null): void
}

export interface FileUploadSlots {
  default(props: { open: UseFileDialogReturn['open'], reset: UseFileDialogReturn['reset'] }): any
  leading(props?: {}): any
  label(props?: {}): any
  description(props?: {}): any
  actions(props?: {}): any
  files(props: { files: FileList }): any
}
</script>

<script setup lang="ts" generic="M extends boolean = false">
import { ref, computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useFileDialog, useDropZone } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useFormField } from '../composables/useFormField'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FileUploadProps<M>>(), {
  accept: '*',
  dropzone: true
})
defineEmits<FileUploadEmits<M>>()
const slots = defineSlots<FileUploadSlots>()

const modelValue = defineModel<(M extends true ? File[] : File) | null>()

const appConfig = useAppConfig() as FileUpload['AppConfig']

const inputRef = ref<HTMLInputElement>()
const dropZoneRef = ref<HTMLDivElement>()

const { files, open, reset, onChange } = useFileDialog({
  multiple: props.multiple,
  accept: props.accept,
  reset: props.reset,
  input: inputRef.value,
  initialFiles: props.defaultValue
})
const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop,
  // dataTypes: props.accept.split(','),
  multiple: props.multiple
})
const { emitFormInput, id, name, disabled, ariaAttrs } = useFormField<FileUploadProps>(props, { deferInputValidation: true })

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.fileUpload || {}) })({
  dropzone: props.dropzone,
  multiple: props.multiple,
  size: props.size
}))

onChange((files) => {
  modelValue.value = (props.multiple ? files : files?.[0]) as (M extends true ? File[] : File) | null

  emitFormInput()
})

function onDrop(files: File[] | null) {
  modelValue.value = (props.multiple ? files : files?.[0]) as (M extends true ? File[] : File) | null
}

defineExpose({
  inputRef
})
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot :open="open" :reset="reset">
      <div
        ref="dropZoneRef"
        role="button"
        :data-dragging="isOverDropZone"
        :class="ui.base({ class: props.ui?.base })"
        @click="open()"
      >
        <div :class="ui.wrapper({ class: props.ui?.wrapper })">
          <div :class="ui.leading({ class: props.ui?.leading })">
            <slot name="leading">
              <UIcon :name="icon || appConfig.ui.icons.upload" :class="ui.leadingIcon({ class: props.ui?.icon })" />
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

      <div v-if="files && files.length > 0" :class="ui.files({ class: props.ui?.files })">
        <slot name="files" :files="files">
          {{ files }}
        </slot>
      </div>
    </slot>

    <input
      :id="id"
      ref="inputRef"
      type="file"
      :name="name"
      :accept="accept"
      :multiple="multiple"
      :required="required"
      :disabled="disabled"
      v-bind="{ ...$attrs, ...ariaAttrs }"
      hidden
    >
  </Primitive>
</template>
