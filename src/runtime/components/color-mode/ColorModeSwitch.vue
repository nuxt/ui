<script lang="ts">
import type { SwitchProps } from '../../types'

export interface ColorModeSwitchProps extends Omit<SwitchProps, 'checkedIcon' | 'uncheckedIcon' | 'modelValue'> {
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useForwardProps } from 'reka-ui'
import { useColorMode, useAppConfig } from '#imports'
import { useLocale } from '../../composables/useLocale'
import USwitch from '../Switch.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<ColorModeSwitchProps>()

const { t } = useLocale()
const colorMode = useColorMode()
const appConfig = useAppConfig()

const switchProps = useForwardProps(props)

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
      v-bind="{
        ...switchProps,
        'aria-label': isDark ? t('colorMode.switchToLight') : t('colorMode.switchToDark'),
        ...$attrs
      }"
    />

    <template #fallback>
      <USwitch
        :checked-icon="appConfig.ui.icons.dark"
        :unchecked-icon="appConfig.ui.icons.light"
        v-bind="{
          ...switchProps,
          'aria-label': isDark ? t('colorMode.switchToLight') : t('colorMode.switchToDark'),
          ...$attrs
        }"
        disabled
      />
    </template>
  </ClientOnly>
</template>
