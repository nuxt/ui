<script setup lang="ts">
const streaming = ref(false)

async function simulateStreaming() {
  streaming.value = true
  await new Promise(resolve => setTimeout(resolve, 3000))
  streaming.value = false
}
</script>

<template>
  <Navbar>
    <UButton label="Simulate streaming" color="neutral" variant="outline" @click="simulateStreaming" />
  </Navbar>

  <div class="w-80 flex flex-col gap-4 items-start">
    <UChatTool
      text="Searched components"
      icon="i-lucide-search"
    />

    <UChatTool
      text="Reading component"
      suffix="Button"
      icon="i-lucide-file-text"
    />

    <UChatTool
      :text="streaming ? 'Searching components...' : 'Searched components'"
      icon="i-lucide-search"
      :loading="streaming"
      :streaming="streaming"
    />

    <UChatTool
      text="Searched components"
      icon="i-lucide-search"
      chevron="leading"
    >
      <div class="text-sm text-muted">
        Found 5 matching components.
      </div>
    </UChatTool>

    <UChatTool
      text="Searched components"
      icon="i-lucide-search"
      variant="card"
    >
      <div class="text-sm text-muted">
        Found 5 matching components.
      </div>
    </UChatTool>
  </div>
</template>
