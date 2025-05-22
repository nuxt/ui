import { describe, it, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import FileUpload, { type FileUploadProps, type FileUploadSlots, type FileUploadItem } from '../../src/runtime/components/FileUpload.vue'
import theme from '#build/ui/file-upload'

import { renderForm } from '../utils/form'
import type { FormInputEvents } from '~/src/module'

async function setFilesOnInput(input: any, files: File[]) {
  // Create a DataTransfer and add files
  const data = new DataTransfer()
  files.forEach(file => data.items.add(file))
  // Set files property via Object.defineProperty
  Object.defineProperty(input.element, 'files', {
    value: data.files,
    writable: false,
    configurable: true
  })
  // Trigger change event
  await input.trigger('change')
}

describe('FileUpload', () => {
  const sizes = Object.keys(theme.variants.size) as any

  it.each([
    // Props
    ['with id', { props: { id: 'id' } }],
    ['with name', { props: { name: 'name' } }],
    ['with multiple', { props: { multiple: true } }],
    ['with accept', { props: { accept: 'png,jpg' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with required', { props: { required: true } }],
    ['with label', { props: { label: 'Label' } }],
    ['with placeholder', { props: { placeholder: 'Placeholder' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }])
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: FileUploadProps, slots?: Partial<FileUploadSlots> }) => {
    const wrapper = mount(FileUpload<FileUploadItem>, {
      ...options
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  describe('emits', () => {
    test('update:modelValue event', async () => {
      const wrapper = mount(FileUpload<FileUploadItem>, {
        props: {
          modelValue: []
        }
      })
      const input = wrapper.find('input[type="file"]')
      const file1 = new File(['foo'], 'file1.txt', { type: 'text/plain' })
      const file2 = new File(['bar'], 'file2.txt', { type: 'text/plain' })
      await setFilesOnInput(input, [file1, file2])
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })
    test('change event', async () => {
      const wrapper = mount(FileUpload<FileUploadItem>, {
        props: {
          modelValue: []
        }
      })
      const input = wrapper.find('input[type="file"]')
      const file1 = new File(['foo'], 'file1.txt', { type: 'text/plain' })
      const file2 = new File(['bar'], 'file2.txt', { type: 'text/plain' })
      await setFilesOnInput(input, [file1, file2])
      expect(wrapper.emitted('change')).toBeTruthy()
    })
    test('dragover event', async () => {
      const wrapper = mount(FileUpload<FileUploadItem>, {
        props: {
          modelValue: []
        }
      })
      const input = wrapper.find('input[type="file"]')
      await input.trigger('dragover')
      expect(wrapper.emitted('dragover')).toBeTruthy()
    }
    )
    test('dragleave event', async () => {
      const wrapper = mount(FileUpload<FileUploadItem>, {
        props: {
          modelValue: []
        }
      })
      const input = wrapper.find('input[type="file"]')
      await input.trigger('dragleave')
      expect(wrapper.emitted('dragleave')).toBeTruthy()
    }
    )
    test('drop event', async () => {
      const wrapper = mount(FileUpload<FileUploadItem>, {
        props: {
          modelValue: []
        }
      })
      const input = wrapper.find('input[type="file"]')
      await input.trigger('drop')
      expect(wrapper.emitted('drop')).toBeTruthy()
    }
    )
  })

  describe('form integration', async () => {
    async function createForm(validateOn?: FormInputEvents[], eagerValidation?: boolean) {
      const wrapper = await renderForm({
        props: {
          validateOn,
          validateOnInputDelay: 0,
          async validate(state: any) {
            // state.value is expected to be an array of FileUploadItem(s)
            const files: FileUploadItem[] = Array.isArray(state.value) ? state.value : []
            if (!files.length || files.some(f => f.file.name !== 'valid')) {
              return [{ name: 'value', message: 'Error message' }]
            }
            return []
          }
        },
        slotTemplate: `
        <UFormField name="value" :eager-validation="eagerValidation">
          <UFileUpload id="input" v-model="state.value" />
        </UFormField>
        `,
        slotVars: {
          eagerValidation
        }
      })
      const input = wrapper.find('input[type="file"]')
      return {
        wrapper,
        input
      }
    }

    test('validate on blur works', async () => {
      const { input, wrapper } = await createForm(['blur'])
      await setFilesOnInput(input, [new File(['foo'], 'invalid.txt', { type: 'text/plain' })])
      await input.trigger('blur')
      expect(wrapper.text()).toContain('Error message')

      await setFilesOnInput(input, [new File(['foo'], 'valid', { type: 'text/plain' })])
      await input.trigger('blur')
      expect(wrapper.text()).not.toContain('Error message')
    })

    test('validate on change works', async () => {
      const { input, wrapper } = await createForm(['change'])
      await setFilesOnInput(input, [new File(['foo'], 'invalid.txt', { type: 'text/plain' })])
      await input.trigger('change')
      expect(wrapper.text()).toContain('Error message')

      await setFilesOnInput(input, [new File(['foo'], 'valid', { type: 'text/plain' })])
      await input.trigger('change')
      expect(wrapper.text()).not.toContain('Error message')
    })

    test('validate on input works', async () => {
      const { input, wrapper } = await createForm(['input'], true)
      await setFilesOnInput(input, [new File(['foo'], 'invalid.txt', { type: 'text/plain' })])
      expect(wrapper.text()).toContain('Error message')

      await setFilesOnInput(input, [new File(['foo'], 'valid', { type: 'text/plain' })])
      expect(wrapper.text()).not.toContain('Error message')
    })

    test('validate on input without eager validation works', async () => {
      const { input, wrapper } = await createForm(['input'])

      await setFilesOnInput(input, [new File(['foo'], 'invalid.txt', { type: 'text/plain' })])
      expect(wrapper.text()).not.toContain('Error message')

      await input.trigger('blur')

      await setFilesOnInput(input, [new File(['foo'], 'invalid.txt', { type: 'text/plain' })])
      expect(wrapper.text()).toContain('Error message')

      await setFilesOnInput(input, [new File(['foo'], 'valid', { type: 'text/plain' })])
      expect(wrapper.text()).not.toContain('Error message')
    })
  })

  describe('FileUpload advanced behaviors', () => {
    test('shows image preview and removes it when file is removed', async () => {
      const file = new File(['dummy'], 'test.png', { type: 'image/png', lastModified: 1 })
      const wrapper = mount(FileUpload<FileUploadItem>, {
        props: { modelValue: [{ file }] }
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.html()).toContain('test.png')
      const removeIcon = wrapper.find('#remove-file')
      expect(removeIcon).toBeDefined()
      await removeIcon!.trigger('click')

      // Check that update:modelValue was emitted with an empty array
      const emits = wrapper.emitted('update:modelValue')
      expect(emits).toBeTruthy()
      expect(emits![emits!.length - 1][0]).toEqual([])
    })

    test('does not allow interaction when disabled', async () => {
      const wrapper = mount(FileUpload<FileUploadItem>, {
        props: { disabled: true }
      })
      const input = wrapper.find('input[type="file"]')
      expect(input.attributes('disabled')).toBeDefined()
      await wrapper.find('div[role="presentation"],div').trigger('click')
      expect(wrapper.emitted('change')).toBeFalsy()
    })

    test('handles multiple file uploads', async () => {
      const file1 = new File(['foo'], 'foo.png', { type: 'image/png', lastModified: 1 })
      const file2 = new File(['bar'], 'bar.jpg', { type: 'image/jpeg', lastModified: 2 })
      const wrapper = mount(FileUpload<FileUploadItem>, {
        props: { multiple: true, modelValue: [] }
      })
      const input = wrapper.find('input[type="file"]')
      await setFilesOnInput(input, [file1, file2])
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      const lastEmitted = wrapper.emitted('update:modelValue')?.pop()?.[0]
      expect(lastEmitted).toHaveLength(2)
    })

    test('accept prop restricts file types', async () => {
      const file = new File(['foo'], 'foo.txt', { type: 'text/plain' })
      const wrapper = mount(FileUpload<FileUploadItem>, {
        props: { accept: 'image/*', modelValue: [] }
      })
      const input = wrapper.find('input[type="file"]')
      await setFilesOnInput(input, [file])
      expect(input.attributes('accept')).toBe('image/*')
    })

    test('renders custom empty slot', () => {
      const wrapper = mount(FileUpload<FileUploadItem>, {
        slots: {
          empty: '<div class="custom-empty">Custom Empty</div>'
        }
      })
      expect(wrapper.html()).toContain('Custom Empty')
    })

    test('renders custom file slot', async () => {
      const file = new File(['foo'], 'foo.png', { type: 'image/png', lastModified: 1 })
      const wrapper = mount(FileUpload<FileUploadItem>, {
        props: { modelValue: [{ file }] },
        slots: {
          file: '<div class="custom-file">{{file.name}}</div>'
        }
      })
      expect(wrapper.html()).toContain('custom-file')
      expect(wrapper.html()).toContain('foo.png')
    })
  })
})
