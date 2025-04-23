<script lang="ts">
import type theme from '#build/ui/file-upload'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../types'
import type { FileAcceptDetails, FileChangeDetails, FileMimeType, FileRejectDetails } from '../types/file-upload'
import { useDropZone, useVModel } from '@vueuse/core'

type FileUplaod = ComponentConfig<typeof theme, AppConfig, 'file-upload'>

export interface FileUplaodProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  id?: string
  name?: string
  modelValue: FileAcceptDetails
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
  accept?: MaybeRef<readonly FileMimeType[]> | ((types: readonly FileMimeType[]) => boolean)
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
  maxFileSize?: number
  minFileSize?: number
}

export interface FileUploadEmits {
  (e: 'file-reject', details: FileRejectDetails): void
  (e: 'update:modelValue', details: FileAcceptDetails): void
  (e: 'file-change', details: FileChangeDetails): void
}
</script>

<script lang="ts" setup>
import { ref, type MaybeRef } from 'vue'
import { Primitive } from 'reka-ui'

defineOptions({
  inheritAttrs: false
})

const dropZoneRef = ref<HTMLInputElement>()

const props = withDefaults(defineProps<FileUplaodProps>(), {
  multiple: true,
  directory: true
})

const emits = defineEmits<FileUploadEmits>()

const data = useVModel(props, 'modelValue', emits)

function onDrop(files: File[] | null) {
  if (!props.allowDrop) return

  const file = files?.[0] as File

  if (props.multiple) {
    data.value.push(file)
  }

}

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop,
  multiple: props.multiple,
  dataTypes: props.accept

})
</script>

<template>
  <Primitive ref="dropZoneRef" :as="as" :data-active="isOverDropZone" class="size-32 border border-red-500">
    <input class="sr-only" type="file" tabindex="-1">
  </Primitive>
</template>
