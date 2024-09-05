<script lang="ts">
import type { ConfigProviderProps, TooltipProviderProps } from 'radix-vue'
import type { ToasterProps } from '../types'

export interface AppProps extends Omit<ConfigProviderProps, 'useId'> {
  tooltip?: TooltipProviderProps
  toaster?: ToasterProps | null
}

export interface AppSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { toRef, useId } from 'vue'
import { ConfigProvider, TooltipProvider, useForwardProps } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import UToaster from './Toaster.vue'
import UModalProvider from './ModalProvider.vue'
import USlideoverProvider from './SlideoverProvider.vue'

const props = defineProps<AppProps>()
defineSlots<AppSlots>()

const configProviderProps = useForwardProps(reactivePick(props, 'dir', 'scrollBody'))
const tooltipProps = toRef(() => props.tooltip)
const toasterProps = toRef(() => props.toaster)
</script>

<template>
  <ConfigProvider :use-id="() => useId() as string" v-bind="configProviderProps">
    <TooltipProvider v-bind="tooltipProps">
      <UToaster v-if="toaster !== null" v-bind="toasterProps">
        <slot />
      </UToaster>
    </TooltipProvider>

    <UModalProvider />
    <USlideoverProvider />
  </ConfigProvider>
</template>
