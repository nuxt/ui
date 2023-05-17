<template>
  <div class="flex items-center shadow-sm">
    <USelectMenu
      v-model="primary"
      name="primary"
      class="w-full [&>div>button]:!rounded-r-none"
      appearance="gray"
      :ui="{ width: 'w-[194px]' }"
      :popper="{ placement: 'bottom-start' }"
      :options="primaryOptions"
    >
      <template #label>
        <span class="flex-shrink-0 h-3 w-3 rounded-full" :style="{ backgroundColor: `${primary.hex}`}" />

        {{ primary.text }}
      </template>

      <template #option="{ option }">
        <span class="flex-shrink-0 h-3 w-3 rounded-full" :style="{ backgroundColor: `${option.hex}`}" />

        {{ option.text }}
      </template>
    </USelectMenu>

    <USelectMenu
      v-model="gray"
      name="gray"
      class="w-full [&>div>button]:!rounded-l-none [&>div>button]:-ml-px"
      appearance="gray"
      :ui="{ width: 'w-[194px]' }"
      :popper="{ placement: 'bottom-end' }"
      :options="grayOptions"
    >
      <template #label>
        <span class="flex-shrink-0 h-3 w-3 rounded-full" :style="{ backgroundColor: `${gray.hex}`}" />

        {{ gray.text }}
      </template>

      <template #option="{ option }">
        <span class="flex-shrink-0 h-3 w-3 rounded-full" :style="{ backgroundColor: `${option.hex}`}" />

        {{ option.text }}
      </template>
    </USelectMenu>
  </div>
</template>

<script setup lang="ts">
import colors from '#tailwind-config/theme/colors'

const appConfig = useAppConfig()
const colorMode = useColorMode()
const uiPreference = useUIPreference()

// Computed
const primaryOptions = computed(() => useWithout(appConfig.ui.colors, 'primary').map(color => ({ value: color, text: color, hex: colors[color][colorMode.value === 'dark' ? 400 : 500] })))
const primary = computed({
  get () {
    return primaryOptions.value.find(option => option.value === appConfig.ui.primary)
  },
  set (option) {
    uiPreference.value.primary = option.value
  }
})

const grayOptions = computed(() => ['slate', 'cool', 'zinc', 'neutral', 'stone'].map(color => ({ value: color, text: color, hex: colors[color][colorMode.value === 'dark' ? 400 : 500] })))
const gray = computed({
  get () {
    return grayOptions.value.find(option => option.value === appConfig.ui.gray)
  },
  set (option) {
    uiPreference.value.gray = option.value
  }
})
</script>
