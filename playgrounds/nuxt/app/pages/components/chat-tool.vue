<script setup lang="ts">
</script>

<template>
  <Navbar />

  <div class="w-60 flex flex-col gap-4 items-start">
    <UChatTool
      text="Searched components"
      icon="i-lucide-search"
    />

    <UChatTool
      text="Reading component"
      suffix="Button"
      icon="i-lucide-file-text"
      streaming
    />

    <UChatTool
      text="Searching components..."
      icon="i-lucide-search"
      streaming
      loading
    />

    <UChatTool
      text="Searching components"
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
      class="w-full"
    >
      Found 5 matching components.
    </UChatTool>
  </div>
</template>
