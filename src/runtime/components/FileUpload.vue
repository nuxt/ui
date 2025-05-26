<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/file-upload'
import type { ComponentConfig } from '../types/utils'
import type { AvatarProps } from '../types'

type FileUpload = ComponentConfig<typeof theme, AppConfig, 'fileUpload'>

export type FileUploadItem<Meta = Record<string, any>> = {
  file: File
} & Meta

export interface FileUploadProps {
  as?: any
  id?: string
  name?: string
  label?: string
  /**
   * @defaultValue 'md'
   */
  size?: FileUpload['variants']['size']
  required?: boolean
  /**
   * The icon displayed in the drag and drop area.
   * @defaultValue appConfig.ui.icons.upload
   * @IconifyIcon
   */
  uploadIcon?: string
  /**
   * The icon displayed when the file is not an image
   * @defaultValue appConfig.ui.icons.file
   * @IconifyIcon
   */
  fileIcon?: string
  /**
   * The file types that the input should accept. This is a comma-separated list of MIME types or file extensions.
   * @defaultValue 'image/*'
   */
  accept?: string
  /**
   * Whether multiple files can be uploaded or not.
   * @defaultValue false
   */
  multiple?: boolean
  disabled?: boolean
  class?: any
  ui?: FileUpload['slots']
}

export interface FileUploadEmits<T extends FileUploadItem = FileUploadItem> {
  (e: 'update:modelValue', value: T[]): void
  (e: 'blur', event: FocusEvent): void
  (e: 'change', event: Event): void
  (e: 'onDrop' | 'onDragOver' | 'onDragLeave', event: DragEvent): void
}

export interface FileUploadSlots {
  default?(props: {}): any
  empty?(props: {}): any
  item?(props: { item: FileUploadItem }): any
}
</script>

<script setup lang="ts" generic="T extends FileUploadItem">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import { useFormField } from '../composables/useFormField'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

const { t } = useLocale()

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FileUploadProps>(), {
  accept: 'image/*',
  autofocusDelay: 0,
  multiple: false
})

const emits = defineEmits<FileUploadEmits<T>>()

const appConfig = useAppConfig() as FileUpload['AppConfig']

const {
  emitFormBlur,
  emitFormInput,
  emitFormChange,
  id,
  name,
  disabled,
  emitFormFocus,
  ariaAttrs
} = useFormField<FileUploadProps>(props, { deferInputValidation: true })

const size = computed(() => props.size)
const base = ref<HTMLElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const files = defineModel<T[]>()
const dragging = ref(false)
const filePreviews = ref<Record<string, string>>({})

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.fileUpload || {}) })({
  size: size.value,
  multiple: props.multiple
}))

function fileKey(f: File) {
  // Use name + lastModified for uniqueness
  return `${f.name}_${f.lastModified}`
}

function addPreview(f: File) {
  if (f.type.includes('image') && !filePreviews.value[fileKey(f)]) {
    filePreviews.value[fileKey(f)] = URL.createObjectURL(f)
  }
}

function removePreview(f: File) {
  const key = fileKey(f)
  if (filePreviews.value[key]) {
    URL.revokeObjectURL(filePreviews.value[key])
    filePreviews.value = Object.fromEntries(
      Object.entries(filePreviews.value).filter(([k]) => k !== key)
    )
  }
}

function revokeAllPreviews() {
  Object.values(filePreviews.value).forEach(URL.revokeObjectURL)
  filePreviews.value = {}
}

watch(
  files,
  (newFiles) => {
    if (newFiles?.length) {
      newFiles.forEach(f => addPreview((f as FileUploadItem).file))
    }
  },
  { deep: true }
)

onMounted(() => {
  if (files.value?.length) {
    files.value?.forEach(f => addPreview((f as FileUploadItem).file))
  }
})

onUnmounted(revokeAllPreviews)

