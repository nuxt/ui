<script setup lang="ts">
const value = ref('')
const maxLength = 15
</script>

<template>
  <UInput
    v-model="value"
    :maxlength="maxLength"
    aria-describedby="character-count"
    :ui="{ trailing: 'pointer-events-none' }"
  >
    <template #trailing>
      <div
        id="character-count"
        class="text-xs text-[var(--ui-text-muted)] tabular-nums"
        aria-live="polite"
        role="status"
      >
        {{ value?.length }}/{{ maxLength }}
      </div>
    </template>
  </UInput>
</template>
