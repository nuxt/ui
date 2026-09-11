<script setup lang="ts">
import theme from '#build/ui/banner'
const pg = usePg()


const colors = Object.keys(theme.variants.color)

const attrs = reactive({
  color: [theme.defaultVariants.color]
})
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs" :class="pg.flex_col_w_full" :container-class="pg.w_full">
    <UBanner
      id="banner"
      title="Nuxt UI v4 is officially released!"
      to="https://github.com/nuxt/ui/releases/tag/v4.0.0"
      icon="i-lucide-rocket"
      :actions="[{
        label: 'Read the post',
        color: 'neutral',
        variant: 'outline',
        trailingIcon: 'i-lucide-arrow-right',
        to: 'https://nuxt.com/blog/nuxt-ui-v4',
        target: '_blank',
        class: pg.ring_0
      }]"
      v-bind="props"
    />
    <UBanner
      title="Close me - I'll reappear on page reload (no id prop)"
      :close="true"
      v-bind="props"
    />
    <UBanner
      id="banner3"
      title="Close me - I'll stay closed permanently (id='banner3')"
      :close="true"
      v-bind="props"
    />
  </Matrix>
</template>
