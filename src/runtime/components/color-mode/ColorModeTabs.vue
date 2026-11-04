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
import { usePrefix } from '../../composables/usePrefix'
import UTabs from '../Tabs.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<ColorModeTabsProps>(), {
  color: 'neutral'
})

const props = useComponentProps('tabs', _props)

const { t } = useLocale()
const colorMode = useColorMode()
const appConfig = useThemeConfig()
const prefix = usePrefix()

const tabsProps = useForwardProps(props)

// The icons carry the control, the labels are only read by assistive technologies.
// Each trigger pads its sides like its top and bottom so an icon alone sits in a
// square, and a shown label pads its end back to the width of a Tabs trigger.
// A replacer function on a slot takes it over, so it is passed as is.
const square = {
  xs: { trigger: 'px-1', label: 'pe-1' },
  sm: { trigger: 'px-1.5', label: 'pe-1' },
  md: { trigger: 'px-1.5', label: 'pe-1.5' },
  lg: { trigger: 'px-2', label: 'pe-1' },
  xl: { trigger: 'px-2', label: 'pe-1' }
}

const tabsUi = computed(() => {
  const { trigger, label } = props.ui ?? {}
  const size = square[props.size ?? 'md']
  return {
    ...props.ui,
    trigger: typeof trigger === 'function' ? trigger : [prefix(size.trigger), trigger],
    label: typeof label === 'function' ? label : [prefix(`sr-only ${size.label}`), label]
  }
})

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
    :ui="tabsUi"
    :content="false"
  />
</template>
