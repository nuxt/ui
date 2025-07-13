import { describe, it, expect, beforeEach } from 'vitest'
import { useOverlay } from '../../src/runtime/composables/useOverlay'
import MockModal from '../mocks/MockModal.vue'

function getModalById(overlays: ReturnType<typeof useOverlay>['overlays'], id: symbol) {
  return overlays.find(o => o.id === id)!
}

describe('useOverlay', () => {
  let overlay: ReturnType<typeof useOverlay>

  beforeEach(() => {
    overlay = useOverlay()
  })

  it('should create an overlay instance', () => {
    const modal = overlay.create(MockModal)

    expect(modal).toBeDefined()
    expect(modal.id).toBeDefined()
    expect(modal.isOpen).toBe(false)
    expect(modal.isMounted).toBe(false)

    expect(overlay.overlays).toHaveLength(1)
  })

  it('should create an overlay with defaultOpen', () => {
    const modal = overlay.create(MockModal, {
      defaultOpen: true
    })

    expect(modal.isOpen).toBe(true)
    expect(modal.isMounted).toBe(true)
  })

  it('should create an overlay with destroyOnClose', () => {
    const modal = overlay.create(MockModal, {
      destroyOnClose: true
    })

    const overlayData = getModalById(overlay.overlays, modal.id)
    expect(overlayData.destroyOnClose).toBe(true)
  })

  it('should close all overlays', () => {
    const modal1 = overlay.create(MockModal, { defaultOpen: true })
    const modal2 = overlay.create(MockModal, { defaultOpen: true })

    const modal1Instance = modal1.open()
    const modal2Instance = modal2.open()

    const createdModal1 = getModalById(overlay.overlays, modal1Instance.id)
    const createdModal2 = getModalById(overlay.overlays, modal2Instance.id)

    overlay.closeAll()

    expect(createdModal1.isOpen).toBe(false)
    expect(createdModal2.isOpen).toBe(false)
  })

  it('should throw error for non-existent overlay', () => {
    const fakeId = Symbol('fake')
    expect(() => overlay.isOpen(fakeId)).toThrow('Overlay not found')
  })

  it('should patch overlay props', () => {
    const modalWithProps = overlay.create(MockModal, {
      props: {
        title: 'Original Title'
      }
    })

    modalWithProps.patch({
      title: 'Patched Title',
      description: 'Patched Description'
    })

    // Access props through the overlays array and type assert
    const overlayData = getModalById(overlay.overlays, modalWithProps.id)
    const props = overlayData?.props as any
    expect(props?.title).toBe('Patched Title')
    expect(props?.description).toBe('Patched Description')
  })

  it('should merge props correctly', () => {
    const modalWithProps = overlay.create(MockModal, {
      props: {
        title: 'Original Title',
        description: 'Original Description'
      }
    })

    modalWithProps.patch({
      title: 'Patched Title'
    })

    // Access props through the overlays array and type assert
    const overlayData = getModalById(overlay.overlays, modalWithProps.id)
    const props = overlayData?.props as any
    expect(props?.title).toBe('Patched Title')
    expect(props?.description).toBe('Original Description')
  })

  it('should open an overlay with default props', async () => {
    const modal = overlay.create(MockModal, { props: { title: 'Deafult' } })
    const instance = modal.open()

    const createdModal = getModalById(overlay.overlays, instance.id)

    expect(createdModal.props).toEqual({ title: 'Deafult' })
  })

  it('should open an overlay and override default props', async () => {
    const modal = overlay.create(MockModal, { props: { title: 'default' } })
    const instance = modal.open({ title: 'custom', description: 'custom description' })

    const createdModal = getModalById(overlay.overlays, instance.id)

    expect(createdModal).toBeDefined()
    expect(createdModal.isOpen).toBe(true)
    expect(createdModal.isMounted).toBe(true)

    // Opening the overlay again override the default props, but not the props that are already set
    expect(createdModal.props).toEqual({ title: 'custom', description: 'custom description' })

    const instance2 = modal.open({ title: 'custom2' })

    const createdModal2 = getModalById(overlay.overlays, instance2.id)

    expect(createdModal2.props).toEqual({ title: 'custom2' })
  })

  it('should return a promise that resolves when closed', async () => {
    const modal = overlay.create(MockModal)
    const instance = modal.open()

    // Simulate closing the modal
    setTimeout(() => {
      modal.close('test-result')
    }, 0)

    const result = await instance.result
    expect(result).toBe('test-result')
  })

  it('should close an overlay', () => {
    const modal = overlay.create(MockModal)

    modal.open()

    expect(getModalById(overlay.overlays, modal.id).isOpen).toBe(true)

    modal.close()

    expect(getModalById(overlay.overlays, modal.id).isOpen).toBe(false)
  })
})
