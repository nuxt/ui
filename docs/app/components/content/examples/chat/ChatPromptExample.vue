<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui'

const input = ref('')
const model = ref('opus-5-5')

const models = [
  { label: 'Opus 5.5', value: 'opus-5-5', icon: 'i-simple-icons-anthropic' },
  { label: 'Sonnet 5.5', value: 'sonnet-5-5', icon: 'i-simple-icons-anthropic' },
  { label: 'Haiku 5.5', value: 'haiku-5-5', icon: 'i-simple-icons-anthropic' }
] satisfies SelectItem[]

function onSubmit() {
  input.value = ''
}
</script>

<template>
  <UChatPrompt v-model="input" :autofocus="false" class="w-full" @submit="onSubmit">
    <template #footer>
      <UButton icon="i-lucide-plus" color="neutral" variant="ghost" size="sm" />

      <div class="flex items-center gap-1.5">
        <USelect
          v-model="model"
          :items="models"
          :icon="models.find(item => item.value === model)?.icon"
          placeholder="Select a model"
          variant="ghost"
          size="sm"
          square
        />

        <UChatPromptSubmit size="sm" />
      </div>
    </template>
  </UChatPrompt>
</template>
