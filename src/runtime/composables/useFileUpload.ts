import { ref, type Ref } from 'vue'
import { createEventHook } from '@vueuse/core'

export interface UseFileUploadOptions {
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

const DEFAULT_OPTIONS: UseFileUploadOptions = {
  multiple: true,
  accept: '*',
  reset: false,
  directory: false,
  minFileSize: 0,
  maxFileSize: Infinity,
  disabled: false,
  allowDrop: true
}

export interface UseFileDialogReturn {
  files: Ref<FileList | null>
  open: (localOptions?: Partial<UseFileUploadOptions>) => void
  reset: () => void
}

export interface FileUploadEmits {
  (e: 'change', value: File): void
  (e: 'accept', value: any): void
  (e: 'reject', value: unknown): void
}

export function useFileUpload<T>(options = DEFAULT_OPTIONS) {
  let input: HTMLInputElement | undefined

  const files = ref<FileList | null | T>(null)

  const { on: onChange, trigger: changeTrigger } = createEventHook<File>()
  const { on: onReject, trigger: rejectTrigger } = createEventHook<File>()
  const { on: onAccept, trigger: acceptTrigger } = createEventHook<File>()
  const { on: onCancel, trigger: cancelTrigger } = createEventHook()

  if (document) {
    input = document.createElement('input')
    input.type = 'file'

    input.onchange = (event: Event) => {
      const result = event.target as HTMLInputElement
      files.value = result.files
      changeTrigger(result.files?.[0] as File)
    }

    input.oncancel = () => {
      cancelTrigger()
    }
  }

  const open = () => {
    input.multiple = options.multiple!
    input.accept = options.accept!
    input.capture = options.capture!
    input.click()
  }

  return {
    open,
    files,
    onChange,
    onCancel
  }
}
