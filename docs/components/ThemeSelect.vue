<template>
  <div class="flex items-center">
    <USelectCustom
      v-model="primary"
      name="primary"
      list-width-class="w-48"
      :popper-options="{ placement: 'bottom-start' }"
      :options="primaryOptions"
    >
      <UButton color="gray" size="sm" class="!rounded-r-none" truncate>
        <span class="flex-shrink-0 h-4 w-4 -ml-0.5 mr-2 rounded-full" :style="{ backgroundColor: `${primary.hex}`}" />

        <span>{{ primary.text }}</span>

        <UIcon name="i-heroicons-chevron-down-20-solid" class="ml-2" />
      </UButton>

      <template #option="{ option }">
        <span class="flex-shrink-0 h-4 w-4 -ml-0.5 rounded-full" :style="{ backgroundColor: `${option.hex}`}" />

        <span class="leading-4">{{ option.text }}</span>
      </template>
    </USelectCustom>

    <USelectCustom
      v-model="gray"
      name="gray"
      list-width-class="w-48"
      :popper-options="{ placement: 'bottom-end' }"
      :options="grayOptions"
    >
      <UButton color="gray" size="sm" class="!border-l-0 !rounded-l-none">
        <span class="flex-shrink-0 h-4 w-4 -ml-0.5 mr-2 rounded-full" :style="{ backgroundColor: `${gray.hex}`}" />

        <span>{{ gray.text }}</span>

        <UIcon name="i-heroicons-chevron-down-20-solid" class="ml-2" />
      </UButton>

      <template #option="{ option }">
        <span class="flex-shrink-0 h-4 w-4 -ml-0.5 rounded-full" :style="{ backgroundColor: `${option.hex}`}" />

        <span class="leading-4">{{ option.text }}</span>
      </template>
    </USelectCustom>
  </div>
</template>

<script setup lang="ts">
import colors from '#tailwind-config/theme/colors'

const appConfig = useAppConfig()

// Computed

const primaryOptions = computed(() => useWithout(appConfig.ui.colors, 'primary').map(color => ({ value: color, text: color, hex: colors[color][500] })))
const primary = computed({
  get () {
    return primaryOptions.value.find(option => option.value === appConfig.ui.primary)
  },
  set (option) {
    appConfig.ui.primary = option.value
  }
})

const grayOptions = computed(() => ['slate', 'cool', 'zinc', 'neutral', 'stone'].map(color => ({ value: color, text: color, hex: colors[color][500] })))
const gray = computed({
  get () {
    return grayOptions.value.find(option => option.value === appConfig.ui.gray)
  },
  set (option) {
    appConfig.ui.gray = option.value
  }
})
</script>
