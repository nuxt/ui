<template>
  <div class="space-y-4">
    <div class="pb-10 border-b u-border-gray-200 mb-10">
      <div>
        <h1 class="inline-block text-3xl font-extrabold u-text-gray-900 tracking-tight">
          Dark mode
        </h1>
      </div>

      <p class="mt-1 text-lg u-text-gray-500">
        Dark mode implementation with <a href="https://vueuse.org" target="_blank" class="underline">VueUse</a>.
      </p>
    </div>

    <h2 class="font-bold text-2xl u-text-gray-900">
      Usage
    </h2>

    <pre class="u-bg-gray-900 rounded-md u-text-white px-4">
      <code class="text-sm">
        {{ code5 }}
      </code>
    </pre>

    <p>The VueUse <a href="https://vueuse.org/core/useDark" target="_blank" class="underline">useDark</a> composable makes use of the `dark` class on the html tag so you can easily take advantage of the UnoCSS `dark` variant.</p>

    <pre class="u-bg-gray-900 rounded-md u-text-white px-4">
      <code class="text-sm">
        {{ code4 }}
      </code>
    </pre>

    <p>You can implement a toggle button easily by doing:</p>

    <pre class="u-bg-gray-900 rounded-md u-text-white px-4">
      <code class="text-sm">
        {{ code2 }}
      </code>
    </pre>
    <pre class="u-bg-gray-900 rounded-md u-text-white px-4">
      <code class="text-sm">
        {{ code1 }}
      </code>
    </pre>

    <h2 class="font-bold text-2xl u-text-gray-900">
      Shortcuts
    </h2>

    <p>A number of shortcuts are available to make your life with colors easier.</p>

    <p>For each color utilities: `bg`, `text`, `border`, `ring` and `divide`, shortcuts for `white`, `black` and `gray` colors are generated (based on your prefix `u` by default) that handles the dark mode automatically:</p>

    <pre class="u-bg-gray-900 rounded-md u-text-white px-4">
      <code class="text-sm">
        {{ code3 }}
      </code>
    </pre>

    <p>For example `u-bg-gray-100` is a shortcut for `bg-gray-100 dark:bg-gray-800`. Take a look at the <a href="https://github.com/nuxtlabs/ui/blob/dev/src/index.ts#L61" target="_blank" class="underline">shortcuts definitions</a>.</p>
  </div>
</template>

<script setup>
const code1 = `
<UseDark v-slot="{ isDark, toggleDark }">
  <UButton variant="transparent" :icon="isDark ? 'heroicons-outline:moon' : 'heroicons-outline:sun'" @click="toggleDark()" />
</UseDark>`
const code2 = `
import { UseDark } from '@vueuse/components'
`
const code3 = `
<div class="u-bg-gray-100 border u-border-gray-200 u-text-gray-700"></div>
`
const code4 = `
<div class="bg-white dark:bg-black"></div>
`
const code5 = `
yarn add @vueuse/components @vueuse/core
`
</script>
