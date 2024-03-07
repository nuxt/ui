<script setup lang="ts">
import { ConfigProvider, ToastProvider, TooltipProvider } from 'radix-vue'
import { useId } from '#imports'

const useIdFunction = () => useId()
</script>

<template>
  <ConfigProvider :use-id="useIdFunction">
    <TooltipProvider>
      <ToastProvider>
        <slot />
      </ToastProvider>
    </TooltipProvider>
  </ConfigProvider>
</template>