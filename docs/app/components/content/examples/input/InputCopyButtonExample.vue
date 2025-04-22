<script setup lang="ts">
const value = ref('npx nuxi module add ui')
const copied = ref(false)

function copy() {
  navigator.clipboard.writeText(value.value)
  copied.value = true

  setTimeout(() => {
    copied.value = false
  }, 2000)
}
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
          @click="copy"
        />
      </UTooltip>
    </template>
  </UInput>
</template>
