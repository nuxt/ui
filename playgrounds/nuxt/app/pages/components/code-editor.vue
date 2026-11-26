<script setup lang="ts">
import theme from '#build/ui/code-editor'

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)
const variants = Object.keys(theme.variants.variant)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  variant: [theme.defaultVariants.variant],
  size: [theme.defaultVariants.size]
})

const langs = ['ts', 'vue', 'json', 'css', 'html', 'markdown', 'bash', 'text']
const lang = ref('ts')
const lineNumbers = ref(true)
const lineWrapping = ref(false)
const indentWithTab = ref(false)

const value = ref(`import { ref } from 'vue'

// A counter shared between a few components
export function useCounter(initial = 0) {
  const count = ref(initial)

  function increment(step = 1) {
    count.value += step
  }

  return { count, increment }
}
`)

const json = ref(`{
  "name": "nuxt-ui",
  "private": true,
  "dependencies": {
    "@nuxt/ui": "^4.0.0"
  }
}
`)
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" placeholder="Color" multiple />
    <USelect v-model="attrs.variant" :items="variants" placeholder="Variant" multiple />
    <USelect v-model="attrs.size" :items="sizes" placeholder="Size" multiple />
    <USelect v-model="lang" :items="langs" placeholder="Language" />
    <USwitch v-model="lineNumbers" label="Line numbers" />
    <USwitch v-model="lineWrapping" label="Wrap" />
    <USwitch v-model="indentWithTab" label="Tab indents" />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UCodeEditor
      v-model="value"
      :lang="lang"
      :line-numbers="lineNumbers"
      :line-wrapping="lineWrapping"
      :indent-with-tab="indentWithTab"
      autofocus
      v-bind="props"
    />
    <UCodeEditor v-model="json" lang="json" :maxrows="5" :line-numbers="lineNumbers" v-bind="props" />
    <UCodeEditor :default-value="'const answer = 42'" lang="js" :line-numbers="lineNumbers" v-bind="props" />
    <UCodeEditor placeholder="Highlight" highlight :line-numbers="lineNumbers" v-bind="props" />
    <UCodeEditor placeholder="Disabled" disabled :line-numbers="lineNumbers" v-bind="props" />
    <UCodeEditor :model-value="'// Read only\nconst locked = true'" lang="js" readonly :line-numbers="lineNumbers" v-bind="props" />
    <UCodeEditor placeholder="Required" required :line-numbers="lineNumbers" v-bind="props" />
    <UCodeEditor placeholder="One row" :rows="1" :line-numbers="lineNumbers" v-bind="props" />
  </Matrix>
</template>
