<template>
  <div class="bg-tw-gray-50">
    <UContainer class="pt-8 min-h-screen">
      <div class="lg:grid lg:grid-cols-12 lg:gap-10 lg:relative">
        <aside class="lg:flex lg:flex-col lg:relative pb-8 lg:pb-0 lg:sticky lg:top-0 px-4 sm:px-6 lg:px-0 lg:pt-8 lg:-mt-8 lg:self-start lg:col-span-3 lg:overflow-hidden lg:h-[calc(100vh-2rem)]" style="position: sticky;height: calc(100vh - 0rem);">
          <NuxtLink to="/" class="block font-bold text-lg mb-6">
            @nuxthq/ui
          </NuxtLink>

          <nav class="overflow-y-auto h-auto pb-12">
            <ul class="space-y-6">
              <li>
                <ULink to="/examples" class="mb-3 uppercase tracking-wide font-semibold text-xs" active-class="text-primary-700" inactive-class="text-tw-gray-700 hover:text-tw-gray-900" exact>
                  Examples
                </ULink>
              </li>
              <li v-for="section of sections" :key="section">
                <h5 class="mb-3 uppercase tracking-wide font-semibold text-xs text-tw-gray-900">
                  {{ section.label }}
                </h5>
                <ul class="space-y-1.5">
                  <li v-for="component of section.components" :key="component">
                    <ULink
                      :to="`/components/${component}`"
                      class="relative block text-sm rounded-md"
                      active-class="text-primary-700"
                      inactive-class="text-tw-gray-500 hover:text-tw-gray-900"
                      exact
                    >
                      {{ component }}
                    </ULink>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </aside>

        <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9 pb-80">
          <NuxtPage />
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
useMeta({
  title: '@nuxthq/ui',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' }
  ],
  htmlAttrs: {
    class: 'bg-tw-gray-50'
  }
})

const sections = [
  { label: 'Elements', components: ['Avatar', 'AvatarGroup', 'Badge', 'Button', 'Dropdown', 'Icon', 'Link', 'Toggle'] },
  { label: 'Feedback', components: ['Alert'] },
  { label: 'Forms', components: ['Checkbox', 'Input', 'InputGroup', 'Radio', 'RadioGroup', 'Select', 'SelectCustom', 'Textarea'] },
  { label: 'Layout', components: ['Card', 'Container'] },
  { label: 'Navigation', components: ['Pills', 'Tabs', 'VerticalNavigation'] },
  { label: 'Overlays', components: ['Modal', 'Notification', 'Popover', 'Slideover', 'Tooltip'] }
]
</script>
