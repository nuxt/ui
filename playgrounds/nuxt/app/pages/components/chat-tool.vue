<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const actions: ButtonProps[] = [
  { label: 'Approve', onClick: () => console.log('approve') },
  { label: 'Deny', color: 'neutral', variant: 'soft', onClick: () => console.log('deny') }
]
</script>

<template>
  <Navbar />

  <div class="w-72 flex flex-col gap-4 items-start">
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
      Found 5 matching components.
    </UChatTool>

    <UChatTool
      text="Searched components"
      icon="i-lucide-search"
      variant="card"
      class="w-full"
    >
      Found 5 matching components.
    </UChatTool>

    <UChatTool
      text="Run terminal command"
      suffix="pnpm run lint"
      icon="i-lucide-terminal"
      variant="card"
      chevron="leading"
      class="w-full"
      :actions="actions"
    >
      <pre class="whitespace-pre-wrap">$ pnpm run lint</pre>
    </UChatTool>
  </div>
</template>
