<script setup lang="ts">
import theme from '#build/ui/form-field'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>

const feedbacks = [
  { description: 'This is a description' },
  { error: 'This is an error' },
  { hint: 'This is a hint' },
  { help: 'Help! I need somebody!' },
  { required: true }
]
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4 ms-[-38px]">
      <div v-for="(feedback, count) in feedbacks" :key="count" class="flex items-center">
        <UFormField v-bind="feedback" label="Email" name="email">
          <UInput placeholder="john@lennon.com" />
        </UFormField>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <UFormField
        v-for="size in sizes"
        :key="size"
        :size="size"
        label="Email"
        name="email"
      >
        <UInput placeholder="john@lennon.com" />
      </UFormField>
    </div>

    <div class="flex items-center gap-4">
      <UFormField
        v-for="size in sizes"
        :key="size"
        :size="size"
        label="Email"
        description="This is a description"
        name="email"
      >
        <UInput placeholder="john@lennon.com" />
      </UFormField>
    </div>
  </div>
</template>
