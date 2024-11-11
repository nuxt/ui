<script setup lang="ts">
const { data: countries, status, execute } = await useLazyFetch<{
  name: string
  code: string
  emoji: string
}[]>('/api/countries.json', {
  immediate: false,
  default: () => []
})

function onOpen() {
  if (!countries.value?.length) {
    execute()
  }
}
</script>

<template>
  <USelectMenu
    :items="countries"
    :loading="status === 'pending'"
    label-key="name"
    :search-input="{ icon: 'i-lucide-search' }"
    placeholder="Select country"
    class="w-48"
    @update:open="onOpen"
  >
    <template #leading="{ modelValue, ui }">
      <span v-if="modelValue" class="size-5 text-center">
        {{ modelValue?.emoji }}
      </span>
      <UIcon v-else name="i-lucide-earth" :class="ui.leadingIcon()" />
    </template>
    <template #item-leading="{ item }">
      <span class="size-5 text-center">
        {{ item.emoji }}
      </span>
    </template>
  </USelectMenu>
</template>
