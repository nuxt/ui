<template>
  <div class="flex items-center shadow-sm">
    <USelectCustom
      v-model="primary"
      name="primary"
      list-width-class="w-[186px]"
      class="w-full"
      :popper-options="{ placement: 'bottom-start' }"
      :options="primaryOptions"
    >
      <UButton color="gray" size="sm" class="!shadow-none !rounded-r-none" truncate block>
        <span class="flex-shrink-0 h-4 w-4 -ml-0.5 mr-2 rounded-full" :style="{ backgroundColor: `${primary.hex}`}" />

        <span>{{ primary.text }}</span>

        <UIcon name="i-heroicons-chevron-down-20-solid" class="ml-2 w-4 h-4 -mr-0.5" />
      </UButton>

      <template #option="{ option }">
        <span class="flex-shrink-0 h-4 w-4 rounded-full" :style="{ backgroundColor: `${option.hex}`}" />

        {{ option.text }}
      </template>
    </USelectCustom>

    <USelectCustom
      v-model="gray"
      name="gray"
      class="w-full"
      list-width-class="w-[186px]"
      :popper-options="{ placement: 'bottom-end' }"
      :options="grayOptions"
    >
      <UButton color="gray" size="sm" class="!shadow-none -ml-px !rounded-l-none" block>
        <span class="flex-shrink-0 h-4 w-4 -ml-0.5 mr-2 rounded-full" :style="{ backgroundColor: `${gray.hex}`}" />

        <span>{{ gray.text }}</span>

        <UIcon name="i-heroicons-chevron-down-20-solid" class="ml-2 w-4 h-4 -mr-0.5" />
      </UButton>

      <template #option="{ option }">
        <span class="flex-shrink-0 h-4 w-4 rounded-full" :style="{ backgroundColor: `${option.hex}`}" />

        {{ option.text }}
      </template>
    </USelectCustom>
  </div>
</template>

<script setup lang="ts">
import colors from '#tailwind-config/theme/colors'

const appConfig = useAppConfig()
const colorMode = useColorMode()

const primaryCookie = useCookie('primary', { path: '/', default: () => appConfig.ui.primary })
const grayCookie = useCookie('gray', { path: '/', default: () => appConfig.ui.gray })

watch(primaryCookie, (primary) => {
  appConfig.ui.primary = primary
}, { immediate: true })

watch(grayCookie, (gray) => {
  appConfig.ui.gray = gray
}, { immediate: true })

// Computed

const primaryOptions = computed(() => useWithout(appConfig.ui.colors, 'primary').map(color => ({ value: color, text: color, hex: colors[color][colorMode.value === 'dark' ? 400 : 500] })))
const primary = computed({
  get () {
    return primaryOptions.value.find(option => option.value === primaryCookie.value)
  },
  set (option) {
    primaryCookie.value = option.value
  }
})

const grayOptions = computed(() => ['slate', 'cool', 'zinc', 'neutral', 'stone'].map(color => ({ value: color, text: color, hex: colors[color][colorMode.value === 'dark' ? 400 : 500] })))
const gray = computed({
  get () {
    return grayOptions.value.find(option => option.value === grayCookie.value)
  },
  set (option) {
    grayCookie.value = option.value
  }
})
</script>
