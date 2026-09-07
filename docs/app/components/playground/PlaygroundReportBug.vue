<script setup lang="ts">
const toast = useToast()
const studioIcons = useStudioIcons()

const severities = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' }
]

const components = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'API', value: 'api' },
  { label: 'Billing', value: 'billing' }
]

const title = ref('')
const severity = ref('medium')
const component = ref('dashboard')
const steps = ref('')
</script>

<template>
  <div>
    <div class="p-4 space-y-4">
      <div>
        <p class="font-semibold text-highlighted">
          Report a bug
        </p>
        <p class="text-sm text-muted">
          Help us fix issues faster.
        </p>
      </div>

      <UFormField label="Title">
        <UInput v-model="title" placeholder="Brief description of the issue" class="w-full" />
      </UFormField>

      <div class="grid grid-cols-2 gap-3">
        <UFormField label="Severity">
          <USelect v-model="severity" :items="severities" class="w-full" />
        </UFormField>
        <UFormField label="Component">
          <USelect v-model="component" :items="components" class="w-full" />
        </UFormField>
      </div>

      <UFormField label="Steps to reproduce">
        <UTextarea v-model="steps" :rows="3" placeholder="1. Go to… 2. Click on… 3. See error" class="w-full" />
      </UFormField>
    </div>

    <div class="flex items-center justify-between border-t border-default p-3">
      <UButton label="Attach file" :icon="studioIcons.paperclip" color="neutral" variant="ghost" />
      <UButton label="Submit bug" @click="toast.add({ title: 'Bug reported' })" />
    </div>
  </div>
</template>
