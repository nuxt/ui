import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useFileUpload } from '../../src/runtime/composables/useFileUpload'
import type { UseFileUploadOptions } from '../../src/runtime/composables/useFileUpload'

// Captures the callbacks that `useFileUpload` registers with the VueUse hooks
// inside `onMounted`, so the test can drive drops and dialog changes directly.
const vueuse = vi.hoisted(() => ({
  dropTarget: undefined as MaybeRef<HTMLElement | undefined> | undefined,
  dropOptions: undefined as { onDrop: (files: File[] | FileList | null) => void } | undefined,
  onChangeCb: undefined as ((files: FileList | File[] | null) => void) | undefined,
  open: undefined as ReturnType<typeof vi.fn> | undefined,
  isOver: undefined as { value: boolean } | undefined
}))

vi.mock('@vueuse/core', async () => {
  // Spread the real module so unrelated consumers (Nuxt internals) keep working.
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useDropZone: (target: any, options: any) => {
      vueuse.dropTarget = target
      vueuse.dropOptions = options
      vueuse.isOver = ref(false)
      return { isOverDropZone: vueuse.isOver }
    },
    useFileDialog: () => {
      vueuse.open = vi.fn()
      return {
        onChange: (cb: any) => {
          vueuse.onChangeCb = cb
        },
        open: vueuse.open
      }
    }
  }
})

function file(name: string, type = 'text/plain'): File {
  return new File(['data'], name, { type })
}

async function mountUpload(options: UseFileUploadOptions) {
  let api!: ReturnType<typeof useFileUpload>
  const component = defineComponent({
    setup() {
      api = useFileUpload(options)
      return () => null
    }
  })
  const wrapper = await mountSuspended(component)
  return { api, wrapper }
}

