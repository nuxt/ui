<script setup lang="ts">
import theme from '#build/ui/alert'

const variants = Object.keys(theme.variants.variant) as Array<keyof typeof theme.variants.variant>

const actions = (variant?: string) => [{
  label: 'Action',
  color: (variant === 'solid' ? 'black' as const : 'primary' as const),
  click() {
    console.log('Action clicked')
  }
}]

const data = {
  title: 'Heads up!',
  description: 'You can add components to your app using the cli.',
  icon: 'i-heroicons-command-line',
  actions: actions(),
  close: true
}
</script>

<template>
  <div class="flex flex-col gap-2 flex-1">
    <UAlert :title="data.title" />
    <UAlert :title="data.title" :icon="data.icon" />
    <UAlert :title="data.title" :icon="data.icon" :close="data.close" />
    <UAlert :title="data.title" :icon="data.icon" :close="data.close" :actions="data.actions" />
    <UAlert :title="data.title" :icon="data.icon" :close="data.close" :description="data.description" />
    <UAlert :title="data.title" :avatar="{ src: 'https://avatars.githubusercontent.com/u/739984?v=4' }" :close="data.close" :description="data.description" />
    <UAlert v-bind="data" color="white" />
    <UAlert v-bind="data" color="gray" />
    <UAlert v-bind="data" color="black" />
    <UAlert
      v-for="variant in variants"
      :key="variant"
      v-bind="data"
      :actions="actions(variant)"
      color="primary"
      :variant="variant"
    />
  </div>
</template>
