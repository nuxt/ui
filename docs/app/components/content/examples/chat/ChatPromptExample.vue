<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui'

const input = ref('')
const model = ref('claude-opus-5.5')

const models = [
  { label: 'Claude Opus 5.5', value: 'claude-opus-5.5', icon: 'i-simple-icons-anthropic' },
  { label: 'Gemini 4 Argon', value: 'gemini-4-argon', icon: 'i-simple-icons-googlegemini' },
  { label: 'GPT-6 Astra', value: 'gpt-6-astra', icon: 'i-simple-icons-openai' }
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
