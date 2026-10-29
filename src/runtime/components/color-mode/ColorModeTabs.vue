<script lang="ts">
import type { TabsProps } from '../Tabs.vue'

export interface ColorModeTabsProps extends Omit<TabsProps, 'items' | 'modelValue' | 'defaultValue' | 'content' | 'valueKey' | 'labelKey' | 'unmountOnHide' | 'color'> {
  /**
   * @defaultValue 'neutral'
   */
  color?: TabsProps['color']
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useMounted } from '@vueuse/core'
import { useColorMode } from '#imports'
import { useComponentProps, useThemeConfig } from '../../composables/useComponentProps'
import { useForwardProps } from '../../composables/useForwardProps'
import { useLocale } from '../../composables/useLocale'
import UTabs from '../Tabs.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<ColorModeTabsProps>(), {
  color: 'neutral'
})

const props = useComponentProps('tabs', _props)

const { t } = useLocale()
const colorMode = useColorMode()
const appConfig = useThemeConfig()

const tabsProps = useForwardProps(props)

// The preference is only known on the client, so the selected tab matches the server until mounted.
const mounted = useMounted()

const items = computed(() => [
  { label: t('colorMode.system'), value: 'system', icon: appConfig.ui.icons.system },
  { label: t('colorMode.light'), value: 'light', icon: appConfig.ui.icons.light },
  { label: t('colorMode.dark'), value: 'dark', icon: appConfig.ui.icons.dark }
])

const preference = computed({
  get() {
    return mounted.value ? colorMode.preference : 'system'
  },
  set(value: string | number) {
    colorMode.preference = String(value)
  }
})
</script>

<template>
  <UTabs
    v-if="!colorMode?.forced"
    v-model="preference"
    v-bind="{ ...tabsProps, ...$attrs }"
    :items="items"
    :content="false"
  />
</template>
