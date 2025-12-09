<script setup lang="ts">
import theme from '#build/ui/alert'

const colors = Object.keys(theme.variants.color)
const variants = Object.keys(theme.variants.variant)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  variant: [theme.defaultVariants.variant]
})

const actions = (color: string) => [{
  label: 'Action',
  color: color as any,
  onClick() {
    console.log('Action clicked')
  }
}]

const multipleActions = (color: string) => [
  {
    label: 'Action',
    color: color as any,
    onClick() {
      console.log('Action clicked')
    }
  },
  {
    label: 'Another action',
    color: color as any,
    onClick() {
      console.log('Another action clicked')
    }
  },
  {
    label: 'One more action',
    color: color as any,
    onClick() {
      console.log('One more action clicked')
    }
  },
  {
    label: 'And one more',
    color: color as any,
    icon: 'i-lucide-info',
    onClick() {
      console.log('And one more clicked')
    }
  },
  {
    label: 'Last one',
    color: color as any,
    icon: 'i-lucide-info',
    onClick() {
      console.log('Last one clicked')
    }
  }
]

const data = {
  title: 'Heads up!',
  description: 'You can change the primary color in your app config.',
  icon: 'i-lucide-terminal',
  close: true
}
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs" container-class="max-w-80">
    <UAlert :title="data.title" v-bind="props" />
    <UAlert :title="data.title" :icon="data.icon" v-bind="props" />
    <UAlert :title="data.title" :icon="data.icon" :close="data.close" v-bind="props" />
    <UAlert
      :title="data.title"
      :icon="data.icon"
      :close="data.close"
      :actions="actions(props?.color === 'neutral' ? 'primary' : 'neutral')"
      orientation="horizontal"
      v-bind="props"
    />
    <UAlert
      :title="data.title"
      :icon="data.icon"
      :close="data.close"
      :description="data.description"
      v-bind="props"
    />
    <UAlert
      :title="data.title"
      :avatar="{ src: 'https://github.com/benjamincanac.png' }"
      :close="data.close"
      :description="data.description"
      v-bind="props"
    />
    <UAlert
      :title="data.title"
      :icon="data.icon"
      description="example with multiple actions."
      :actions="multipleActions(props?.color === 'neutral' ? 'primary' : 'neutral')"
      v-bind="props"
    />
  </Matrix>
</template>
