<template>
  <div class="space-y-4">
    <div class="pb-10 border-b u-border-gray-200 mb-10">
      <div>
        <h1 class="inline-block text-3xl font-extrabold u-text-gray-900 tracking-tight">
          Documentation
        </h1>
      </div>

      <p class="mt-1 text-lg u-text-gray-500">
        Components library as a Nuxt3 module using <a href="https://tailwindcss.com" target="_blank" class="underline">TailwindCSS</a>.
      </p>
    </div>

    <h2 class="font-bold text-2xl u-text-gray-900">
      Installation
    </h2>

    <pre class="u-bg-gray-900 rounded-md u-text-white px-4">
      <code class="text-sm" v-html="code1" />
    </pre>

    <p>Then, register the module in your `nuxt.config.js`:</p>

    <pre class="u-bg-gray-900 rounded-md u-text-white px-4">
      <code class="text-sm" v-html="code2" />
    </pre>

    <p>If you want latest updates, please use `@nuxthq/ui-edge` in your `package.json`:</p>

    <pre class="u-bg-gray-900 rounded-md u-text-white px-4">
      <code class="text-sm" v-html="code3" />
    </pre>

    <h2 class="font-bold text-2xl u-text-gray-900">
      Options
    </h2>

    <p>- `preset`</p>

    <p>Choose preset. Defaults to `tailwindui`. An object can also be used to override some parts of the default preset.</p>

    <p>- `prefix`</p>

    <p>Define the prefix of the imported components. Defaults to `u`.</p>

    <p class="font-medium">
      Example:
    </p>

    <pre class="u-bg-gray-900 rounded-md u-text-white px-4">
      <code class="text-sm" v-html="code4" />
    </pre>

    <p>- `colors.primary`</p>

    <p>Define the primary variant. Defaults to `indigo`. You can specify your own object of colors like here:</p>

    <p class="font-medium">
      Example:
    </p>

    <pre class="u-bg-gray-900 rounded-md u-text-white px-4">
      <code class="text-sm" v-html="code5" />
    </pre>

    <p>- `colors.gray`</p>

    <p>Define the gray variant. Defaults to `zinc`. You can like the `primary` color specify your own object. https://tailwindcss.com/docs/customizing-colors#default-color-palette</p>

    <p>- `tailwindcss.theme`. Defaults to `{}`.</p>

    <p>Define TailwindCSS theme: https://tailwindcss.com/docs/theme.</p>
  </div>
</template>

<script setup>
const code1 = `
yarn add --dev @nuxthq/ui`

const code2 = `
import { defineNuxtConfig } from 'nuxt3'

defineNuxtConfig({
  buildModules: [
    '@nuxthq/ui'
  ]
})`

const code3 = `
{
  "devDependencies": {
    "@nuxthq/ui": "npm:@nuxthq/ui-edge@latest"
  }
}`

const code4 = `
import { defineNuxtConfig } from 'nuxt3'

defineNuxtConfig({
  ui: {
    prefix: 'tw'
  }
})`

const code5 = `
import { defineNuxtConfig } from 'nuxt3'

defineNuxtConfig({
  ui: {
    colors: {
      primary: 'blue'
    }
  }
})`
</script>
