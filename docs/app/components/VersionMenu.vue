<script setup lang="ts">
const config = useRuntimeConfig().public
const { track } = useAnalytics()
const appConfig = useAppConfig()

const items = computed(() => {
  return [
    { label: `v${config.version}`, active: true, color: 'primary' as const, checked: true, type: 'checkbox' as const },
    {
      label: 'v3.x',
      to: 'https://ui3.nuxt.com',
      onSelect() {
        track('Version Switched', { version: 'v3.x' })
      }
    },
    {
      label: 'v2.x',
      to: 'https://ui2.nuxt.com',
      onSelect() {
        track('Version Switched', { version: 'v2.x' })
      }
    }
  ]
})
</script>

<template>
  <UDropdownMenu
    v-slot="{ open }"
    :modal="false"
    :items="items"
    :content="{ align: 'start' }"
    :ui="{ content: 'min-w-fit' }"
    size="xs"
  >
    <UButton
      :label="`v${config.version}`"
      variant="subtle"
      :trailing-icon="appConfig.ui.icons.chevronDown"
      size="xs"
      class="-mb-[6px] font-semibold rounded-full truncate"
      :class="[open && 'bg-primary/15']"
      :ui="{
        trailingIcon: ['transition-transform duration-200', open ? 'rotate-180' : undefined].filter(Boolean).join(' ')
      }"
    />
  </UDropdownMenu>
</template>
