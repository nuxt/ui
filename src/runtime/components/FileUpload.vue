<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/file-upload'
import type { AvatarProps } from '../types'
import type { ComponentConfig } from '../types/utils'

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
   * Layout mode for file previews
   * @defaultValue 'list'
   */
  layout?: 'list' | 'grid'
  /**
   * Where to show file previews
   * @defaultValue 'inside'
   */
  previewPlacement?: 'inside' | 'outside'
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
  autofocus?: boolean
  autofocusDelay?: number
  multiple?: boolean
  disabled?: boolean
  class?: any
  ui?: FileUpload['slots']
}

export interface FileUploadEmits<T extends FileUploadItem = FileUploadItem> {
  (e: 'update:modelValue', value: T[]): void
  (e: 'blur', event: FocusEvent): void
  (e: 'change', event: Event): void
  (e: 'drop' | 'dragover' | 'dragleave', event: DragEvent): void
}

export interface FileUploadSlots {
  default?(props: {}): any
  empty?(props: {}): any
  item?(props: { item: FileUploadItem }): any
  actions?(props: {}): any
}
</script>

<script setup lang="ts" generic="T extends FileUploadItem">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Primitive } from 'reka-ui'
import { createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import ImageComponent from '#build/ui-image-component'
import { useLocale } from '../composables/useLocale'
import { useFormField } from '../composables/useFormField'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FileUploadProps>(), {
  accept: 'image/*',
  layout: 'list',
  previewPlacement: 'inside',
  autofocusDelay: 0,
  multiple: false
})
const emits = defineEmits<FileUploadEmits<T>>()
const slots = defineSlots<FileUploadSlots>()

const files = defineModel<T[]>()

const { t } = useLocale()
const appConfig = useAppConfig() as FileUpload['AppConfig']

const { emitFormBlur, emitFormInput, emitFormChange, id, name, disabled, emitFormFocus, ariaAttrs } = useFormField<FileUploadProps>(props, { deferInputValidation: true })

const [DefineFilesPreviewTemplate, ReuseFilesPreviewTemplate] = createReusableTemplate<{ files: T[] | undefined }>({
  props: {
    files: Object
  }
})

const baseRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const filePreviews = ref<Record<string, string>>({})

