<template>
  <header class="sticky top-0 z-50 w-full backdrop-blur flex-none border-b border-gray-900/10 dark:border-gray-50/[0.06] bg-white/75 dark:bg-gray-900/75">
    <UContainer>
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="flex items-end gap-1.5 font-bold text-xl text-gray-900 dark:text-white">
            <Logo class="w-8 h-8 text-primary-500 dark:text-primary-400" />

            NuxtLabs<span class="text-primary-500 dark:text-primary-400">UI</span>
          </NuxtLink>
        </div>

        <div class="flex items-center -mr-1.5">
          <div class="mr-1.5 hidden lg:block">
            <ThemeSelect />
          </div>

          <UButton
            color="gray"
            variant="ghost"
            class="lg:hidden"
            icon="i-heroicons-magnifying-glass-20-solid"
            @click="openDocsSearch"
          />

          <ClientOnly>
            <UButton
              :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'"
              color="gray"
              variant="ghost"
              aria-label="Theme"
              @click="isDark = !isDark"
            />

            <template #fallback>
              <div class="w-8 h-8" />
            </template>
          </ClientOnly>

          <UButton
            to="https://github.com/nuxtlabs/ui"
            target="_blank"
            color="gray"
            variant="ghost"
            icon="i-simple-icons-github"
          />

          <UButton
            color="gray"
            variant="ghost"
            class="lg:hidden"
            icon="i-heroicons-bars-3-20-solid"
            @click="isDialogOpen = true"
          />
        </div>
      </div>
    </UContainer>

    <TransitionRoot :show="isDialogOpen" as="template">
      <Dialog as="div" @close="isDialogOpen = false">
        <DialogPanel class="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-gray-900 lg:hidden">
          <div class="px-4 sm:px-6 sticky top-0 border-b border-gray-900/10 dark:border-gray-50/[0.06] bg-white/75 dark:bg-gray-900/75 backdrop-blur z-10">
            <div class="flex items-center justify-between h-16">
              <div class="flex items-center gap-3">
                <NuxtLink to="/" class="flex items-end gap-2 font-bold text-xl text-gray-900 dark:text-white">
                  <Logo class="w-8 h-8 text-primary-500 dark:text-primary-400" />

                  nuxthq/ui
                </NuxtLink>
              </div>

              <div class="flex -mr-1.5">
                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-x-mark-20-solid"
                  @click="isDialogOpen = false"
                />
              </div>
            </div>
          </div>
          <div class="px-4 sm:px-6 py-4 sm:py-6">
            <ThemeSelect class="mb-4 sm:mb-6 w-full" />

            <DocsAsideLinks @click="isDialogOpen = false" />
          </div>
        </DialogPanel>
      </Dialog>
    </TransitionRoot>
  </header>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, TransitionRoot } from '@headlessui/vue'

const { isSearchModalOpen } = useDocs()
const colorMode = useColorMode()

const isDialogOpen = ref(false)

const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

function openDocsSearch () {
  isDialogOpen.value = false

  setTimeout(() => {
    isSearchModalOpen.value = true
  }, 100)
}
</script>
