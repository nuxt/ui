<template>
  <div>
    <nav class="u-bg-white border-b u-border-gray-200 fixed top-0 inset-x-0 z-20">
      <UContainer padded>
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="block font-bold text-lg u-text-gray-900">
              @nuxthq/ui
            </NuxtLink>
          </div>

          <div class="flex items-center gap-3">
            <UButton variant="transparent" :icon="colorMode.value === 'dark' ? 'heroicons-outline:moon' : 'heroicons-outline:sun'" @click="toggleDark" />
            <UButton to="https://github.com/nuxtlabs/ui" target="_blank" variant="transparent" icon="fa-brands:github" />
          </div>
        </div>
      </UContainer>
    </nav>

    <UContainer class="mt-16">
      <div class="lg:grid lg:grid-cols-10 lg:gap-10 lg:relative">
        <aside class="lg:flex lg:flex-col lg:relative pb-8 lg:pb-0 lg:sticky lg:top-0 px-4 sm:px-6 lg:px-0 lg:pt-16 lg:-mt-16 lg:self-start lg:col-span-2 lg:overflow-hidden lg:sticky lg:h-screen">
          <nav class="overflow-y-auto h-auto pt-8 lg:py-12">
            <ul class="space-y-6">
              <li v-for="section of sections" :key="section">
                <h5 class="mb-3 uppercase tracking-wide font-semibold text-xs u-text-gray-900">
                  {{ section.label }}
                </h5>
                <ul class="space-y-1.5">
                  <li v-for="(link, index) of section.links" :key="index">
                    <ULink
                      :to="link.to"
                      class="relative block text-sm rounded-md"
                      active-class="text-primary-600"
                      inactive-class="u-text-gray-500 hover:u-text-gray-700"
                      exact
                    >
                      {{ link.label }}
                    </ULink>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </aside>

        <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-8 lg:py-12">
          <NuxtPage />
        </div>
      </div>
    </UContainer>

    <ClientOnly>
      <UNotifications />
    </ClientOnly>
  </div>
</template>

<script setup>
useMeta({
  bodyAttrs: {
    class: 'antialiased font-sans text-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 bg-white dark:bg-black'
  }
})

const colorMode = useColorMode()
const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const sections = [
  { label: 'Getting Started', links: [{ label: 'Usage', to: '/' }, { label: 'Examples', to: '/examples' }, { label: 'Migration', to: '/migration' }, { label: 'Dark mode', to: '/dark' }] },
  { label: 'Elements', links: [{ label: 'Avatar', to: '/components/Avatar' }, { label: 'AvatarGroup', to: '/components/AvatarGroup' }, { label: 'Badge', to: '/components/Badge' }, { label: 'Button', to: '/components/Button' }, { label: 'Dropdown', to: '/components/Dropdown' }, { label: 'Icon', to: '/components/Icon' }] },
  { label: 'Feedback', links: [{ label: 'Alert', to: '/components/Alert' }, { label: 'AlertDialog', to: '/components/AlertDialog' }] },
  { label: 'Forms', links: [{ label: 'Checkbox', to: '/components/Checkbox' }, { label: 'Input', to: '/components/Input' }, { label: 'FormGroup', to: '/components/FormGroup' }, { label: 'Radio', to: '/components/Radio' }, { label: 'Select', to: '/components/Select' }, { label: 'SelectCustom', to: '/components/SelectCustom' }, { label: 'Textarea', to: '/components/Textarea' }, { label: 'Toggle', to: '/components/Toggle' }] },
  { label: 'Layout', links: [{ label: 'Card', to: '/components/Card' }, { label: 'Container', to: '/components/Container' }] },
  { label: 'Navigation', links: [{ label: 'Pills', to: '/components/Pills' }, { label: 'Tabs', to: '/components/Tabs' }, { label: 'VerticalNavigation', to: '/components/VerticalNavigation' }] },
  { label: 'Overlays', links: [{ label: 'Modal', to: '/components/Modal' }, { label: 'Notification', to: '/components/Notification' }, { label: 'Popover', to: '/components/Popover' }, { label: 'Tooltip', to: '/components/Tooltip' }] }
]
</script>

<style>
html.dark {
  @apply bg-black;
}
</style>
