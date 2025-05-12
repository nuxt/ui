<script lang="ts" setup>
const open = ref(false)
</script>

<template>
  <div class="relative">
    <UPopover v-model:open="open" :dismissible="false">
      <template #anchor>
        <UInput placeholder="Focus to open" @focus="open = true" @blur="open = false" />
      </template>

      <template #content>
        <Placeholder class="size-48 m-4 inline-flex" />
      </template>
    </UPopover>
  </div>
</template>
