import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, nextTick, ref, unref } from 'vue'
import type { MaybeRef } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useFileUpload } from '../../src/runtime/composables/useFileUpload'
import type { UseFileUploadOptions } from '../../src/runtime/composables/useFileUpload'

// Captures the callbacks that `useFileUpload` registers with the VueUse hooks
// inside `onMounted`, so the test can drive drops and dialog changes directly.
const vueuse = vi.hoisted(() => ({
  dropOptions: undefined as { dataTypes?: MaybeRef<readonly string[]>, onDrop: (files: File[] | FileList | null) => void } | undefined,
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
    useDropZone: (_target: unknown, options: any) => {
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

function file(name: string): File {
  return new File(['data'], name, { type: 'text/plain' })
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

  describe('accept parsing', () => {
    it('passes wildcard MIME types to the drop zone as their base type', async () => {
      await mountUpload({ onUpdate: vi.fn(), accept: 'image/*' })

      expect(unref(vueuse.dropOptions!.dataTypes)).toEqual(['image'])
    })

    it('keeps full MIME types and drops extension filters', async () => {
      // Drag items only expose MIME types, so `.pdf` can't be checked on drop.
      await mountUpload({ onUpdate: vi.fn(), accept: '.pdf, image/png' })

      expect(unref(vueuse.dropOptions!.dataTypes)).toEqual(['image/png'])
    })

    it('allows all types for the default accept', async () => {
      // An empty list means no restriction for `useDropZone`.
      await mountUpload({ onUpdate: vi.fn(), accept: '*' })

      expect(unref(vueuse.dropOptions!.dataTypes)).toEqual([])
    })

    it('allows all types when accept only contains extensions', async () => {
      await mountUpload({ onUpdate: vi.fn(), accept: '.pdf,.docx' })

      expect(unref(vueuse.dropOptions!.dataTypes)).toEqual([])
    })

    it('keeps the drop zone filter reactive to accept changes', async () => {
      const accept = ref('image/*')
      await mountUpload({ onUpdate: vi.fn(), accept })

      expect(unref(vueuse.dropOptions!.dataTypes)).toEqual(['image'])

      accept.value = 'video/*'
      await nextTick()

      expect(unref(vueuse.dropOptions!.dataTypes)).toEqual(['video'])
    })
  })

  describe('dropzone option', () => {
    it('does not register a drop zone when dropzone is false', async () => {
      const onUpdate = vi.fn()
      await mountUpload({ onUpdate, dropzone: false })

      expect(vueuse.dropOptions).toBeUndefined()
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
