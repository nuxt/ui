<template>
  <div>
    <nav class="sticky top-0 z-10 w-full backdrop-blur flex-none border-b border-gray-900/10 dark:border-gray-50/[0.06] bg-white/75 dark:bg-gray-900/75">
      <UContainer>
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <NuxtLink to="/" class="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white">
              <Logo class="w-6 h-6" />

              nuxthq/ui
            </NuxtLink>
          </div>

          <div class="flex items-center">
            <ThemeSelect class="mr-2" />

            <ColorScheme placeholder="" tag="div" class="w-[38px]">
              <UButton :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'" color="gray" variant="link" aria-label="Theme" @click="isDark = !isDark" />
            </ColorScheme>
            <UButton to="https://github.com/nuxtlabs/ui" target="_blank" color="gray" variant="link" icon="i-mdi-github" />
          </div>
        </div>
      </UContainer>
    </nav>

    <UContainer>
      <NuxtPage />
    </UContainer>

    <DocsSearch />

    <ClientOnly>
      <UNotifications />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const colorScheme = usePreferredColorScheme()
const colorMode = useColorMode()

// Computed

const href = computed(() => colorScheme.value === 'dark' ? '/icon-dark.svg' : '/icon-light.svg')
const color = computed(() => colorMode.value === 'dark' ? '#18181b' : 'white')

const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

// Head

useHead({
  title: '@nuxthq/ui',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' },
    { rel: 'icon', type: 'image/svg+xml', href }
  ],
  htmlAttrs: {
    lang: 'en'
  },
  bodyAttrs: {
    class: 'antialiased font-sans text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900'
  }
})
</script>
