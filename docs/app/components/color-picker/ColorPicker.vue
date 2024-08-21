<template>
  <UPopover mode="hover" :ui="{ content: 'p-2' }">
    <template #default="{ open }">
      <UButton
        icon="i-heroicons-swatch-20-solid"
        color="gray"
        :variant="open ? 'soft' : 'ghost'"
        square
        aria-label="Color picker"
        :ui="{ leadingIcon: 'text-primary-500 dark:text-primary-400' }"
      />
    </template>

    <template #content>
      <fieldset class="grid grid-cols-5 gap-px">
        <legend class="text-[11px] font-bold mb-1">
          Primary
        </legend>

        <ColorPickerPill v-for="color in primaryColors" :key="color" :color="color" :selected="primary" @select="primary = color" />
      </fieldset>

      <hr class="border-gray-200 dark:border-gray-800 my-2">

      <fieldset class="grid grid-cols-5 gap-px">
        <legend class="text-[11px] font-bold mb-1">
          Gray
        </legend>

        <ColorPickerPill v-for="color in grayColors" :key="color" :color="color" :selected="gray" @select="gray = color" />
      </fieldset>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()

// Computed

const primaryColors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']
const primary = computed({
  get() {
    return appConfig.ui.colors.primary
  },
  set(option) {
    appConfig.ui.colors.primary = option
    window.localStorage.setItem('nuxt-ui-primary', appConfig.ui.colors.primary)
  }
})

const grayColors = ['slate', 'cool', 'zinc', 'neutral', 'stone']
const gray = computed({
  get() {
    return appConfig.ui.colors.gray
  },
  set(option) {
    appConfig.ui.colors.gray = option
    window.localStorage.setItem('nuxt-ui-gray', appConfig.ui.colors.gray)
  }
})
</script>
