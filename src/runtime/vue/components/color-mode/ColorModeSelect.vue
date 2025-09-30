<script lang="ts">
import type { SelectMenuProps } from '../../../types'

export interface ColorModeSelectProps extends /** @vue-ignore */ Pick<SelectMenuProps<any>, 'color' | 'variant' | 'size' | 'trailingIcon' | 'selectedIcon' | 'content' | 'arrow' | 'portal' | 'disabled' | 'ui'> {
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig, useColorMode } from '#imports'
import { useLocale } from '../../../composables/useLocale'
import USelectMenu from '../../../components/SelectMenu.vue'

defineOptions({ inheritAttrs: false })

defineProps<ColorModeSelectProps>()

const { t } = useLocale()
const colorMode = useColorMode()
const appConfig = useAppConfig()

const items = computed(() => [
  { label: t('colorMode.system'), value: 'system', icon: appConfig.ui.icons.system },
  { label: t('colorMode.light'), value: 'light', icon: appConfig.ui.icons.light },
  { label: t('colorMode.dark'), value: 'dark', icon: appConfig.ui.icons.dark }
])

const preference = computed({
  get() {
    return items.value.find(option => option.value === colorMode.preference) || items.value[0]
  },
  set(option) {
    colorMode.preference = option!.value
  }
})
</script>

<template>
  <USelectMenu
    v-model="preference"
    :icon="preference?.icon"
    :search-input="false"
    v-bind="$attrs"
    :items="items"
  />
</template>
