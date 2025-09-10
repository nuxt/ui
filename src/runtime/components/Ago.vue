<script lang="ts">
export interface AgoProps {
  /**
   * The Date object or value.
   * Accepts a Date object, an ISO/RFC string, or a number of milliseconds since epoch.
   */
  datetime?: Date | number | string
  /**
   * A specific locale string in BCP 47 language tag to use.
   * If not provided, the browser/server locale will be used.
   */
  locale?: string | undefined
  /**
   * If false, disables refreshing the relative time text.
   * @defaultValue false
   */
  refresh?: boolean
  class?: any
}

export interface AgoSlots {
  /**
   * Slot to customize the displayed text.
   */
  default(props: { text: string, date: Date }): any
}

export interface AgoSlots {
  default(props?: {}): any
}

export default {
  name: 'Ago'
}
</script>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { normalizeDate } from '@vueuse/shared'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<AgoProps>(), {
  refresh: true
})

const slots = defineSlots<AgoSlots>()

const date = computed(() => normalizeDate(props.datetime))
const iso = computed(() => date.value.toISOString())

const now = ref<Date>(new Date())

const intervalId = ref<number | null>(null)

function clearTick() {
  if (intervalId.value !== null) {
    clearInterval(intervalId.value)

    intervalId.value = null
  }
}

function getRefreshIntervalMs(diffMs: number): number {
  const abs = Math.abs(diffMs)
  // < 1 minute => seconds
  if (abs < 60_000) return 1000
  // < 1 hour => minutes
  if (abs < 3_600_000) return 1000 * 60
  // < 1 day => hours
  if (abs < 86_400_000) return 1000 * 60 * 60
  // >= 1 day => no auto refresh
  return 0
}

function scheduleTick() {
  clearTick()

  if (props.refresh) {
    const diff = date.value.getTime() - Date.now()
    const refreshMs = getRefreshIntervalMs(diff)

    if (refreshMs > 0) {
      intervalId.value = window.setInterval(() => now.value = new Date(), refreshMs)
    }
  }
}

const text = computed(() => {
  const rtf = new Intl.RelativeTimeFormat(props.locale || undefined, { numeric: 'auto' })
  const diff = date.value.getTime() - now.value.getTime()

  const abs = Math.abs(diff)

  if (abs < 60_000) {
    return rtf.format(Math.round(diff / 1000), 'second')
  } else if (abs < 3_600_000) {
    return rtf.format(Math.round(diff / 60_000), 'minute')
  } else if (abs < 86_400_000) {
    return rtf.format(Math.round(diff / 3_600_000), 'hour')
  } else if (abs < 7 * 86_400_000) {
    return rtf.format(Math.round(diff / 86_400_000), 'day')
  } else if (abs < 30 * 86_400_000) {
    return rtf.format(Math.round(diff / (7 * 86_400_000)), 'week')
  } else if (abs < 365 * 86_400_000) {
    return rtf.format(Math.round(diff / (30 * 86_400_000)), 'month')
  } else {
    return rtf.format(Math.round(diff / (365 * 86_400_000)), 'year')
  }
})

onMounted(scheduleTick)
onBeforeUnmount(clearTick)

watch(
  () => [props.datetime, props.locale, props.refresh] as const,
  () => {
    now.value = new Date()

    scheduleTick()
  }
)
</script>

<template>
  <time :datetime="iso" :class="props.class">
    <slot v-if="!!slots.default" :text="text" :date="date">
      {{ text }}
    </slot>
    <template v-else>
      {{ text }}
    </template>
  </time>
</template>
