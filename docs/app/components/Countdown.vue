<script setup lang="ts">
const endDate = new Date('2025-03-14T23:59:59Z')
const second = 1000
const minute = second * 60
const hour = minute * 60
const day = hour * 24

function getCountdown() {
  const distance = Math.floor((endDate.getTime() - Date.now()))
  return {
    day: Math.floor(distance / day),
    hour: Math.floor((distance % (day)) / (hour)),
    minute: Math.floor((distance % (hour)) / (minute)),
    second: Math.floor((distance % (minute)) / (second)),
    distance
  }
}
const countdown = ref(getCountdown())
let interval: any
if (countdown.value.distance > 0) {
  onMounted(() => {
    interval = setInterval(() => {
      countdown.value = getCountdown()
      if (countdown.value.distance <= 0) {
        clearInterval(interval)
      }
    }, 1000)
  })
}
const plural = (value: number) => (value === 1 ? '' : 's')
const double = (value: number) => (value < 10 ? `0${value}` : value)
</script>

<template>
  <div>
    <p class="font-semibold text-gray-900 dark:text-white text-sm mb-3">
      Nuxt UI v3 launch offer ends in:
    </p>

    <div class="flex items-center justify-center gap-2 text-center">
      <template v-for="(value, key) in countdown" :key="key">
        <div v-if="key !== 'distance'" class="flex flex-col items-center gap-2">
          <UBadge color="primary" class="w-14 h-14 font-bold text-2xl flex items-center justify-center tabular-nums" variant="subtle">
            {{ double(value) }}
          </UBadge>
          <span class="text-[10px] font-semibold text-gray-900 dark:text-white tracking-wide tabular-nums uppercase">{{ key }}{{ plural(value) }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
