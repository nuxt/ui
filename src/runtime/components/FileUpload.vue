<script lang="ts">
import theme from '#build/ui/file-upload'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../types/utils'
import type { AvatarProps } from '../types'

type FileUpload = ComponentConfig<typeof theme, AppConfig, 'fileUpload'>

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
  loading?: boolean
  /**
   * The icon when the `loading` prop is `true`.
   * @defaultValue appConfig.ui.icons.loading
   * @IconifyIcon
   */
  loadingIcon?: string
  class?: any
  ui?: FileUpload['slots']
}

export interface FileUploadEmits {
  (e: 'update:modelValue', value: File[]): void
  (e: 'blur', event: FocusEvent): void
  (e: 'change', event: Event): void
}

export interface FileUploadSlots {
  default?(props: {}): any
  empty?(props: {}): any
  file?(props: { file: File }): any
}
</script>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useFormField } from '../composables/useFormField'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FileUploadProps>(), {
  accept: 'image/*',
  autofocusDelay: 0,
  multiple: false
})

const emits = defineEmits<FileUploadEmits>()
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
const fileInputRef = ref<HTMLInputElement | null>(null)
const file = defineModel<File[]>()
const dragging = ref(false)
const filePreviews = ref<Record<string, string>>({})

const ui = computed(() =>
  tv({ extend: tv(theme), ...(appConfig.ui?.fileUpload || {}) })({
    size: size.value,
    multiple: props.multiple
  })
)

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
  file,
  (newFiles) => {
    if (newFiles?.length) {
      newFiles.forEach(f => addPreview(f))
    }
  },
  { deep: true }
)

onMounted(() => {
  if (file.value?.length) {
    file.value?.forEach(f => addPreview(f))
  }
})

onUnmounted(revokeAllPreviews)

function handleUpload(files: FileList) {
  const filesArray = Array.from(files)
  const newFiles = props.multiple ? [...(file.value ?? []), ...filesArray] : filesArray
  file.value = newFiles
  emitFormInput()
}

function removeFile(f: File) {
  file.value = file.value?.filter(existing => existing !== f)
  removePreview(f)
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
}

function onBlur(event: FocusEvent) {
  emitFormBlur()
  emits('blur', event)
}

defineExpose({ fileInputRef })
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <div
      :class="ui.base({
        class: [
          props.ui?.base,
          dragging && ui.dragging({ class: props.ui?.dragging }),
          !file?.length && 'cursor-pointer'
        ]
      })
      "
      tabindex="0"
      @drop="onDrop"
      @dragover.prevent="dragging = true"
      @dragleave="dragging = false"
    >
      <input
        :id="id"
        ref="fileInputRef"
        type="file"
        :name="name"
        :accept="accept"
        :multiple="multiple"
        :required="required"
        :disabled="disabled || loading"
        class="hidden"
        v-bind="{ ...$attrs, ...ariaAttrs }"
        @blur="onBlur"
        @change="onFileChange"
        @focus="emitFormFocus"
      >
      <!-- Empty state -->
      <div v-if="!file || file?.length === 0" :class="ui.empty({ class: props.ui?.empty })" @click="!disabled && !loading && fileInputRef?.click()">
        <slot name="empty">
          <UIcon
            :name="props.uploadIcon || appConfig.ui.icons.upload"
            :class="ui.uploadIcon({ class: props.ui?.uploadIcon })"
          />
          <span
            :class="ui.label({
              class: props.ui?.label
            })"
          > Browse or drop files here </span>
        </slot>
      </div>

      <!-- File list -->
      <ul v-else :class="ui.files({ class: props.ui?.files })">
        <li v-for="(f, i) in file" :key="i" :class="ui.file({ class: props.ui?.file })">
          <slot name="file" v-bind="{ file: f }">
            <div class="flex items-center gap-3">
              <UAvatar
                :src="f.type.includes('image') ? filePreviews[fileKey(f)] : undefined"
                :icon="f.type.includes('image') ? undefined : props.fileIcon || appConfig.ui.icons.file"
                :alt="f.name"
                :size="(ui.fileAvatarSize() || props.ui?.fileAvatarSize) as AvatarProps['size']"
                :class="ui.fileAvatar({ class: props.ui?.fileAvatar })"
              />
              <div>
                <p :class="ui.fileLabel({ class: props.ui?.fileLabel })">
                  {{ f.name }}
                </p>
                <p :class="ui.fileSize({ class: props.ui?.fileSize })">
                  {{ (f.size / 1024 / 1024).toFixed(2) }} MB
                </p>
              </div>
            </div>
            <div class="flex items-start">
              <UIcon :name="appConfig.ui.icons.close" @click.stop="removeFile(f)" />
            </div>
          </slot>
        </li>
      </ul>
    </div>
  </Primitive>
</template>
