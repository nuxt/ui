<script lang="ts">
import type { SwitchProps } from '@nuxt/ui'

export interface ColorModeSwitchProps extends /** @vue-ignore */ Pick<SwitchProps, 'as' | 'color' | 'size' | 'disabled' | 'ui'> {
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useColorMode, useAppConfig } from '#imports'
import { useLocale } from '../../composables/useLocale'
import USwitch from '../Switch.vue'

defineOptions({ inheritAttrs: false })

defineProps<ColorModeSwitchProps>()

const { t } = useLocale()
const colorMode = useColorMode()
const appConfig = useAppConfig()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark: boolean) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})
</script>

<template>
  <ClientOnly v-if="!colorMode?.forced">
    <USwitch
      v-model="isDark"
      :checked-icon="appConfig.ui.icons.dark"
      :unchecked-icon="appConfig.ui.icons.light"
      :aria-label="isDark ? t('colorMode.switchToLight') : t('colorMode.switchToDark')"
      v-bind="$attrs"
    />

    <template #fallback>
      <USwitch
        :checked-icon="appConfig.ui.icons.dark"
        :unchecked-icon="appConfig.ui.icons.light"
        :aria-label="isDark ? t('colorMode.switchToLight') : t('colorMode.switchToDark')"
        v-bind="$attrs"
        disabled
      />
    </template>
  </ClientOnly>
</template>
