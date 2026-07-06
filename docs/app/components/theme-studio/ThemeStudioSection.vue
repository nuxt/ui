<script setup lang="ts">
/** One settings section: a fieldset card whose legend chip is the trigger. */
defineProps<{
  label: string
  /** Docs page the legend's help icon links to */
  helpTo?: string
}>()

const open = defineModel<boolean>('open', { default: true })
</script>

<template>
  <UCollapsible v-model:open="open" as="fieldset" :unmount-on-hide="false" class="rounded-md ring ring-default bg-default p-2.5">
    <template #default="{ open: isOpen }">
      <legend class="bg-default select-none flex items-center gap-1 cursor-pointer">
        <UButton
          :label="label"
          color="neutral"
          variant="ghost"
          size="xs"
          trailing-icon="i-lucide-chevron-down"
          class="font-semibold"
          :ui="{ trailingIcon: ['size-3 text-dimmed transition-transform duration-200', !isOpen && '-rotate-90'] }"
        />

        <UButton
          v-if="helpTo"
          :to="helpTo"
          size="xs"
          color="neutral"
          variant="ghost"
          icon="i-lucide-help-circle"
          :ui="{ leadingIcon: 'size-3' }"
          @click.stop
        />
      </legend>
    </template>
    <template #content>
      <slot />
    </template>
  </UCollapsible>
</template>
