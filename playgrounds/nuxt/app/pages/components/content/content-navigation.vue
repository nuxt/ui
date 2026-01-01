<script setup lang="ts">
import theme from '#build/ui/content/content-navigation'

const colors = Object.keys(theme.variants.color)
const variants = Object.keys(theme.variants.variant)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  variant: [theme.defaultVariants.variant]
})

const highlight = ref(true)
const highlightColor = ref()
const collapsible = ref(true)

const navigation = [{
  title: 'Overview',
  path: '#overview',
  children: [{
    title: 'Introduction',
    icon: 'i-lucide-house',
    path: '#introduction',
    active: true
  }, {
    title: 'Installation',
    icon: 'i-lucide-square-play',
    path: '#installation'
  }, {
    title: 'Migration',
    icon: 'i-lucide-arrow-right-left',
    path: '#migration'
  }, {
    title: 'Contribution',
    icon: 'i-lucide-handshake',
    path: '#contribution'
  }]
}, {
  title: 'Theme',
  path: '#theme',
  children: [{
    title: 'Design System',
    icon: 'i-lucide-palette',
    path: '#design-system'
  }, {
    title: 'CSS Variables',
    icon: 'i-lucide-variable',
    path: '#css-variables'
  }, {
    title: 'Components',
    icon: 'i-lucide-blocks',
    path: '#components'
  }]
}, {
  title: 'Integrations',
  path: '#integrations',
  children: [{
    title: 'Icons',
    icon: 'i-lucide-smile',
    path: '#icons'
  }, {
    title: 'Fonts',
    icon: 'i-lucide-type',
    path: '#fonts'
  }, {
    title: 'Color Mode',
    icon: 'i-lucide-sun-moon',
    path: '#color-mode'
  }, {
    title: 'i18n',
    icon: 'i-lucide-globe',
    path: '#i18n'
  }, {
    title: 'Content',
    icon: 'i-lucide-file-text',
    path: '#content'
  }]
}]
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple placeholder="Color" />
    <USelect v-model="attrs.variant" :items="variants" multiple placeholder="Variant" />
    <USwitch v-model="highlight" label="Highlight" />
    <USelect v-model="highlightColor" :items="colors" placeholder="Highlight color" />
    <USwitch v-model="collapsible" label="Collapsible" />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs" class="gap-5">
    <UContentNavigation
      :navigation="navigation"
      :highlight="highlight"
      :highlight-color="highlightColor"
      :collapsible="collapsible"
      v-bind="props"
      class="w-full lg:w-64"
    />
  </Matrix>
</template>
