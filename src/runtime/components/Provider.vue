<script lang="ts">
import type { ConfigProviderProps, ToastProviderProps, TooltipProviderProps } from 'radix-vue'

export interface ProviderProps extends ConfigProviderProps {
  tooltip?: TooltipProviderProps
  toast?: ToastProviderProps
}
</script>

<script setup lang="ts">
import { toRef } from 'vue'
import { ConfigProvider, ToastProvider, TooltipProvider, useForwardProps } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { useId } from '#imports'

const props = withDefaults(defineProps<ProviderProps>(), {
  useId: () => useId()
})

const configProps = useForwardProps(reactivePick(props, 'dir', 'scrollBody', 'useId'))
const tooltipProps = toRef(() => props.tooltip as TooltipProviderProps)
const toastProps = toRef(() => props.toast as ToastProviderProps)
</script>

<template>
  <ConfigProvider v-bind="configProps">
    <TooltipProvider v-bind="tooltipProps">
      <ToastProvider v-bind="toastProps">
        <slot />
      </ToastProvider>
    </TooltipProvider>
  </ConfigProvider>
</template>