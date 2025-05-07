<!-- eslint-disable @typescript-eslint/unified-signatures -->
<script lang="ts">
import type theme from '#build/ui/file-upload'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../types'
import { useVModel, useEventListener } from '@vueuse/core'

type AnyString = string & {}

export interface FileRejection {
  file: File
  errors: FileError[]
}

export interface FileChangeDetails {
  acceptedFiles: File[]
  rejectedFiles: FileRejection[]
}

export type FileRejectDetails = FileRejection[]

export type FileError =
  | 'TOO_MANY_FILES'
  | 'FILE_INVALID_TYPE'
  | 'FILE_TOO_LARGE'
  | 'FILE_TOO_SMALL'
  | 'FILE_INVALID'
  | 'FILE_EXISTS'
  | AnyString

export type ImageFileMimeType =
  | 'image/png'
  | 'image/gif'
  | 'image/jpeg'
  | 'image/svg+xml'
  | 'image/webp'
  | 'image/avif'
  | 'image/heic'
  | 'image/bmp'

export type ApplicationFileMimeType =
  | 'application/pdf'
  | 'application/zip'
  | 'application/json'
  | 'application/xml'
  | 'application/msword'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.ms-excel'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'application/vnd.ms-powerpoint'
  | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  | 'application/rtf'
  | 'application/x-rar'
  | 'application/x-7z-compressed'
  | 'application/x-tar'
  | 'application/vnd.microsoft.portable-executable'

export type TextFileMimeType = 'text/css' | 'text/csv' | 'text/html' | 'text/markdown' | 'text/plain'

export type FontFileMimeType = 'font/ttf' | 'font/otf' | 'font/woff' | 'font/woff2' | 'font/eot' | 'font/svg'

export type VideoFileMimeType = 'video/mp4' | 'video/webm' | 'video/ogg' | 'video/quicktime' | 'video/x-msvideo'

export type AudioFileMimeType =
  | 'audio/mpeg'
  | 'audio/ogg'
  | 'audio/wav'
  | 'audio/webm'
  | 'audio/aac'
  | 'audio/flac'
  | 'audio/x-m4a'

export type FileMimeTypeGroup = 'image/*' | 'audio/*' | 'video/*' | 'text/*' | 'application/*' | 'font/*'

export type FileMimeType =
  | ImageFileMimeType
  | ApplicationFileMimeType
  | TextFileMimeType
  | FontFileMimeType
  | VideoFileMimeType
  | AudioFileMimeType
  | FileMimeTypeGroup
  | AnyString

type FileUplaod = ComponentConfig<typeof theme, AppConfig, 'file-upload'>

export interface FileUplaodProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  id?: string
  name?: string
  modelValue: File[]
  // color: FileUplaod['variants']['color']
  // variant?: FileUplaod['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  // size?: FileUplaod['variants']['size']
  /**
   * @defaultValue 'true'
   */
  multiple?: boolean
  accept?: MaybeRef<FileMimeType[] | FileMimeType>
  /**
   * @defaultValue 'true'
   */
  allowDrop?: boolean
  /**
   * @defaultValue 'true'
   */
  directory?: boolean
  disabled?: boolean
  maxFiles?: number
  /**
   * format in bytes
   */
  maxFileSize?: number
  /**
   * format in bytes
   */
  minFileSize?: number
}

export interface FileUploadEmits {
  (e: 'update:modelValue', files: File[]): void
  (e: 'drop', file: File[] | null, event: DragEvent): void
  (e: 'enter', file: File[] | null, event: DragEvent): void
  (e: 'leave', file: File[] | null, event: DragEvent): void
  (e: 'over', file: File[] | null, event: DragEvent): void
}
</script>

<script lang="ts" setup>
import { ref, shallowRef, toValue, useTemplateRef, type MaybeRef } from 'vue'
import { Primitive } from 'reka-ui'

defineOptions({
  inheritAttrs: false
})
const props = withDefaults(defineProps<FileUplaodProps>(), {
  multiple: true,
  directory: true,
  accept: '*',
  maxFiles: 1,
  minFileSize: 0,
  maxFileSize: Infinity,
  allowDrop: true
})
const emits = defineEmits<FileUploadEmits>()
const files = useVModel(props, 'modelValue', emits)
const accept = toValue(props.accept)
const inputEl = useTemplateRef('inputEl')
const counter = ref(0)
const isOverDropZone = shallowRef(false)

const dropZoneRef = ref<HTMLInputElement>()
const rejectedFiles = ref<FileRejectDetails>([])

function isDefined<T>(v: T | undefined): v is T {
  return v !== undefined && v !== null
}

