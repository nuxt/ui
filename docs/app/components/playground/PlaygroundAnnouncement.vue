<script setup lang="ts">
const appConfig = useAppConfig()
const toast = useToast()
</script>

<template>
  <div>
    <div class="p-4 flex items-start gap-3">
      <div class="flex items-center justify-center size-9 rounded-lg bg-elevated text-primary shrink-0">
        <UIcon name="i-lucide-radar" class="size-5" />
      </div>
      <div>
        <p class="font-semibold text-highlighted">
          Observability Plus
        </p>
        <p class="text-sm text-muted">
          A faster, natural-language way to explore your data. Monitoring moves to the Pro plan in 2026.
        </p>
      </div>
    </div>

    <div class="flex items-center justify-end gap-2 border-t border-default p-3">
      <UButton label="Dismiss" color="neutral" variant="ghost" />
      <UButton
        label="Learn more"
        color="neutral"
        variant="subtle"
        :trailing-icon="appConfig.ui.icons.arrowRight"
        @click="toast.add({ title: 'Observability Plus' })"
      />
    </div>
  </div>
</template>