function handleUpload(filelist: FileList) {
  const filesArray = Array.from(filelist)
  // If T is not just FileUploadItem, you may want to map files to T here
  const newFiles = props.multiple
    ? [...(files.value ?? []), ...filesArray.map(f => ({ file: f } as T))]
    : filesArray.map(f => ({ file: f } as T))
  files.value = newFiles
  emitFormInput()
}

function removeFile(f: T) {
  files.value = files.value?.filter(existing => existing !== f)
  removePreview(f.file)
  emitFormInput()
  emits('change', new Event('change'))
  // Reset input so the same file can be re-added
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    handleUpload(target.files)
    emits('change', event)
    emitFormChange()
  }
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  dragging.value = false
  if (event.dataTransfer?.files?.length) {
    handleUpload(event.dataTransfer.files)
  }
  emits('onDrop', event)
}

function onBlur(event: FocusEvent) {
  emitFormBlur()
  emits('blur', event)
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
  dragging.value = true
  emits('onDragOver', event)
}

function onDragLeave(event: DragEvent) {
  event.preventDefault()

  // Early return if the drag leave is within the base element
  if (base.value && base.value.contains(event.relatedTarget as Node)) return

  dragging.value = false
  emits('onDragLeave', event)
}

const isEmpty = computed(() => !files.value || files.value?.length === 0)

defineExpose({ fileInputRef })
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <div
      ref="base"
      :class="ui.base({
        class: [
          props.ui?.base,
          dragging && !disabled && ui.dragging({ class: props.ui?.dragging }),
          !files?.length && 'cursor-pointer',
          disabled && 'cursor-not-allowed'
        ]
      })"
      tabindex="0"
      @drop="onDrop"
      @dragover="onDragOver"
      @click="!disabled && isEmpty && fileInputRef?.click()"
      @dragleave="onDragLeave"
    >
      <input
        :id="id"
        ref="fileInputRef"
        type="file"
        :name="name"
        :accept="accept"
        :multiple="multiple"
        :required="required"
        :disabled="disabled"
        class="hidden"
        v-bind="{ ...$attrs, ...ariaAttrs }"
        @blur="onBlur"
        @change="onFileChange"
        @focus="emitFormFocus"
      >
      <!-- Empty state -->
      <div
        v-if="isEmpty"
        :class="ui.empty({ class: props.ui?.empty })"
      >
        <slot name="empty">
          <UIcon
            :name="props.uploadIcon || appConfig.ui.icons.upload"
            :class="ui.uploadIcon({ class: props.ui?.uploadIcon })"
          />
          <span
            :class="ui.label({
              class: props.ui?.label
            })"
          > {{ label || t('fileUpload.empty') }} </span>
        </slot>
      </div>

      <!-- File list -->
      <ul
        v-else
        :class="ui.files({ class: props.ui?.files })"
      >
        <li v-for="(fileItem, i) in files" :key="i" :class="ui.file({ class: props.ui?.file })">
          <slot name="item" v-bind="{ item: fileItem as FileUploadItem }">
            <div class="flex items-center gap-3">
              <UAvatar
                :src="fileItem.file.type.includes('image') ? filePreviews[fileKey(fileItem.file)] : undefined"
                :icon="fileItem.file.type.includes('image') ? undefined : props.fileIcon || appConfig.ui.icons.file"
                :alt="fileItem.file.name"
                :size="((ui.fileAvatarSize() || props.ui?.fileAvatarSize) as AvatarProps['size'])"
                :class="ui.fileAvatar({ class: props.ui?.fileAvatar })"
              />
              <div>
                <p :class="ui.fileLabel({ class: props.ui?.fileLabel })">
                  {{ fileItem.file.name }}
                </p>
                <p :class="ui.fileSize({ class: props.ui?.fileSize })">
                  {{ (fileItem.file.size / 1024 / 1024).toFixed(2) }} MB
                </p>
              </div>
            </div>
            <div class="flex items-start">
              <UIcon id="remove-file" :name="appConfig.ui.icons.close" @click.stop="removeFile(fileItem as T)" />
            </div>
          </slot>
        </li>
      </ul>
    </div>
  </Primitive>
</template>
