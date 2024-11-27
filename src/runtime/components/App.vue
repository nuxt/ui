<script lang="ts">
import type { ConfigProviderProps, TooltipProviderProps } from 'reka-ui'
import { localeContextInjectionKey } from '../composables/useLocale'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'
import type { ToasterProps, Locale } from '../types'

export interface AppProps extends Omit<ConfigProviderProps, 'useId' | 'dir' | 'locale'> {
  tooltip?: TooltipProviderProps
  toaster?: ToasterProps | null
  locale?: Locale
}

export interface AppSlots {
  default(props?: {}): any
}

export default {
  name: 'App'
}

extendDevtoolsMeta({ ignore: true })
</script>

<script setup lang="ts">
import { toRef, useId, provide } from 'vue'
import { ConfigProvider, TooltipProvider, useForwardProps } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import UToaster from './Toaster.vue'
import UModalProvider from './ModalProvider.vue'
import USlideoverProvider from './SlideoverProvider.vue'

const props = defineProps<AppProps>()
defineSlots<AppSlots>()

const configProviderProps = useForwardProps(reactivePick(props, 'scrollBody'))
const tooltipProps = toRef(() => props.tooltip)
const toasterProps = toRef(() => props.toaster)

const locale = toRef(() => props.locale)
provide(localeContextInjectionKey, locale)
</script>

<template>
  <ConfigProvider :use-id="() => (useId() as string)" :dir="locale?.dir" :locale="locale?.code" v-bind="configProviderProps">
    <TooltipProvider v-bind="tooltipProps">
      <UToaster v-if="toaster !== null" v-bind="toasterProps">
        <slot />
      </UToaster>
      <slot v-else />
    </TooltipProvider>

    <UModalProvider />
    <USlideoverProvider />
  </ConfigProvider>
</template>
