<template>
  <div class="space-y-4">
    <div class="pb-10 border-b border-gray-200 mb-10">
      <div>
        <h1 class="inline-block text-3xl font-extrabold text-gray-900 tracking-tight">
          Documentation
        </h1>
      </div>

      <p class="mt-1 text-lg text-gray-500">
        Components library as a Nuxt3 module using <a href="https://github.com/antfu/unocss" target="_blank">UnoCSS</a>.
      </p>
    </div>

    <h2 class="font-bold text-2xl text-tw-gray-900">
      Installation
    </h2>

    <pre class="bg-tw-gray-900 rounded-md text-tw-white px-4">
      <code class="text-sm">
yarn add --dev @nuxthq/ui</code>
    </pre>

    <p>Then, register the module in your `nuxt.config.js`:</p>

    <pre class="bg-tw-gray-900 rounded-md text-tw-white px-4">
      <code class="text-sm">
import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  buildModules: [
    '@nuxthq/ui'
  ]
})</code>
    </pre>

    <p>If you want latest updates, please use `@nuxthq/ui-edge` in your `package.json`:</p>

    <pre class="bg-tw-gray-900 rounded-md text-tw-white px-4">
      <code class="text-sm">
{
  "devDependencies": {
    "@nuxthq/ui": "npm:@nuxthq/ui-edge@latest"
  }
}</code>
    </pre>

    <h2 class="font-bold text-2xl text-tw-gray-900">
      Options
    </h2>

    <p>- `primary`</p>

    <p>Define the primary variant. Defaults to `indigo`. You can specify your own object of colors like here:</p>

    <p class="font-medium">
      Example:
    </p>

    <pre class="bg-tw-gray-900 rounded-md text-tw-white px-4">
      <code class="text-sm">
import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  buildModules: [
    '@nuxthq/ui'
  ],
  ui: {
    primary: 'blue'
  }
})</code>
    </pre>

    <p>- `prefix`</p>

    <p>Define the prefix of the imported components. Defaults to `u`.</p>

    <p class="font-medium">
      Example:
    </p>

    <pre class="bg-tw-gray-900 rounded-md text-tw-white px-4">
      <code class="text-sm">
import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  buildModules: [
    '@nuxthq/ui'
  ],
  ui: {
    prefix: 'tw'
  }
})</code>
    </pre>

    <h2 class="font-bold text-2xl text-tw-gray-900">
      Examples
    </h2>

    <div>
      <div class="font-medium text-sm mb-1 text-tw-gray-700">
        Button:
      </div>
      <UButton variant="primary" icon="heroicons-outline:bell">
        toto
      </UButton>
    </div>
    <div>
      <div class="font-medium text-sm mb-1 text-tw-gray-700">
        Avatar:
      </div>
      <UAvatar src="https://picsum.photos/200/300" />
    </div>
    <div>
      <div class="font-medium text-sm mb-1 text-tw-gray-700">
        Card:
      </div>
      <UCard @submit.prevent="onSubmit">
        <UInputGroup label="Email" name="email" class="mb-3">
          <UInput type="email" name="email" />
        </UInputGroup>
        <UButton type="submit" label="Submit" />
      </UCard>
    </div>
    <div>
      <div class="font-medium text-sm mb-1 text-tw-gray-700">
        Modal:
      </div>
      <UButton @click="toggleModalIsOpen()">
        Toggle modal!
      </UButton>

      <UModal v-model="isModalOpen" title="Modal">
        Body
      </UModal>
    </div>
    <div>
      <div class="font-medium text-sm mb-1 text-tw-gray-700">
        Dropdown:
      </div>
      <UDropdown v-slot="{ open }" :items="dropdownItems" placement="bottom-start">
        <UButton variant="white" :icon="open ? 'heroicons-solid:chevron-up' : 'heroicons-solid:chevron-down'" trailing icon-class="transition">
          Open menu!
        </UButton>
      </UDropdown>
    </div>
    <div>
      <div class="font-medium text-sm mb-1 text-tw-gray-700">
        Dropdown with avatar:
      </div>
      <UDropdown :items="customDropdownItems" placement="bottom-end">
        <button>
          <UAvatar src="https://picsum.photos/200/300" />
        </button>
        <template #item-with-avatar="{ item }">
          <UAvatar v-if="item.avatar" :src="item.avatar" size="xxs" class="mr-3" />
          {{ item.label }}
        </template>
      </UDropdown>
    </div>
    <div>
      <div class="font-medium text-sm mb-1 text-tw-gray-700">
        Toggle:
      </div>
      <UToggle v-model="isSwitchEnabled" />
    </div>
    <!-- <UPopover v-slot="{ open }">
      <UButton trailing variant="white" :icon="open ? 'heroicons-outline:chevron-up' : 'heroicons-outline:chevron-down'">
        toto
      </UButton>
    </UPopover> -->
  </div>
</template>

<script setup>
const isModalOpen = ref(false)
const isSwitchEnabled = ref(false)

function toggleModalIsOpen () {
  isModalOpen.value = !isModalOpen.value
}

function onClick () {
  // eslint-disable-next-line no-console
  console.warn('click')
}

function onSubmit () {
  // eslint-disable-next-line no-console
  console.warn('submit')
}

const dropdownItems = [
  [{
    label: 'Edit',
    icon: 'heroicons-solid:pencil',
    click: () => onClick()
  }, {
    label: 'Duplicate',
    icon: 'heroicons-solid:duplicate'
  }],
  [{
    label: 'Archive',
    icon: 'heroicons-solid:archive'
  }, {
    label: 'Move',
    icon: 'heroicons-solid:external-link'
  }],
  [{
    label: 'Delete',
    icon: 'heroicons-solid:trash'
  }]
]

const customDropdownItems = [
  [{
    label: 'benjamincanac',
    avatar: 'https://picsum.photos/200/300',
    href: 'https://google.fr',
    target: '_blank',
    slot: 'item-with-avatar'
  }],
  [{
    label: 'About',
    icon: 'heroicons-solid:plus',
    to: '/about'
  }]
]
</script>
