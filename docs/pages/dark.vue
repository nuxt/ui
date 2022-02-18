<template>
  <div class="space-y-4">
    <div class="pb-10 border-b u-border-gray-200 mb-10">
      <div>
        <h1 class="inline-block text-3xl font-extrabold u-text-gray-900 tracking-tight">
          Dark mode
        </h1>
      </div>

      <p class="mt-1 text-lg u-text-gray-500">
        Dark mode implementation with <a href="https://color-mode.nuxtjs.org/" target="_blank" class="underline">Color Mode</a> module.
      </p>
    </div>

    <h2 class="font-bold text-2xl u-text-gray-900">
      Usage
    </h2>

    <p>TailwindCSS takes advantage of the `dark` class on the html tag:</p>

    <pre class="u-bg-gray-900 rounded-md u-text-white px-4">
      <code class="text-sm">
        {{ code4 }}
      </code>
    </pre>

    <p>The `@nuxtjs/color-mode` module is now installed by default, you can easily implement a toggle button:</p>

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
const colorMode = useColorMode()
const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}`
const code3 = `
<div class="u-bg-gray-100 border u-border-gray-200 u-text-gray-700"></div>
`
const code4 = `
<div class="bg-white dark:bg-black"></div>
`
</script>
