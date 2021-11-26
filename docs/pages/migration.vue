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
              Composition API
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium u-text-gray-500 uppercase tracking-wider">
              Preset system
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
              <span v-if="component.capi">✅</span>
              <span v-else>❌</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm u-text-gray-500">
              <span v-if="component.preset">✅</span>
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
    to: '/components/Avatar'
  },
  {
    label: 'AvatarGroup',
    to: '/components/AvatarGroup'
  },
  {
    label: 'Badge',
    to: '/components/Badge'
  },
  {
    label: 'Button',
    to: '/components/Button'
  },
  {
    label: 'Dropdown',
    to: '/components/Dropdown',
    capi: true
  },
  {
    label: 'Icon',
    to: '/components/Icon',
    capi: true
  },
  {
    label: 'Link',
    to: '/components/Link'
  },
  {
    label: 'Toggle',
    to: '/components/Toggle'
  },
  {
    label: 'Alert',
    to: '/components/Alert'
  },
  {
    label: 'Checkbox',
    to: '/components/Checkbox'
  },
  {
    label: 'Input',
    to: '/components/Input',
    capi: true,
    preset: true
  },
  {
    label: 'InputGroup',
    to: '/components/InputGroup'
  },
  {
    label: 'Radio',
    to: '/components/Radio'
  },
  {
    label: 'RadioGroup',
    to: '/components/RadioGroup'
  },
  {
    label: 'Select',
    to: '/components/Select',
    capi: true,
    preset: true
  },
  {
    label: 'SelectCustom',
    to: '/components/SelectCustom'
  },
  {
    label: 'Textarea',
    to: '/components/Textarea',
    capi: true,
    preset: true
  },
  {
    label: 'Card',
    to: '/components/Card',
    capi: true
  },
  {
    label: 'Container',
    to: '/components/Container',
    capi: true
  },
  {
    label: 'Pills',
    to: '/components/Pills'
  },
  {
    label: 'Tabs',
    to: '/components/Tabs'
  },
  {
    label: 'VerticalNavigation',
    to: '/components/VerticalNavigation'
  },
  {
    label: 'Modal',
    to: '/components/Modal',
    capi: true
  },
  {
    label: 'Notification',
    to: '/components/Notification'
  },
  {
    label: 'Popover',
    to: '/components/Popover',
    capi: true
  },
  {
    label: 'Slideover',
    to: '/components/Slideover'
  },
  {
    label: 'Tooltip',
    to: '/components/Tooltip'
  }
]
</script>
