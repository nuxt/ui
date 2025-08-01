import { ref, computed, unref, onMounted, reactive, readonly } from 'vue'
import { useFileDialog, useDropZone } from '@vueuse/core'
import type { MaybeRef } from '@vueuse/core'
import { defu } from 'defu'

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
  const optionsComputed = computed(() => defu({
    accept: '*',
    reset: false,
    multiple: false,
    dropzone: true
  }, options))

  const inputRef = ref<HTMLInputElement>()
  const dropzoneRef = ref<HTMLDivElement>()

  const dataTypes = computed(() => parseAcceptToDataTypes(unref(optionsComputed.value.accept)))

  const onDrop = (files: FileList | File[] | null) => {
    if (!files || files.length === 0) {
      return
    }
    if (files instanceof FileList) {
      files = Array.from(files)
    }
    if (files.length > 1 && !optionsComputed.value.multiple) {
      files = [files[0]!]
    }
    optionsComputed.value.onUpdate(files)
  }

  const fileDialog = reactive({
    open: () => {
    }
  })

  function open() {
    fileDialog.open()
  }

  const { isOverDropZone: isDragging } = useDropZone(dropzoneRef, {
    dataTypes: (types) => {
      if (dataTypes.value === undefined || optionsComputed.value.accept === '*') {
        return true
      }

      return types.some((type) => {
        return dataTypes.value?.some((accepted) => {
          if (accepted.endsWith('/*')) {
            const base = accepted.slice(0, accepted.indexOf('/'))
            return type.startsWith(base + '/')
          } else {
            return type === accepted
          }
        })
      })
    }, onDrop: (files, event) => {
      if (!optionsComputed.value.dropzone) {
        event.preventDefault()
        return
      }

      onDrop(files)
    }
  })

  onMounted(() => {
    const { onChange, open } = useFileDialog({
      accept: unref(optionsComputed.value.accept),
      multiple: optionsComputed.value.multiple,
      input: unref(inputRef),
      reset: optionsComputed.value.reset
    })

    fileDialog.open = open

    onChange(fileList => onDrop(fileList))
  })

  return {
    isDragging: readonly(isDragging),
    open,
    inputRef,
    dropzoneRef
  }
}
