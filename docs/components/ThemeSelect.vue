<template>
  <USelectCustom
    v-model="primary"
    name="primary"
    list-width-class="w-48"
    :popper-options="{ placement: 'bottom-start' }"
    :options="options"
  >
    <UButton variant="gray" size="sm">
      <span class="flex-shrink-0 h-4 w-4 -ml-0.5 mr-2 rounded-full" :style="{ backgroundColor: `${primary.hex}`}" />

      <span>{{ primary.text }}</span>

      <UIcon name="i-heroicons-chevron-down-20-solid" class="ml-2" />
    </UButton>

    <template #option="{ option }">
      <span class="flex-shrink-0 h-4 w-4 -ml-0.5 rounded-full" :style="{ backgroundColor: `${option.hex}`}" />

      <span class="leading-4">{{ option.text }}</span>
    </template>
  </USelectCustom>
</template>

<script setup lang="ts">
import colors from '#tailwind-config/theme/colors'

const appConfig = useAppConfig()

// Computed

const options = computed(() => useWithout(appConfig.ui.colors, 'primary').map(color => ({ value: color, text: color, hex: colors[color][500] })))
const primary = computed({
  get () {
    return options.value.find(option => option.value === appConfig.ui.primary)
  },
  set (option) {
    appConfig.ui.primary = option.value
  }
})
</script>
