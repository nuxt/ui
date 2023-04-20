<template>
  <header class="sticky top-0 z-50 w-full backdrop-blur flex-none border-b border-gray-900/10 dark:border-gray-50/[0.06] bg-white/75 dark:bg-gray-900/75">
    <UContainer>
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="flex items-end gap-2 font-bold text-xl text-gray-900 dark:text-white">
            <Logo class="w-8 h-8 text-primary-500 dark:text-primary-400" />

            nuxthq/ui
          </NuxtLink>
        </div>

        <div class="flex items-center -mr-1.5">
          <div class="mr-1.5 hidden lg:block">
            <ThemeSelect />
          </div>

          <UButton
            color="gray"
            variant="ghost"
            class="[&>span]:!w-5 [&>span]:!h-5 !p-1.5 lg:hidden"
            icon="i-heroicons-magnifying-glass-20-solid"
            size="sm"
            @click="openDocsSearch"
          />

          <!-- @ts-ignore -->
          <ColorScheme class="w-[32px]">
            <UButton
              :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'"
              color="gray"
              variant="ghost"
              aria-label="Theme"
              size="sm"
              @click="isDark = !isDark"
            />
          </ColorScheme>
          <UButton
            to="https://github.com/nuxtlabs/ui"
            target="_blank"
            color="gray"
            variant="ghost"
            icon="i-mdi-github"
            size="sm"
          />

          <UButton
            color="gray"
            variant="ghost"
            class="[&>span]:!w-5 [&>span]:!h-5 !p-1.5 lg:hidden"
            icon="i-heroicons-bars-3-20-solid"
            size="sm"
            @click="isDialogOpen = true"
          />
        </div>
      </div>

      <TransitionRoot :show="isDialogOpen" as="template">
        <Dialog as="div" @close="isDialogOpen = false">
          <DialogPanel class="fixed inset-0 z-10 overflow-y-auto bg-white dark:bg-gray-900 px-4 sm:px-6 lg:hidden">
            <div class="flex h-16 items-center justify-between">
              <div class="flex">
                <NuxtLink to="/" class="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white">
                  <Logo class="w-6 h-6" />

                  nuxthq/ui
                </NuxtLink>
              </div>
              <div class="flex -mr-1.5">
                <UButton
                  color="gray"
                  variant="ghost"
                  class="[&>span]:!w-5 [&>span]:!h-5 !p-1.5"
                  icon="i-heroicons-x-mark-20-solid"
                  size="sm"
                  @click="isDialogOpen = false"
                />
              </div>
            </div>
            <div class="pb-8">
              <ThemeSelect class="mb-6 w-full" />

              <DocsAsideLinks @click="isDialogOpen = false" />
            </div>
          </DialogPanel>
        </Dialog>
      </TransitionRoot>
    </UContainer>
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
