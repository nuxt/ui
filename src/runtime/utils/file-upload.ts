import type { FileError, FileMimeType } from '../types/file-upload'
import { useEventListener } from '@vueuse/core'
import type { MaybeRef, MaybeRefOrGetter, ShallowRef } from 'vue'
import { shallowRef, unref } from 'vue'
import { isClient } from '@vueuse/shared'


function isFileAccepted(file: File | null, accept: string[] | string | undefined) {
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

export function isValidFileType(file: File, accept: string | undefined): [boolean, FileError | null] {
  const isAcceptable = file.type === 'application/x-moz-file' || isFileAccepted(file, accept)
  return [isAcceptable, isAcceptable ? null : 'FILE_INVALID_TYPE']
}

export interface UseDropZoneReturn {
  files: ShallowRef<File[] | null>
  isOverDropZone: ShallowRef<boolean>
}

export interface UseDropZoneOptions {
  /**
   * Allowed data types, if not set, all data types are allowed.
   * Also can be a function to check the data types.
   */
  dataTypes?: MaybeRef<FileMimeType[] | FileMimeType>
  onDrop?: (files: File[] | null, event: DragEvent) => void
  onEnter?: (files: File[] | null, event: DragEvent) => void
  onLeave?: (files: File[] | null, event: DragEvent) => void
  onOver?: (files: File[] | null, event: DragEvent) => void
  /**
   * Allow multiple files to be dropped. Defaults to true.
   */
  multiple?: boolean
  /**
   * Prevent default behavior for unhandled events. Defaults to false.
   */
  preventDefaultForUnhandled?: boolean
}

export function useDropZone(
  target: MaybeRefOrGetter<HTMLElement | Document | null | undefined>,
  options: UseDropZoneOptions | UseDropZoneOptions['onDrop'] = {},
): UseDropZoneReturn {
  const isOverDropZone = shallowRef(false)
  const files = shallowRef<File[] | null>(null)
  let counter = 0
  let isValid = true

  if (isClient) {
    const _options = typeof options === 'function' ? { onDrop: options } : options
    const multiple = _options.multiple ?? true
    const preventDefaultForUnhandled = _options.preventDefaultForUnhandled ?? false

    const getFiles = (event: DragEvent) => {
      const list = Array.from(event.dataTransfer?.files ?? [])
      return list.length === 0 ? null : (multiple ? list : [list[0]])
    }

    const isSafari = () => (
      /^(?:(?!chrome|android).)*safari/i.test(navigator.userAgent)
      && !('chrome' in window)
    )

    const handleDragEvent = (event: DragEvent, eventType: 'enter' | 'over' | 'leave' | 'drop') => {
      const dataTransferItemList = event.dataTransfer?.items

      if (preventDefaultForUnhandled) {
        event.preventDefault()
      }

      if (!isSafari() && !isValid) {
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = 'none'
        }
        return
      }

      event.preventDefault()
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy'
      }

      const currentFiles = getFiles(event)


      switch (eventType) {
        case 'enter':
          counter += 1
          isOverDropZone.value = true
          _options.onEnter?.(null, event)
          break
        case 'over':
          _options.onOver?.(null, event)
          break
        case 'leave':
          counter -= 1
          if (counter === 0)
            isOverDropZone.value = false
          _options.onLeave?.(null, event)
          break
        case 'drop':
          counter = 0
          isOverDropZone.value = false
          if (isValid) {
            files.value = currentFiles
            _options.onDrop?.(currentFiles, event)
          }
          break
      }
    }

    useEventListener<DragEvent>(target, 'dragenter', event => handleDragEvent(event, 'enter'))
    useEventListener<DragEvent>(target, 'dragover', event => handleDragEvent(event, 'over'))
    useEventListener<DragEvent>(target, 'dragleave', event => handleDragEvent(event, 'leave'))
    useEventListener<DragEvent>(target, 'drop', event => handleDragEvent(event, 'drop'))
  }

  return {
    files,
    isOverDropZone,
  }
}