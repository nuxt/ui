import type { Ref } from 'vue'
import { computed, unref } from 'vue'
import { useFileDialog, useDropZone } from '@vueuse/core'
import type { MaybeRef, MaybeRefOrGetter } from '@vueuse/core'

export interface UseFileUploadOptions {
  /**
   * Specifies the allowed file types. Provide a comma-separated list of MIME types or file extensions.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept
   * @defaultValue '*'
   */
  accept?: MaybeRef<string>
  reset?: boolean
  multiple?: boolean
  dropzone?: boolean
  dropzoneRef: MaybeRefOrGetter<HTMLElement | null | undefined>
  inputRef: Ref<HTMLInputElement | undefined>
  onUpdate: (files: File[]) => void
}

function parseAcceptToDataTypes(accept: string): string[] | undefined {
  if (!accept || accept === '*') {
    return undefined
  }

  const types = accept
    .split(',')
    .map(type => type.trim())
    .filter((type) => {
      return !type.startsWith('.')
    })

  return types.length > 0 ? types : undefined
}

export function useFileUpload(options: UseFileUploadOptions) {
  const {
    accept = '*',
    reset = false,
    multiple = false,
    dropzone = true,
    dropzoneRef,
    inputRef,
    onUpdate
  } = options

  const dataTypes = computed(() => parseAcceptToDataTypes(unref(accept)))

  const onDrop = (files: FileList | File[] | null) => {
    if (!files || files.length === 0) {
      return
    }
    if (files instanceof FileList) {
      files = Array.from(files)
    }
    if (files.length > 1 && !multiple) {
      files = [files[0]!]
    }
    onUpdate(files)
  }

  const { isOverDropZone: isDragging } = dropzone
    ? useDropZone(dropzoneRef, { dataTypes: dataTypes.value, onDrop })
    : { isOverDropZone: false }
  const { onChange, open } = useFileDialog({
    accept: unref(accept),
    multiple,
    input: unref(inputRef),
    reset
  })

  onChange(fileList => onDrop(fileList))

  return {
    isDragging,
    open
  }
}
