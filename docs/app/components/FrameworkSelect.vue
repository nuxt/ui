<script setup lang="ts">
const { frameworks } = useSharedData()
</script>

<template>
  <UDropdownMenu
    v-slot="{ open }"
    :modal="false"
    :items="frameworks"
    :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      color="neutral"
      variant="outline"
      block
      trailing-icon="i-lucide-chevron-down"
      :class="[open && 'bg-[var(--ui-bg-elevated)]']"
      :ui="{
        trailingIcon: ['transition-transform duration-200', open ? 'rotate-180' : undefined].filter(Boolean).join(' ')
      }"
      class="-mx-2 w-[calc(100%+1rem)]"
    >
      <template #leading>
        <UIcon v-for="framework in frameworks" :key="framework.value" :name="framework.icon" :class="`${framework.value}-only`" class="shrink-0 size-5" />
      </template>

      <span v-for="framework in frameworks" :key="framework.value" :class="`${framework.value}-only`">
        {{ framework.label }}
      </span>
    </UButton>
  </UDropdownMenu>
</template>
