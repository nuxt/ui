<script setup lang="ts">
const { modules } = useSharedData()
</script>

<template>
  <UDropdownMenu
    v-slot="{ open }"
    :modal="false"
    :items="modules"
    :ui="{ content: 'w-(--radix-dropdown-menu-trigger-width)' }"
  >
    <UButton
      color="neutral"
      variant="outline"
      block
      trailing-icon="i-lucide-chevron-down"
      class="min-w-0"
      :class="[open && 'bg-[var(--ui-bg-elevated)]']"
      :ui="{
        trailingIcon: ['transition-transform duration-200', open ? 'rotate-180' : undefined].filter(Boolean).join(' ')
      }"
    >
      <template #leading>
        <UIcon v-for="module in modules" :key="module.value" :name="module.icon" :class="`${module.value}-only`" class="shrink-0 size-5" />
      </template>

      <span v-for="module in modules" :key="module.value" :class="`${module.value}-only`" class="truncate">
        {{ module.label }}
      </span>
    </UButton>
  </UDropdownMenu>
</template>
