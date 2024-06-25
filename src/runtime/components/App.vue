<script lang="ts">
import type { ConfigProviderProps, TooltipProviderProps } from 'radix-vue'
import type { ToasterProps } from '../types'

export interface ProviderProps extends ConfigProviderProps {
  tooltip?: TooltipProviderProps
  toaster?: ToasterProps | null
}
</script>

<script setup lang="ts">
import { toRef } from 'vue'
import { ConfigProvider, TooltipProvider, useForwardProps } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { useId } from '#imports'
import { UToaster, UModalProvider, USlideoverProvider } from '#components'

const props = withDefaults(defineProps<ProviderProps>(), {
  useId: () => useId()
})

const configProviderProps = useForwardProps(reactivePick(props, 'dir', 'scrollBody', 'useId'))
const tooltipProps = toRef(() => props.tooltip)
const toasterProps = toRef(() => props.toaster)
</script>

<template>
  <ConfigProvider v-bind="configProviderProps">
    <TooltipProvider v-bind="tooltipProps">
      <UToaster v-if="toaster !== null" v-bind="toasterProps">
        <slot />
      </UToaster>
    </TooltipProvider>

    <UModalProvider />
    <USlideoverProvider />
  </ConfigProvider>
</template>
