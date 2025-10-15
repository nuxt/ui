import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { useOverlay } from '../../src/runtime/composables/useOverlay'
import OverlayProvider from '../../src/runtime/components/OverlayProvider.vue'
import MockModal from '../mocks/MockModal.vue'

describe('useOverlay with OverlayProvider integration', () => {
  it('should render overlay component and handle emits', async () => {
    const closeSpy = vi.fn()
    const submitSpy = vi.fn()

    const TestWrapper = defineComponent({
      setup() {
        const { create } = useOverlay()
        const modal = create(MockModal, {
          props: {
            title: 'Test Title',
            description: 'Test Description'
          }
        })

        // Register event handlers
        modal.on('close', (value) => {
          closeSpy(value)
          modal.close(value)
        })

        modal.on('submit', (id) => {
          submitSpy(id)
        })

        // Open the modal
        modal.open()

        return () => h(OverlayProvider)
      }
    })

    const wrapper = mount(TestWrapper)
    await nextTick()

    // Check that the modal is rendered
    expect(wrapper.text()).toContain('Test Title')
    expect(wrapper.text()).toContain('Test Description')

    // Find and click the close button
    const closeButton = wrapper.find('button.close')
    expect(closeButton.text()).toBe('Close')
    await closeButton.trigger('click')

    // Check that close event was called with correct value
    expect(closeSpy).toHaveBeenCalledWith('test-result')

    // Find and click the submit button
    const submitButton = wrapper.find('button.submit')
    expect(submitButton.text()).toBe('Submit')
    await submitButton.trigger('click')

    // Check that submit event was called with correct value
    expect(submitSpy).toHaveBeenCalledWith(42)
  })

  it('should handle multiple overlays', async () => {
    const TestWrapper = defineComponent({
      setup() {
        const { create } = useOverlay()

        const modal1 = create(MockModal, {
          props: { title: 'Modal 1' }
        })

        const modal2 = create(MockModal, {
          props: { title: 'Modal 2' }
        })

        modal1.open()
        modal2.open()

        return () => h(OverlayProvider)
      }
    })

    const wrapper = mount(TestWrapper)
    await nextTick()

    // Both modals should be rendered
    expect(wrapper.text()).toContain('Modal 1')
    expect(wrapper.text()).toContain('Modal 2')
  })

  it('should update props dynamically', async () => {
    const TestWrapper = defineComponent({
      setup() {
        const { create } = useOverlay()
        const modal = create(MockModal, {
          props: { title: 'Initial Title' }
        })

        modal.open()

        // Update props after opening
        setTimeout(() => {
          modal.patch({ title: 'Updated Title' })
        }, 10)

        return () => h(OverlayProvider)
      }
    })

    const wrapper = mount(TestWrapper)
    await nextTick()

    expect(wrapper.text()).toContain('Initial Title')

    // Wait for patch to be applied
    await new Promise(resolve => setTimeout(resolve, 20))
    await nextTick()

    expect(wrapper.text()).toContain('Updated Title')
  })

  it('should handle async close with result', async () => {
    const resultSpy = vi.fn()
    const TestWrapper = defineComponent({
      setup() {
        const { create } = useOverlay()
        const modal = create(MockModal)

        modal.on('close', (value) => {
          modal.close(value)
        })

        const openedModal = modal.open()

        // Test the promise result
        openedModal.then((result) => {
          resultSpy(result)
        })

        modal.close('test-result')

        return () => h(OverlayProvider)
      }
    })

    const wrapper = mount(TestWrapper)
    await nextTick()

    // Click close button to trigger the close event
    const closeButton = wrapper.find('button.close')
    await closeButton.trigger('click')
    await nextTick()

    expect(resultSpy).toHaveBeenCalledWith('test-result')
  })

  it('should type check event arguments correctly', async () => {
    const TestWrapper = defineComponent({
      setup() {
        const { create } = useOverlay()
        const modal = create(MockModal)

        // These should type check correctly
        modal.on('close', (value) => {
          // value should be string
          const uppercased: string = value.toUpperCase()
          expect(typeof uppercased).toBe('string')
        })

        modal.on('submit', (id) => {
          // id should be number
          const doubled: number = id * 2
          expect(typeof doubled).toBe('number')
        })

        modal.open()

        return () => h(OverlayProvider)
      }
    })

    const wrapper = mount(TestWrapper)
    await nextTick()

    // Trigger events to run the type-checked callbacks
    const closeButton = wrapper.find('button.close')
    await closeButton.trigger('click')

    const submitButton = wrapper.find('button.submit')
    await submitButton.trigger('click')
  })
})
