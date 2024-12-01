<script lang="ts">
export interface FileUploadProps {
  /**
   * @default true
   */
  multiple?: boolean
  /**
   * @default '*'
   */
  accept?: string
  /**
   * Select the input source for the capture file.
   * @see [HTMLInputElement Capture](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/capture)
   */
  capture?: 'user' | 'environment'
  /**
   * Reset when open file dialog.
   * @default false
   */
  reset?: boolean
  /**
   * Select directories instead of files.
   * @see [HTMLInputElement webkitdirectory](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory)
   * @default false
   */
  directory?: boolean
  /**
   * @default 0
   */
  minFileSize?: number
  /**
   * @default Infinity
   */
  maxFileSize?: number
  /**
   * @default false
   */
  disabled?: boolean
  /**
   * Whether to allow drag and drop in the dropzone element
   * @default true
   */
  allowDrop?: boolean
}

export interface FileAcceptDetails extends File {

}
export interface FileRejectDetails extends File {
}

export interface FileUplaodEmits {
  (e: 'update:modelValue', value: File[]): void
  (e: 'change' | 'delete', value: File): void
  (e: 'accept', value: FileAcceptDetails): void
  (e: 'reject', value: FileRejectDetails): void
}
</script>

<script lang="ts" setup generic="T extends FileList">
import { ref, defineModel } from 'vue'

const emits = defineEmits<FileUplaodEmits>()

const modelValue = defineModel<FileList>()

const file = ref<HTMLInputElement>()

const open = () => {
  if (file.value) {
    file.value.multiple = true
    file.value.click()
  }
}

const onHandleUpload = (event: Event) => {
  const result = event.target as HTMLInputElement
  const files = [...(modelValue.value ?? []), ...result.files!]
  emits('change', result.files?.[0] as File)
  emits('update:modelValue', files)
}

const onHandleDelete = (index: number) => {
  const f = Array.from(modelValue.value as FileList).filter((_, i) => i !== index)
  emits('update:modelValue', f)
}
</script>

<template>
  <div class="w-full flex flex-col gap-4" aria-label="root">
    <div
      aria-label="dropzone"
      tabindex="0"
      role="button"
      class="min-h-[20rem] w-full  border-[var(--ui-border)] border rounded-lg flex flex-col gap-3 justify-center items-center px-6 py-4"
      @click="open"
      @keyup.prevent.enter="open"
    >
      <h3 class="font-bold text-lg">
        Drop your files here
      </h3>
      <UButton class="cursor-pointer" @click.capture.stop="open">
        Open Dialog
      </UButton>
    </div>
    <input ref="file" type="file" class="sr-only" @change="onHandleUpload">
    <ul class="flex flex-col gap-3">
      <li v-for="(asd, index) in modelValue" :key="index" class="">
        <span>

          {{ asd.name }}
        </span>

        <UButton
          variant="ghost"
          color="error"
          icon="i-lucide-trash"
          @click="onHandleDelete(index)"
        />
      </li>
    </ul>
  </div>
</template>
