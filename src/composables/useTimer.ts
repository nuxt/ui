import { Ref, ref, computed } from 'vue-demi'
import { useTimestamp } from '@vueuse/core'

export function useTimer (cb: (...args: unknown[]) => any, interval: number) {
  let timer: number | null = null
  const timestamp = useTimestamp({ controls: true })
  const startTime: Ref<number | null> = ref(null)

  const remaining = computed(() => {
    if (!startTime.value) {
      return
    }
    return interval - (timestamp.timestamp.value - startTime.value)
  })

  function set (...args: unknown[]) {
    timer = setTimeout(() => {
      timer = null
      startTime.value = null
      // eslint-disable-next-line node/no-callback-literal
      cb(...args)
    }, remaining.value) as unknown as number
  }

  function clear () {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function start () {
    startTime.value = Date.now()

    set()
  }

  function stop () {
    clear()
    timestamp.pause()
  }

  function pause () {
    clear()
    timestamp.pause()
  }

  function resume () {
    console.log('resume')
    startTime.value += (Date.now() - timestamp.timestamp.value)
    timestamp.resume()
    set()
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
