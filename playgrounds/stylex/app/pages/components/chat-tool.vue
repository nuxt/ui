<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'
const pg = usePg()


const actions: ButtonProps[] = [
  { label: 'Approve', onClick: () => console.log('approve') },
  { label: 'Deny', color: 'neutral', variant: 'soft', onClick: () => console.log('deny') }
]
</script>

<template>
  <Navbar />

  <div :class="pg.w_72_flex_flex_col_gap_4_items_start">
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
      :class="pg.w_full"
    >
      Found 5 matching components.
    </UChatTool>

    <UChatTool
      text="Run terminal command"
      suffix="pnpm run lint"
      icon="i-lucide-terminal"
      variant="card"
      chevron="leading"
      :class="pg.w_full"
      :actions="actions"
    >
      <pre :class="pg.whitespace_pre_wrap">$ pnpm run lint</pre>
    </UChatTool>
  </div>
</template>
