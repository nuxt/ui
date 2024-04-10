import { ref, inject, computed, reactive } from 'vue'
import type { ShallowRef, Component, InjectionKey, Ref, WritableComputedRef, ComputedRef } from 'vue'
import { createSharedComposable, useWindowSize, useTransition, useTimeoutFn, useEventListener } from '@vueuse/core'
import type { ComponentProps } from '../types/component'
import type { Slideover, SlideoverState, Arguments } from '../types/slideover'

export const slidOverInjectionKey: InjectionKey<ShallowRef<SlideoverState>> = Symbol('nuxt-ui.slideover')

function _useSlideover () {
  const slideoverState = inject(slidOverInjectionKey)

  const isOpen = ref(false)

  function open<T extends Component> (component: T, props?: Slideover & ComponentProps<T>) {
    if (!slideoverState) {
      throw new Error('useSlideover() is called without provider')
    }

    slideoverState.value = {
      component,
      props: props ?? {}
    }

    isOpen.value = true
  }

  async function close () {
    if (!slideoverState) return

    isOpen.value = false
  }

  function reset () {
    slideoverState.value = {
      component: 'div',
      props: {}
    }
  }

  /**
   * Allows updating the slideover props
   */
  function patch<T extends Component = {}> (props: Partial<Slideover & ComponentProps<T>>) {
    if (!slideoverState) return

    slideoverState.value = {
      ...slideoverState.value,
      props: {
        ...slideoverState.value.props,
        ...props
      }
    }
  }

  return {
    open,
    close,
    reset,
    patch,
    isOpen
  }
}

function _useResizeSlideover (A: Arguments) {

  if (!A._enable) return

  const resize: {
    initWidth: number,
    isResizing: boolean,
    isClick: boolean,
    newWidth: number | null,
    _resizedWidth: number
  } = reactive({
    initWidth: A._width,
    isResizing: false,
    isClick: true,
    newWidth: null,
    _resizedWidth: A._width
  })
  const { width } = useWindowSize()
  const isMagnetic: ComputedRef<boolean> = computed(() => {
    return resize.newWidth > width.value * (A._percentage)
  })

  const resizedWidth: WritableComputedRef<number> = computed({
    get: () => {
      if (resize._resizedWidth > width.value) {
        resize.initWidth = width.value
        return width.value
      } else {
        return resize._resizedWidth
      }
    },
    set: (value: number) => {
      if (!resize.isClick) {
        if (value > width.value) {
          value = width.value
          resize.initWidth = width.value
        }
        if (value <= A._width) {
          value = A._width
        }
        resize._resizedWidth = isMagnetic.value ? width.value : value
      } else {
        resize._resizedWidth = value
      }
    }
  })

  /**
   * see @vueuse/core useTransition()
   * https://vueuse.org/core/useTransition/#usetransition
   */
  const transition: ComputedRef<number> = useTransition(resizedWidth, {
    duration: A._duration,
    transition: A._transition,
    disabled: !A.transitionP.value
  })

  const rotateTarget: Ref<number> = ref(0)

  const styleWidth: ComputedRef<string> = computed(() => {
    return (isMagnetic.value || resize.isClick) && A.transitionP.value ? `${transition.value}px` : `${resizedWidth.value}px`
  })

  const handleResize = (e: MouseEvent) => {
    // Recording the initial position
    const initPosX: number = e.clientX

    /**
     * PointMove
     */
    const onDocumentPointerMove = (e: PointerEvent) => {
      /**
       * Employing two ref() to differentiate between
       * a click and a drag for the purpose of modification
       * might be excessively verbose
       */
      resize.isClick = false
      resize.isResizing = true

      /**
       * The direction of the arrow is determined based on
       * the initial mouse click position,
       * rather than the direction of mouse movement.
       */
      rotateTarget.value = -Math.sign(e.clientX - initPosX)

      resize.newWidth = A._side.value === 'left'
        ? resize.initWidth + (e.clientX - initPosX)
        : resize.initWidth - (e.clientX - initPosX)

      if (resize.newWidth >= width.value) return
      resizedWidth.value = resize.newWidth
    }
    const cleanupPointerMove = useEventListener('pointermove', onDocumentPointerMove)

    /**
     * PointUp
     */
    const onDocumentPointerUp = () => {
      resize.isResizing = false
      resize.initWidth = resizedWidth.value
      cleanupPointerMove()
      rotateTarget.value = 0
      useTimeoutFn(() => {
        resize.isClick = true
      }, A._duration)
    }
    useEventListener('pointerup', onDocumentPointerUp, { once: true })
  }

  /**
   * Click
   */
  const handleClick = () => {
    if (resize.isClick) {
      if (resizedWidth.value >= width.value / 2) {
        resizedWidth.value = resizedWidth.value === width.value ? A._width : width.value
      } else {
        resizedWidth.value = width.value / 2
      }
      resize.initWidth = resizedWidth.value
    }
  }

  return {
    handleClick,
    handleResize,
    styleWidth,
    rotateTarget,
    resize
  }
}

export const useSlideover = createSharedComposable(_useSlideover)
export const useResizeSlideover = createSharedComposable(_useResizeSlideover)
