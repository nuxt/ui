<template>
  <UPopover mode="hover" :ui="{ content: 'p-2' }">
    <template #default="{ open }">
      <UButton
        icon="i-heroicons-swatch-20-solid"
        color="neutral"
        :variant="open ? 'soft' : 'ghost'"
        square
        aria-label="Color picker"
        :ui="{ leadingIcon: 'text-[--ui-primary]' }"
      />
    </template>

    <template #content>
      <fieldset class="grid grid-cols-5 gap-px">
        <legend class="text-[11px] font-bold mb-1">
          Primary
        </legend>

        <ColorPickerPill v-for="color in primaryColors" :key="color" :color="color" :selected="primary" @select="primary = color" />
      </fieldset>

      <USeparator class="my-2" type="dashed" />

      <fieldset class="grid grid-cols-5 gap-px">
        <legend class="text-[11px] font-bold mb-1">
          Neutral
        </legend>

        <ColorPickerPill v-for="color in neutralColors" :key="color" :color="color" :selected="neutral" @select="neutral = color" />
      </fieldset>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import colors from 'tailwindcss/colors'
import { omit } from '#ui/utils'

const appConfig = useAppConfig()

// Computed

const neutralColors = ['slate', 'gray', 'zinc', 'neutral', 'stone']
const neutral = computed({
  get() {
    return appConfig.ui.colors.neutral
  },
  set(option) {
    appConfig.ui.colors.neutral = option
    window.localStorage.setItem('nuxt-ui-neutral', appConfig.ui.colors.neutral)
  }
})

const colorsToOmit = ['inherit', 'current', 'transparent', 'black', 'white', ...neutralColors]
const primaryColors = Object.keys(omit(colors, colorsToOmit as any))
const primary = computed({
  get() {
    return appConfig.ui.colors.primary
  },
  set(option) {
    appConfig.ui.colors.primary = option
    window.localStorage.setItem('nuxt-ui-primary', appConfig.ui.colors.primary)
  }
})
</script>