const isEmpty = computed(() => !files.value || files.value?.length === 0)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.fileUpload || {}) })({
  size: props.size,
  multiple: props.multiple,
  layout: props.layout,
  dragging: dragging.value,
  disabled: disabled.value,
  isEmpty: isEmpty.value,
  previewPlacement: props.previewPlacement,
  hasDefaultSlot: !!slots.default
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
    ? [...(files.value ?? []), ...filesArray.map(f => ({ file: f }) as T)]
    : filesArray.map(f => ({ file: f }) as T)
  files.value = newFiles
  emitFormInput()
}

function removeFile(f: T) {
  files.value = files.value?.filter(existing => existing !== f)
  removePreview(f.file)
  emitFormInput()
  emits('change', new Event('change'))
  // Reset input so the same file can be re-added
  if (inputRef.value) {
    inputRef.value.value = ''
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
  emits('drop', event)
}

function onBlur(event: FocusEvent) {
  emitFormBlur()
  emits('blur', event)
}

function onDragover(event: DragEvent) {
  event.preventDefault()
  dragging.value = true
  emits('dragover', event)
}

function onDragleave(event: DragEvent) {
  event.preventDefault()

  // Early return if the drag leave is within the base element
  if (baseRef.value && baseRef.value.contains(event.relatedTarget as Node)) return

  dragging.value = false
  emits('dragleave', event)
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  const size = bytes / Math.pow(k, i)
  const formattedSize = i === 0 ? size.toString() : size.toFixed(2)

  return `${formattedSize} ${sizes[i]}`
}

function removeAll() {
  files.value = []
  revokeAllPreviews()
  if (inputRef.value) inputRef.value.value = ''
  emits('change', new Event('change'))
}

function autoFocus() {
  if (props.autofocus) {
    inputRef.value?.focus()
  }
}

onMounted(() => {
  setTimeout(() => {
    autoFocus()
  }, props.autofocusDelay)
})

defineExpose({ inputRef })
</script>

<template>
  <DefineFilesPreviewTemplate v-slot="{ files: filesList }">
    <div :class="ui.filesActions({ class: props.ui?.filesActions })">
      <slot name="actions">
        <span :class="ui.filesActionsLabel({ class: props.ui?.filesActionsLabel })">
          {{ `${t('fileUpload.files')}  (${files?.length || 0})` }}
        </span>
        <div :class="ui.filesActionsButtons({ class: props.ui?.filesActionsButtons })">
          <UButton
            id="add-files"
            :icon="appConfig.ui.icons.upload"
            :label="t('fileUpload.addFiles')"
            variant="outline"
            color="neutral"
            :size="props.size || 'md'"
            @click="inputRef?.click()"
          />
          <UButton
            id="remove-all"
            :icon="appConfig.ui.icons.trash"
            :label="t('fileUpload.removeAll')"
            :disabled="isEmpty"
            variant="outline"
            color="neutral"
            :size="props.size || 'md'"
            @click.stop="removeAll()"
          />
        </div>
      </slot>
    </div>
    <div :class="ui.files({ class: props.ui?.files })">
      <div
        v-for="(item, i) in filesList"
        :key="`file-${i}-${item.file.name}`"
        :class="ui.file({ class: props.ui?.file })"
      >
        <slot name="item" v-bind="{ item }">
          <div :class="ui.fileContent({ class: props.ui?.fileContent })">
            <component
              :is="
                item.file.type.includes('image')
                  ? props.layout === 'list'
                    ? UAvatar
                    : ImageComponent
                  : UAvatar
              "
              :src="
                item.file.type.includes('image')
                  ? filePreviews[fileKey(item.file)]
                  : undefined
              "
              :class="
                item.file.type.includes('image') && props.layout === 'grid'
                  ? ui.fileImage({ class: props.ui?.fileImage })
                  : ui.fileLeadingAvatar({ class: props.ui?.fileLeadingAvatar })
              "
              :icon="
                item.file.type.includes('image')
                  ? undefined
                  : props.fileIcon || appConfig.ui.icons.file
              "
              :alt="item.file.name"
              :size="
                (ui.fileLeadingAvatarSize()
                  || props.ui?.fileLeadingAvatarSize) as AvatarProps['size']
              "
            />

            <div
              v-if="props.layout === 'list'"
              :class="ui.fileDetails({ class: props.ui?.fileDetails })"
            >
              <p :class="ui.fileLabel({ class: props.ui?.fileLabel })">
                {{ item.file.name }}
              </p>
              <p :class="ui.fileSize({ class: props.ui?.fileSize })">
                {{ formatFileSize(item.file.size) }}
              </p>
            </div>
          </div>

          <!-- Remove Button -->
          <div :class="ui.fileTrailing({ class: props.ui?.fileTrailing })">
            <UButton
              id="remove-file"
              :icon="appConfig.ui.icons.close"
              :variant="props.layout === 'list' ? 'link' : 'solid'"
              size="xs"
              color="neutral"
              :class="ui.fileRemoveButton({ class: props.ui?.fileRemoveButton })"
              @click.stop="removeFile(item)"
            />
          </div>
        </slot>
      </div>
    </div>
  </DefineFilesPreviewTemplate>

  <Primitive :as="as" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <div
      ref="baseRef"
      tabindex="0"
      :class="ui.base({ class: props.ui?.base })"
      @drop="onDrop"
      @dragover="onDragover"
      @click="
        !disabled
          && (isEmpty || previewPlacement === 'outside')
          && !slots.default
          && inputRef?.click()
      "
      @dragleave="onDragleave"
    >
      <input
        :id="id"
        ref="inputRef"
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

      <!-- Empty State -->
      <div v-if="isEmpty || previewPlacement === 'outside'" :class="ui.empty({ class: props.ui?.empty })">
        <slot name="empty">
          <UIcon :name="props.uploadIcon || appConfig.ui.icons.upload" :class="ui.uploadIcon({ class: props.ui?.uploadIcon })" />

          <div v-if="!!slots.default" @click.stop="inputRef?.click()">
            <slot />
          </div>

          <span :class="ui.label({ class: props.ui?.label })">
            {{ label || t('fileUpload.empty') }}
          </span>
        </slot>
      </div>

      <!-- File Layout (Inside) -->
      <ReuseFilesPreviewTemplate v-else-if="previewPlacement === 'inside'" :files="files" />
    </div>

    <!-- File Layout (Outside) -->
    <ReuseFilesPreviewTemplate v-if="previewPlacement === 'outside' && !isEmpty" :files="files" />
  </Primitive>
</template>
