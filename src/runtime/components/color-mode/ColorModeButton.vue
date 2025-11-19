<script lang="ts">
import type { ButtonProps } from '../../types'

export interface ColorModeButtonProps extends Omit<ButtonProps, 'color' | 'variant'> {
  /**
   * @defaultValue 'neutral'
   */
  color?: ButtonProps['color']
  /**
   * @defaultValue 'ghost'
   */
  variant?: ButtonProps['variant']
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useForwardProps } from 'reka-ui'
import { reactiveOmit } from '@vueuse/core'
import { useColorMode, useAppConfig } from '#imports'
import { useLocale } from '../../composables/useLocale'
import UButton from '../Button.vue'
import UIcon from '../Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ColorModeButtonProps>(), {
  color: 'neutral',
  variant: 'ghost'
})

const { t } = useLocale()
const colorMode = useColorMode()
const appConfig = useAppConfig()

const buttonProps = useForwardProps(reactiveOmit(props, 'icon'))

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
  <UButton
    v-bind="{
      ...buttonProps,
      'aria-label': isDark ? t('colorMode.switchToLight') : t('colorMode.switchToDark'),
      ...$attrs
    }"
    @click="isDark = !isDark"
  >
    <template #leading="{ ui }">
      <UIcon :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" class="hidden dark:inline" :name="appConfig.ui.icons.dark" />
      <UIcon :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" class="inline dark:hidden" :name="appConfig.ui.icons.light" />
    </template>
  </UButton>
</template>
