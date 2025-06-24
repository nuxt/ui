<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const value = ref('npx nuxt module add ui')

const { copy, copied } = useClipboard()
</script>

<template>
  <UInput
    v-model="value"
    :ui="{ trailing: 'pr-0.5' }"
  >
    <template v-if="value?.length" #trailing>
      <UTooltip text="Copy to clipboard" :content="{ side: 'right' }">
        <UButton
          :color="copied ? 'success' : 'neutral'"
          variant="link"
          size="sm"
          :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
          aria-label="Copy to clipboard"
          @click="copy(value)"
        />
      </UTooltip>
    </template>
  </UInput>
</template>
