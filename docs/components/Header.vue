<template>
  <header class="sticky top-0 z-50 w-full backdrop-blur flex-none border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-gray-900/75">
    <UContainer>
      <HeaderLinks v-model="isDialogOpen" :links="links" />
    </UContainer>

    <TransitionRoot :show="isDialogOpen" as="template">
      <Dialog as="div" @close="isDialogOpen = false">
        <DialogPanel class="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-gray-900 lg:hidden">
          <div class="px-4 sm:px-6 sticky top-0 border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-gray-900/75 backdrop-blur z-10">
            <HeaderLinks v-model="isDialogOpen" :links="links" />
          </div>
          <div class="px-4 sm:px-6 py-4 sm:py-6">
            <DocsAsideLinks @click="isDialogOpen = false" />
          </div>
        </DialogPanel>
      </Dialog>
    </TransitionRoot>
  </header>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, TransitionRoot } from '@headlessui/vue'

const isDialogOpen = ref(false)

const links = [
  { label: 'Documentation', to: '/getting-started' },
  { label: 'Components', to: '/elements/avatar' },
  { label: 'Examples', to: '/examples' }
]
</script>
