<script lang="ts" setup>
const open = ref(false)
</script>

<template>
  <UPopover
    v-model:open="open"
    :dismissible="false"
    :ui="{ content: 'w-(--reka-popper-anchor-width) p-4' }"
  >
    <template #anchor>
      <UInput placeholder="Focus to open" @focus="open = true" @blur="open = false" />
    </template>

    <template #content>
      <Placeholder class="w-full aspect-square" />
    </template>
  </UPopover>
</template>
