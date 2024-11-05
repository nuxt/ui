import { ref, computed } from 'vue-demi'
import { useTimestamp } from '@vueuse/core'
import type { UseTimestampOptions } from '@vueuse/core'

export function useTimer(cb: (...args: unknown[]) => any, interval: number, options?: UseTimestampOptions<true>) {
  let timer: number | null = null
  const { pause: tPause, resume: tResume, timestamp } = useTimestamp({ ...(options || {}), controls: true })
  const startTime = ref<number | null>(null)

  const remaining = computed(() => {
    if (!startTime.value) {
      return 0
    }
    return interval - (timestamp.value - startTime.value)
  })

  function set(...args: unknown[]) {
    timer = setTimeout(() => {
      timer = null
      startTime.value = null
      cb(...args)
    }, remaining.value) as unknown as number
  }

  function clear() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function start() {
    startTime.value = Date.now()

    set()
  }

  function stop() {
    clear()
    tPause()
  }

  function pause() {
    clear()
    tPause()
  }

  function resume() {
    set()
    tResume()
    startTime.value = (startTime.value || 0) + (Date.now() - timestamp.value)
  }

  start()

  return {
    start,
    stop,
    pause,
    resume,
    remaining
  }
}
