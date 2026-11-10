<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import theme from '#build/ui/slideover'

const LazySlideoverExample = defineAsyncComponent(() => import('../../components/SlideoverExample.vue'))

const sides = Object.keys(theme.variants.side)

const open = ref(false)
const inset = ref(false)
const side = ref<any>('right')
const count = ref(0)
const overlay = useOverlay()

const slideover = overlay.create(LazySlideoverExample, {
  props: {
    count: count.value
  }
})

function openSlideover() {
  count.value++

  slideover.open({ count: count.value })
}
</script>

<template>
  <Navbar>
    <USwitch v-model="inset" label="Inset" />
    <USelect v-model="side" :items="sides" class="w-32" />
  </Navbar>

  <div class="flex flex-col gap-2 min-h-0">
    <USlideover title="First slideover" :side="side" :inset="inset">
      <UButton color="neutral" variant="outline" label="Open with nested" />

      <template #body>
        <Placeholder class="size-full" />
      </template>

      <template #footer>
        <USlideover title="Second slideover" :side="side" :inset="inset">
          <UButton label="Open second" />
        </USlideover>
      </template>
    </USlideover>

    <USlideover v-model:open="open" title="Slideover with v-model" description="This is useful to control the state yourself." :side="side" :inset="inset">
      <template #body>
        <Placeholder class="size-full" />
      </template>
    </USlideover>

    <UButton label="Open with v-model" color="neutral" variant="outline" @click="open = true" />

    <USlideover title="Slideover without overlay" description="This slideover has `overlay: false` prop." :overlay="false" :side="side" :inset="inset">
      <UButton label="Open without overlay" color="neutral" variant="subtle" />

      <template #body>
        <Placeholder class="size-full" />
      </template>
    </USlideover>

    <USlideover
      title="Slideover without modal & overlay"
      description="This slideover has `modal: false` and `overlay: false` to interact with outside content."
      :overlay="false"
      :modal="false"
      :side="side"
      :inset="inset"
    >
      <UButton label="Open without modal" color="neutral" variant="outline" />

      <template #body>
        <Placeholder class="size-full" />
      </template>
    </USlideover>

    <USlideover title="Slideover without transition" description="This slideover has `transition: false` prop." :transition="false" :side="side" :inset="inset">
      <UButton label="Open without transition" color="neutral" variant="subtle" />

      <template #body>
        <Placeholder class="size-full" />
      </template>
    </USlideover>

    <USlideover title="Slideover without portal" description="This slideover has `portal: false` prop." :portal="false" :side="side" :inset="inset">
      <UButton label="Open without portal" color="neutral" variant="outline" />

      <template #body>
        <Placeholder class="size-full" />
      </template>
    </USlideover>

    <USlideover
      title="Slideover prevent close"
      description="This slideover has `dismissible: false` prop so it won't close when clicking outside."
      :dismissible="false"
      :modal="false"
      :overlay="false"
      :side="side"
      :inset="inset"
    >
      <UButton label="Open unclosable" color="neutral" variant="subtle" />

      <template #body>
        <Placeholder class="size-full" />
      </template>
    </USlideover>

    <USlideover title="Slideover without close button" description="This slideover has `close: false` prop." :close="false" :side="side" :inset="inset">
      <UButton label="Open without close button" color="neutral" variant="outline" />

      <template #body>
        <Placeholder class="size-full" />
      </template>
    </USlideover>

    <USlideover
      title="Slideover with custom close button"
      description="The `close` prop inherits from the Button props."
      :close="{ color: 'primary', variant: 'solid', size: 'xs' }"
      :ui="{ close: 'top-3.5 rounded-full' }"
      :side="side"
      :inset="inset"
    >
      <UButton label="Open with custom close button" color="neutral" variant="subtle" />

      <template #body>
        <Placeholder class="size-full" />
      </template>
    </USlideover>

    <UButton label="Open programmatically" color="neutral" variant="outline" @click="openSlideover" />

    <USlideover title="Slideover with scoped slot close" description="This slideover has a scoped slot close that can be used to close the slideover from within the content." :side="side" :inset="inset">
      <UButton color="neutral" variant="subtle" label="Open with scoped slot close" />

      <template #header="{ close }">
        <UButton label="Close with scoped slot close" @click="close" />
      </template>

      <template #body="{ close }">
        <UButton label="Close with scoped slot close" @click="close" />
      </template>

      <template #footer="{ close }">
        <UButton label="Close with scoped slot close" @click="close" />
      </template>
    </USlideover>
  </div>
</template>
