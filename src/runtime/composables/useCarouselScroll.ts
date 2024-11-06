import { ref, type Ref, onMounted, onUnmounted } from 'vue'

export const useCarouselScroll = (el: Ref<HTMLElement>) => {
  const x = ref<number>(0)

  function onMouseDown(e) {
    el.value.style.scrollSnapType = 'none'
    el.value.style.scrollBehavior = 'auto'

    x.value = e.pageX

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  function onMouseUp() {
    el.value.style.removeProperty('scroll-behavior')
    el.value.style.removeProperty('scroll-snap-type')
    el.value.style.removeProperty('pointer-events')

    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  function onMouseMove(e) {
    e.preventDefault()

    el.value.style.pointerEvents = 'none'

    const delta = e.pageX - x.value

    x.value = e.pageX

    el.value.scrollBy(-delta, 0)
  }

  onMounted(() => {
    if (!el.value) {
      return
    }

    el.value.addEventListener('mousedown', onMouseDown)
  })

  onUnmounted(() => {
    if (!el.value) {
      return
    }

    el.value.removeEventListener('mousedown', onMouseDown)
  })
}
