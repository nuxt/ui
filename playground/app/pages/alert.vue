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
  description: 'You can add components to your app using the cli.',
  icon: 'i-heroicons-command-line',
  close: true
}
</script>

<template>
  <div class="flex flex-col gap-4 flex-1 items-center">
    <div class="flex flex-col gap-2 w-96">
      <UAlert :title="data.title" />
      <UAlert :title="data.title" :icon="data.icon" />
      <UAlert :title="data.title" :icon="data.icon" :close="data.close" />
      <UAlert :title="data.title" :icon="data.icon" :close="data.close" :actions="actions('primary')" />
      <UAlert :title="data.title" :icon="data.icon" :close="data.close" :description="data.description" />
      <UAlert :title="data.title" :avatar="{ src: 'https://avatars.githubusercontent.com/u/739984?v=4' }" :close="data.close" :description="data.description" />
    </div>

    <div class="flex items-center gap-2">
      <UAlert
        v-for="variant in variants"
        :key="variant"
        v-bind="data"
        :actions="actions('gray')"
        :variant="variant"
      />
    </div>
    <div class="flex items-center gap-2">
      <UAlert
        v-for="variant in variants"
        :key="variant"
        v-bind="data"
        :actions="actions('primary')"
        color="gray"
        :variant="variant"
      />
    </div>
  </div>
</template>
