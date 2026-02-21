<script setup>
const toast = useToast()

function showToast() {
  toast.add({
    title: 'Toast displayed!',
    description: 'This toast was triggered from the drawer.',
    color: 'success',
    icon: 'i-lucide-check-circle'
  })
}
</script>

<template>
  <UApp>
    <div class="flex items-center justify-center min-h-screen">
      <UDrawer title="Drawer with Overlay" description="Bug repro: touch only">
        <UButton label="Open Drawer" color="primary" />

        <template #body>
          <div class="flex flex-col items-center gap-4 py-4">
            <p class="text-center text-muted">
              Steps to reproduce (touch only):
            </p>
            <ol class="text-sm text-muted list-decimal list-inside space-y-1">
              <li>Open the drawer</li>
              <li>Tap the toast button to close toast</li>
              <li>Tap the toast button again → Drawer closes (bug)</li>
            </ol>
            <UButton
              label="Show Toast"
              color="success"
              icon="i-lucide-bell"
              @click="showToast"
            />
          </div>
        </template>
      </UDrawer>
    </div>
  </UApp>
</template>
