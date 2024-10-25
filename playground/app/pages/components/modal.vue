<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const LazyModalExample = defineAsyncComponent(() => import('../../components/ModalExample.vue'))

const open = ref(false)
const count = ref(0)

const modal = useModal()

function openModal() {
  count.value++

  modal.open(LazyModalExample, {
    description: 'And you can even provide a description!',
    count: count.value
  })
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <UModal title="First modal">
      <UButton color="neutral" variant="outline" label="Open with nested" />

      <template #footer>
        <UModal title="Second modal">
          <UButton label="Open second" />
        </UModal>
      </template>
    </UModal>

    <UModal v-model:open="open" title="Modal with v-model" description="This can be useful to control the state of the modal yourself." />

    <UButton label="Open with v-model" color="neutral" variant="subtle" @click="open = true" />

    <UModal title="Modal without overlay" description="This modal has `overlay: false` prop." :overlay="false">
      <UButton label="Open without overlay" color="neutral" variant="outline" />
    </UModal>

    <UModal title="Modal without modal & overlay" description="This modal has `modal: false` and `overlay: false` to interact with outside content." :overlay="false" :modal="false">
      <UButton label="Open without modal" color="neutral" variant="subtle" />
    </UModal>

    <UModal title="Modal without transition" description="This modal has `transition: false` prop." :transition="false">
      <UButton label="Open without transition" color="neutral" variant="outline" />
    </UModal>

    <UModal title="Modal without portal" description="This modal has `portal: false` prop." :portal="false">
      <UButton label="Open without portal" color="neutral" variant="subtle" />
    </UModal>

    <UModal title="Modal fullscreen" description="This modal has `fullscreen: true` prop." fullscreen>
      <UButton label="Open fullscreen" color="neutral" variant="outline" />
    </UModal>

    <UModal title="Modal prevent close" description="This modal has `prevent-close: true` prop so it won't close when clicking outside." prevent-close>
      <UButton label="Open unclosable" color="neutral" variant="subtle" />
    </UModal>

    <UModal title="Modal without close button" description="This modal has `close: false` prop." :close="false">
      <UButton label="Open without close button" color="neutral" variant="outline" />
    </UModal>

    <UModal title="Modal with custom close button" description="The `close` prop inherits from the Button props." :close="{ color: 'primary', variant: 'solid', size: 'xs' }" :ui="{ close: 'top-3.5 rounded-full' }">
      <UButton label="Open with custom close button" color="neutral" variant="subtle" />
    </UModal>

    <UButton label="Open programmatically" color="neutral" variant="outline" @click="openModal" />
  </div>
</template>
