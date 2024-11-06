<script setup lang="ts">
import theme from '#build/ui/alert'

const variants = Object.keys(theme.variants.variant) as Array<keyof typeof theme.variants.variant>

const actions = (color: string) => [{
  label: 'Action',
  color: color as any,
  click() {
    console.log('Action clicked')
  }
}]

const data = {
  title: 'Heads up!',
  description: 'You can change the primary color in your app config.',
  icon: 'i-lucide-terminal',
  close: true
}
</script>

<template>
  <div class="flex flex-col gap-4 flex-1 items-center">
    <div class="flex flex-col gap-2 w-96">
      <UAlert :title="data.title" />
      <UAlert :title="data.title" :icon="data.icon" />
      <UAlert :title="data.title" :icon="data.icon" :close="data.close" />
      <UAlert :title="data.title" :icon="data.icon" :close="data.close" :actions="actions('neutral')" />
      <UAlert :title="data.title" :icon="data.icon" :close="data.close" :description="data.description" />
      <UAlert :title="data.title" :avatar="{ src: 'https://github.com/benjamincanac.png' }" :close="data.close" :description="data.description" />
    </div>

    <div class="flex items-center gap-2">
      <UAlert
        v-for="variant in variants"
        :key="variant"
        v-bind="data"
        :actions="actions('neutral')"
        :variant="variant"
      />
    </div>
    <div class="flex items-center gap-2">
      <UAlert
        v-for="variant in variants"
        :key="variant"
        v-bind="data"
        :actions="actions('primary')"
        color="neutral"
        :variant="variant"
      />
    </div>
  </div>
</template>
