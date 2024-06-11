<script setup lang="ts">
import { LazyModalProgrammaticExample } from '#components'

const open = ref(false)

const modal = useModal()
const count = ref(0)
const openModal = () => {
  count.value++
  modal.open(LazyModalProgrammaticExample, {
    description: 'And you can even provide a description !',
    count: count.value
  })
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <UModal title="First modal">
      <UButton color="white" label="Open with nested" />

      <template #footer>
        <UModal title="Second modal">
          <UButton label="Open second" />
        </UModal>
      </template>
    </UModal>

    <UModal v-model:open="open" title="Modal with v-model" description="This can be useful to control the state of the modal yourself." />

    <UButton label="Open with v-model" color="gray" @click="open = true" />

    <UModal title="Modal without overlay" description="This modal has `overlay: false` prop." :overlay="false">
      <UButton label="Open without overlay" color="white" />
    </UModal>

    <UModal title="Modal without modal & overlay" description="This modal has `modal: false` and `overlay: false` to interact with outside content." :overlay="false" :modal="false">
      <UButton label="Open without modal" color="gray" />
    </UModal>

    <UModal title="Modal without transition" description="This modal has `transition: false` prop." :transition="false">
      <UButton label="Open without transition" color="white" />
    </UModal>

    <UModal title="Modal without portal" description="This modal has `portal: false` prop." :portal="false">
      <UButton label="Open without portal" color="gray" />
    </UModal>

    <UModal title="Modal fullscreen" description="This modal has `fullscreen: true` prop." fullscreen>
      <UButton label="Open fullscreen" color="white" />
    </UModal>

    <UModal title="Modal prevent close" description="This modal has `prevent-close: true` prop so it won't close when clicking outside." prevent-close>
      <UButton label="Open unclosable" color="gray" />
    </UModal>

    <UModal title="Modal without close button" description="This modal has `close: false` prop." :close="false">
      <UButton label="Open without close button" color="white" />
    </UModal>

    <UModal title="Modal with custom close button" description="The `close` prop inherits from the Button props." :close="{ color: 'primary', variant: 'solid', size: 'xs' }" :ui="{ close: 'top-3.5 rounded-full' }">
      <UButton label="Open with custom close button" color="gray" />
    </UModal>

    <UButton label="Open programmatically" color="white" @click="openModal" />
  </div>
</template>
