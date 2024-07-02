<script setup lang="ts">
import { LazySlideoverProgrammaticExample } from '#components'

const open = ref(false)
const count = ref(0)

const slideover = useSlideover()

function openSlideover() {
  count.value++

  slideover.open(LazySlideoverProgrammaticExample, {
    description: 'And you can even provide a description!',
    count: count.value
  })
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <USlideover title="First slideover">
      <UButton color="white" label="Open with nested" />

      <template #body>
        <Placeholder class="h-full w-full" />
      </template>

      <template #footer>
        <USlideover title="Second slideover">
          <UButton label="Open second" />
        </USlideover>
      </template>
    </USlideover>

    <USlideover title="Slideover on left side" description="This slideover has `side: 'left'` prop." side="left">
      <UButton label="Open on left" color="gray" />

      <template #body>
        <Placeholder class="h-full w-full" />
      </template>
    </USlideover>

    <USlideover title="Slideover on top side" description="This slideover has `side: 'top'` prop." side="top">
      <UButton label="Open on top" color="white" />

      <template #body>
        <Placeholder class="h-48 w-full" />
      </template>
    </USlideover>

    <USlideover title="Slideover on bottom side" description="This slideover has `side: 'bottom'` prop." side="bottom">
      <UButton label="Open on bottom" color="gray" />

      <template #body>
        <Placeholder class="h-48 w-full" />
      </template>
    </USlideover>

    <USlideover v-model:open="open" title="Slideover with v-model" description="This is useful to control the state yourself.">
      <template #body>
        <Placeholder class="h-full w-full" />
      </template>
    </USlideover>

    <UButton label="Open with v-model" color="white" @click="open = true" />

    <USlideover title="Slideover without overlay" description="This slideover has `overlay: false` prop." :overlay="false">
      <UButton label="Open without overlay" color="gray" />

      <template #body>
        <Placeholder class="h-full w-full" />
      </template>
    </USlideover>

    <USlideover title="Slideover without modal & overlay" description="This slideover has `modal: false` and `overlay: false` to interact with outside content." :overlay="false" :modal="false">
      <UButton label="Open without modal" color="white" />

      <template #body>
        <Placeholder class="h-full w-full" />
      </template>
    </USlideover>

    <USlideover title="Slideover without transition" description="This slideover has `transition: false` prop." :transition="false">
      <UButton label="Open without transition" color="gray" />

      <template #body>
        <Placeholder class="h-full w-full" />
      </template>
    </USlideover>

    <USlideover title="Slideover without portal" description="This slideover has `portal: false` prop." :portal="false">
      <UButton label="Open without portal" color="white" />

      <template #body>
        <Placeholder class="h-full w-full" />
      </template>
    </USlideover>

    <USlideover title="Slideover prevent close" description="This slideover has `prevent-close: true` prop so it won't close when clicking outside." prevent-close>
      <UButton label="Open unclosable" color="gray" />

      <template #body>
        <Placeholder class="h-full w-full" />
      </template>
    </USlideover>

    <USlideover title="Slideover without close button" description="This slideover has `close: false` prop." :close="false">
      <UButton label="Open without close button" color="white" />

      <template #body>
        <Placeholder class="h-full w-full" />
      </template>
    </USlideover>

    <USlideover title="Slideover with custom close button" description="The `close` prop inherits from the Button props." :close="{ color: 'primary', variant: 'solid', size: 'xs' }" :ui="{ close: 'top-3.5 rounded-full' }">
      <UButton label="Open with custom close button" color="gray" />

      <template #body>
        <Placeholder class="h-full w-full" />
      </template>
    </USlideover>

    <UButton label="Open programmatically" color="white" @click="openSlideover" />
  </div>
</template>
