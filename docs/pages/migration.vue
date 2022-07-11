<template>
  <div class="space-y-4">
    <div class="pb-10 border-b u-border-gray-200 mb-10">
      <div>
        <h1 class="inline-block text-3xl font-extrabold u-text-gray-900 tracking-tight">
          Migration
        </h1>
      </div>

      <p class="mt-1 text-lg u-text-gray-500">
        Check out the components that have been migrated to Vue3 coming from `@nuxthq/volta-ui`.
      </p>
    </div>

    <UCard body-class>
      <table class="min-w-full divide-y u-divide-gray-200">
        <thead class="u-bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium u-text-gray-500 uppercase tracking-wider">
              Component
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium u-text-gray-500 uppercase tracking-wider">
              Nuxt3 ready
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium u-text-gray-500 uppercase tracking-wider">
              Composition API
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium u-text-gray-500 uppercase tracking-wider">
              Preset system
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium u-text-gray-500 uppercase tracking-wider">
              Typescript
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(component, index) of components" :key="index" :class="index % 2 === 0 ? 'u-bg-white' : 'u-bg-gray-50'">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium u-text-gray-900">
              <NuxtLink :to="component.to" class="hover:underline">
                {{ component.label }}
              </NuxtLink>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm u-text-gray-500">
              <span v-if="component.nuxt3 || component.capi">✅</span>
              <span v-else>❌</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm u-text-gray-500">
              <span v-if="component.capi">✅</span>
              <span v-else>❌</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm u-text-gray-500">
              <span v-if="component.preset">✅</span>
              <span v-else>❌</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm u-text-gray-500">
              <span v-if="component.typescript">✅</span>
              <span v-else>❌</span>
            </td>
          </tr>
        </tbody>
      </table>
    </UCard>
  </div>
</template>

<script setup>
const components = [
  {
    label: 'Avatar',
    to: '/components/Avatar',
    nuxt3: true,
    preset: true,
    capi: true,
    typescript: true
  },
  {
    label: 'AvatarGroup',
    to: '/components/AvatarGroup',
    nuxt3: true,
    capi: true,
    typescript: true
  },
  {
    label: 'Badge',
    to: '/components/Badge',
    nuxt3: true,
    capi: true,
    preset: true,
    typescript: true
  },
  {
    label: 'Button',
    to: '/components/Button',
    nuxt3: true,
    capi: true,
    preset: true,
    typescript: true
  },
  {
    label: 'Dropdown',
    to: '/components/Dropdown',
    nuxt3: true,
    capi: true,
    preset: true,
    typescript: true
  },
  {
    label: 'Icon',
    to: '/components/Icon',
    nuxt3: true,
    capi: true,
    typescript: true
  },
  {
    label: 'Link',
    to: '/components/Link',
    nuxt3: true,
    capi: true,
    typescript: true
  },
  {
    label: 'Toggle',
    to: '/components/Toggle',
    nuxt3: true,
    preset: true,
    capi: true,
    typescript: true
  },
  {
    label: 'Alert',
    to: '/components/Alert',
    nuxt3: true,
    capi: true,
    typescript: true
  },
  {
    label: 'AlertDialog',
    to: '/components/AlertDialog',
    nuxt3: true,
    capi: true,
    preset: true,
    typescript: true
  },
  {
    label: 'Input',
    to: '/components/Input',
    capi: true,
    preset: true,
    typescript: true
  },
  {
    label: 'FormGroup',
    to: '/components/FormGroup',
    nuxt3: true,
    capi: true,
    preset: true,
    typescript: true
  },
  {
    label: 'Checkbox',
    to: '/components/Checkbox',
    nuxt3: true,
    capi: true,
    preset: true,
    typescript: true
  },
  {
    label: 'Radio',
    to: '/components/Radio',
    nuxt3: true,
    capi: true,
    preset: true,
    typescript: true
  },
  {
    label: 'Select',
    to: '/components/Select',
    nuxt3: true,
    capi: true,
    preset: true,
    typescript: true
  },
  {
    label: 'SelectCustom',
    to: '/components/SelectCustom',
    capi: true,
    preset: true,
    typescript: true
  },
  {
    label: 'Textarea',
    to: '/components/Textarea',
    nuxt3: true,
    capi: true,
    preset: true,
    typescript: true
  },
  {
    label: 'Card',
    to: '/components/Card',
    nuxt3: true,
    capi: true,
    preset: true,
    typescript: true
  },
  {
    label: 'Container',
    to: '/components/Container',
    nuxt3: true,
    preset: true,
    capi: true,
    typescript: true
  },
  {
    label: 'Tabs',
    to: '/components/Tabs',
    nuxt3: true,
    capi: true,
    preset: true,
    typescript: true
  },
  {
    label: 'Pills',
    to: '/components/Pills',
    nuxt3: true,
    capi: true,
    preset: true,
    typescript: true
  },
  {
    label: 'VerticalNavigation',
    to: '/components/VerticalNavigation',
    nuxt3: true,
    capi: true,
    preset: true,
    typescript: true
  },
  {
    label: 'Modal',
    to: '/components/Modal',
    nuxt3: true,
    preset: true,
    capi: true,
    typescript: true
  },
  {
    label: 'Notification',
    to: '/components/Notification',
    nuxt3: true,
    capi: true,
    typescript: true
  },
  {
    label: 'Notifications',
    to: '/components/Notifications',
    nuxt3: true,
    capi: true,
    typescript: true
  },
  {
    label: 'Popover',
    to: '/components/Popover',
    nuxt3: true,
    capi: true,
    typescript: true
  },
  {
    label: 'Slideover',
    to: '/components/Slideover',
    nuxt3: true,
    capi: true,
    preset: true,
    typescript: true
  },
  {
    label: 'Tooltip',
    to: '/components/Tooltip',
    nuxt3: true,
    capi: true,
    typescript: true
  }
]
</script>
