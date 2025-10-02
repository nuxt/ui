<script setup lang="ts">
import theme from '#build/ui/form-field'

const sizes = Object.keys(theme.variants.size)

const attrs = reactive({
  size: [theme.defaultVariants.size]
})

const feedbacks = [
  {},
  { required: true },
  { description: 'This is a description' },
  { error: 'This is an error' },
  { hint: 'This is a hint' },
  { help: 'Help! I need somebody!' }
]
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.size" :items="sizes" placeholder="Size" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <template v-for="(feedback, index) in feedbacks" :key="index">
      <UFormField label="Email" name="email" v-bind="{ ...feedback, ...props }">
        <UInput placeholder="john@lennon.com" />
      </UFormField>
    </template>
  </Matrix>
</template>