function isFileAccepted(file: File | null) {
  if (file && accept) {
    const types = Array.isArray(accept) ? accept : typeof accept === 'string' ? accept.split(',') : []

    if (types.length === 0) return true

    const fileName = file.name || ''
    const mimeType = (file.type || '').toLowerCase()
    const baseMimeType = mimeType.replace(/\/.*$/, '')

    return types.some((type) => {
      const validType = type.trim().toLowerCase()

      if (validType.charAt(0) === '.') {
        return fileName.toLowerCase().endsWith(validType)
      }

      if (validType.endsWith('/*')) {
        return baseMimeType === validType.replace(/\/.*$/, '')
      }

      return mimeType === validType
    })
  }
  return true
}

function isValidFileType(file: File): [boolean, FileError | null] {
  const isAcceptable = file.type === 'application/x-moz-file' || isFileAccepted(file)
  return [isAcceptable, isAcceptable ? null : 'FILE_INVALID_TYPE']
}

function isValidFileSize(file: File, minSize?: number, maxSize?: number): [boolean, FileError | null] {
  if (isDefined(file.size)) {
    if (isDefined(props.minFileSize) && isDefined(props.maxFileSize)) {
      if (file.size > props.maxFileSize) return [false, 'FILE_TOO_LARGE']
      if (file.size < props.minFileSize) return [false, 'FILE_TOO_SMALL']
    } else if (isDefined(props.minFileSize) && file.size < props.minFileSize) {
      return [false, 'FILE_TOO_SMALL']
    } else if (isDefined(props.maxFileSize) && file.size > props.maxFileSize) {
      return [false, 'FILE_TOO_LARGE']
    }
  }
  return [true, null]
}

function isDragEvent(event: unknown): event is DragEvent {
  return event instanceof DragEvent
}

function getFiles(event: Event | DragEvent): File[] | null {
  const mapper = (files: FileList | never[]) => {
    const list = Array.from(files)
    return list.length === 0 ? null : (props.multiple ? list : [list[0]])
  }

  if (isDragEvent(event)) {
    const dragEvent = event as DragEvent
    const fileList = dragEvent.dataTransfer?.files ?? []
    return mapper(fileList)
  }

  const input = event.target as HTMLInputElement
  const fileList = input?.files ?? []
  return mapper(fileList)
}

function isFilesWithInRange(file: File[]) {
  if (!props.multiple && file.length > 1) return false
  if (props.multiple && file.length > props.maxFileSize) return false
  return true
}

function handleFiles(event: Event | DragEvent) {
  const currentFiles = getFiles(event)

  if (currentFiles) {
    currentFiles.forEach((currentFile) => {
      const [accepted, acceptError] = isValidFileType(currentFile)
      const [sizeMatch, sizeError] = isValidFileSize(currentFile)
      if (accepted && sizeMatch) {
        files.value.push(currentFile)
      } else {
        const errors = [acceptError, sizeError]
        rejectedFiles.value.push({ file: currentFile, errors: errors.filter(Boolean) as FileError[] })
      }
    })

    if (!isFilesWithInRange(currentFiles)) {
      currentFiles?.forEach((currentFile) => {
        rejectedFiles.value.push({
          file: currentFile,
          errors: ['TOO_MANY_FILES']
        })
      })
    }
  }
}

function handleDragEvent(event: DragEvent, eventType: 'enter' | 'over' | 'leave' | 'drop') {
  if (!props.allowDrop) return
  event.preventDefault()

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'
  }

  switch (eventType) {
    case 'enter':
      counter.value++
      isOverDropZone.value = true
      emits('enter', null, event)
      break
    case 'over':
      emits('over', null, event)
      break
    case 'leave':
      counter.value--
      if (counter.value === 0)
        isOverDropZone.value = false
      emits('leave', null, event)
      break
    case 'drop':
      emits('drop', files.value, event)
      counter.value = 0
      isOverDropZone.value = false
      handleFiles(event)

      break
  }
}

function handeChangeEvent(event: Event) {
  handleFiles(event)
}

useEventListener<DragEvent>(dropZoneRef, 'dragenter', event => handleDragEvent(event, 'enter'))
useEventListener<DragEvent>(dropZoneRef, 'dragover', event => handleDragEvent(event, 'over'))
useEventListener<DragEvent>(dropZoneRef, 'dragleave', event => handleDragEvent(event, 'leave'))
useEventListener<DragEvent>(dropZoneRef, 'drop', event => handleDragEvent(event, 'drop'))

defineExpose({
  rejectedFiles
})
</script>

<template>
  <Primitive ref="dropZoneRef" :as="as" :data-active="isOverDropZone" class="size-96 flex flex-col justify-center items-center rounded-(--ui-radius) border border-(--ui-border-muted)" @click="inputEl?.click()">
    <input
      ref="inputEl"
      :multiple="multiple"
      class="sr-only"
      type="file"
      :accept="accept as unknown as string"
      tabindex="-1"
      @change="handeChangeEvent"
    >
    <span>Drop your files here</span>
    <UButton label="Open Dialog" size="lg" />
  </Primitive>
</template>