describe('useFileUpload', () => {
  beforeEach(() => {
    vueuse.dropTarget = undefined
    vueuse.dropOptions = undefined
    vueuse.onChangeCb = undefined
    vueuse.open = undefined
    vueuse.isOver = undefined
  })

  describe('onDrop (drop zone)', () => {
    it('forwards dropped files to onUpdate', async () => {
      const onUpdate = vi.fn()
      await mountUpload({ onUpdate, multiple: true })
      const a = file('a.txt')
      const b = file('b.txt')

      vueuse.dropOptions!.onDrop([a, b])

      expect(onUpdate).toHaveBeenCalledWith([a, b])
    })

    it('keeps only the first file when not multiple', async () => {
      const onUpdate = vi.fn()
      await mountUpload({ onUpdate, multiple: false })
      const a = file('a.txt')
      const b = file('b.txt')

      vueuse.dropOptions!.onDrop([a, b])

      expect(onUpdate).toHaveBeenCalledWith([a])
    })

    it('ignores an empty drop', async () => {
      const onUpdate = vi.fn()
      await mountUpload({ onUpdate })

      vueuse.dropOptions!.onDrop([])

      expect(onUpdate).not.toHaveBeenCalled()
    })

    it('ignores a null drop', async () => {
      const onUpdate = vi.fn()
      await mountUpload({ onUpdate })

      vueuse.dropOptions!.onDrop(null)

      expect(onUpdate).not.toHaveBeenCalled()
    })
  })

  describe('onChange (file dialog)', () => {
    it('forwards selected files to onUpdate', async () => {
      const onUpdate = vi.fn()
      await mountUpload({ onUpdate })
      const a = file('a.txt')

      vueuse.onChangeCb!([a])

      expect(onUpdate).toHaveBeenCalledWith([a])
    })
  })

  describe('open', () => {
    it('opens the native file dialog', async () => {
      const onUpdate = vi.fn()
      const { api } = await mountUpload({ onUpdate })

      api.open()

      expect(vueuse.open).toHaveBeenCalled()
    })
  })

  describe('isDragging', () => {
    it('follows the drop zone hover state', async () => {
      const onUpdate = vi.fn()
      const { api } = await mountUpload({ onUpdate })

      expect(api.isDragging.value).toBe(false)

      vueuse.isOver!.value = true
      await nextTick()

      expect(api.isDragging.value).toBe(true)
    })
  })

  describe('accept', () => {
    it('rejects dropped files that do not match a wildcard MIME type', async () => {
      const onUpdate = vi.fn()
      const onReject = vi.fn()
      await mountUpload({ onUpdate, onReject, accept: 'image/*' })
      const pdf = file('a.pdf', 'application/pdf')

      vueuse.dropOptions!.onDrop([pdf])

      expect(onUpdate).not.toHaveBeenCalled()
      expect(onReject).toHaveBeenCalledWith([pdf])
    })

    it('matches full MIME types and extensions', async () => {
      const onUpdate = vi.fn()
      const onReject = vi.fn()
      await mountUpload({ onUpdate, onReject, multiple: true, accept: '.pdf, image/png' })
      const pdf = file('A.PDF', '')
      const png = file('b.png', 'image/png')
      const jpg = file('c.jpg', 'image/jpeg')

      vueuse.dropOptions!.onDrop([pdf, png, jpg])

      expect(onUpdate).toHaveBeenCalledWith([pdf, png])
      expect(onReject).toHaveBeenCalledWith([jpg])
    })

    it('rejects before keeping the first file when not multiple', async () => {
      const onUpdate = vi.fn()
      const onReject = vi.fn()
      await mountUpload({ onUpdate, onReject, accept: 'image/*' })
      const pdf = file('a.pdf', 'application/pdf')
      const png = file('b.png', 'image/png')

      vueuse.dropOptions!.onDrop([pdf, png])

      expect(onUpdate).toHaveBeenCalledWith([png])
      expect(onReject).toHaveBeenCalledWith([pdf])
    })

    it('accepts every dropped file for the default accept', async () => {
      const onUpdate = vi.fn()
      const onReject = vi.fn()
      await mountUpload({ onUpdate, onReject })
      const pdf = file('a.pdf', 'application/pdf')

      vueuse.dropOptions!.onDrop([pdf])

      expect(onUpdate).toHaveBeenCalledWith([pdf])
      expect(onReject).not.toHaveBeenCalled()
    })

    it('follows accept changes', async () => {
      const accept = ref('image/*')
      const onUpdate = vi.fn()
      const onReject = vi.fn()
      await mountUpload({ onUpdate, onReject, accept })
      const mp4 = file('a.mp4', 'video/mp4')

      vueuse.dropOptions!.onDrop([mp4])
      expect(onReject).toHaveBeenCalledWith([mp4])

      accept.value = 'video/*'
      vueuse.dropOptions!.onDrop([mp4])
      expect(onUpdate).toHaveBeenCalledWith([mp4])
    })

    it('does not filter files selected from the dialog', async () => {
      const onUpdate = vi.fn()
      const onReject = vi.fn()
      await mountUpload({ onUpdate, onReject, accept: 'image/*' })
      const pdf = file('a.pdf', 'application/pdf')

      vueuse.onChangeCb!([pdf])

      expect(onUpdate).toHaveBeenCalledWith([pdf])
      expect(onReject).not.toHaveBeenCalled()
    })
  })

  describe('dropzone option', () => {
    it('does not target the drop zone when dropzone is false', async () => {
      const { api } = await mountUpload({ onUpdate: vi.fn(), dropzone: false })
      api.dropzoneRef.value = document.createElement('div')

      expect(unref(vueuse.dropTarget)).toBeUndefined()
    })

    it('keeps the drop zone target reactive to dropzone changes', async () => {
      const dropzone = ref(true)
      const { api } = await mountUpload({ onUpdate: vi.fn(), dropzone })
      const el = document.createElement('div')
      api.dropzoneRef.value = el

      expect(unref(vueuse.dropTarget)).toBe(el)

      dropzone.value = false

      expect(unref(vueuse.dropTarget)).toBeUndefined()

      dropzone.value = true

      expect(unref(vueuse.dropTarget)).toBe(el)
    })
  })

  describe('refs', () => {
    it('exposes input and drop zone refs', async () => {
      const onUpdate = vi.fn()
      const { api } = await mountUpload({ onUpdate })

      expect(api.inputRef).toBeDefined()
      expect(api.dropzoneRef).toBeDefined()
      expect('value' in api.inputRef).toBe(true)
      expect('value' in api.dropzoneRef).toBe(true)
    })
  })
})
