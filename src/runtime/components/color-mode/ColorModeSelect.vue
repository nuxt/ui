<script lang="ts">
import type { SelectMenuProps, SelectMenuItem } from '../../types'

export interface ColorModeSelectProps extends Omit<SelectMenuProps<SelectMenuItem[]>, 'icon' | 'items' | 'modelValue'> {
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useForwardProps } from 'reka-ui'
import { useColorMode, useAppConfig } from '#imports'
import { useLocale } from '../../composables/useLocale'
import USelectMenu from '../SelectMenu.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ColorModeSelectProps>(), {
  searchInput: false
})

const { t } = useLocale()
const colorMode = useColorMode()
const appConfig = useAppConfig()

const selectMenuProps = useForwardProps(props)

const items = computed(() => [
  { label: t('colorMode.system'), value: 'system', icon: appConfig.ui.icons.system },
  { label: t('colorMode.light'), value: 'light', icon: appConfig.ui.icons.light },
  { label: t('colorMode.dark'), value: 'dark', icon: appConfig.ui.icons.dark }
])

const preference = computed({
  get() {
    return items.value.find(option => option.value === colorMode.preference) || items.value[0]!
  },
  set(option) {
    colorMode.preference = option!.value
  }
})
</script>

<template>
  <ClientOnly v-if="!colorMode?.forced">
    <USelectMenu
      v-model="preference"
      :icon="preference?.icon"
      v-bind="{ ...(selectMenuProps as any), ...$attrs }"
      :items="items"
    />

    <template #fallback>
      <USelectMenu
        :icon="items[0]?.icon"
        :model-value="items[0]"
        v-bind="{ ...(selectMenuProps as any), ...$attrs }"
        :items="items"
        disabled
      />
    </template>
  </ClientOnly>
</template>
