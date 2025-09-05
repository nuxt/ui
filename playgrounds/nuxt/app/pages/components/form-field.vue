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

const state = reactive({
  email: '',
  name: '',
  password: ''
})
</script>

<template>
  <div class="flex flex-col items-center gap-8">
    <!-- Original examples -->
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

    <!-- Horizontal form examples -->
    <div class="w-full max-w-md space-y-8">
      <div>
        <h3 class="text-lg font-semibold mb-4">Horizontal Form (Left Labels)</h3>
        <UForm :state="state" label-position="left" class="space-y-4">
          <UFormField label="Name" name="name">
            <UInput v-model="state.name" placeholder="Enter your name" />
          </UFormField>
          <UFormField label="Email" name="email" description="We'll never share your email">
            <UInput v-model="state.email" placeholder="Enter your email" />
          </UFormField>
          <UFormField label="Password" name="password" required>
            <UInput v-model="state.password" type="password" placeholder="Enter password" />
          </UFormField>
        </UForm>
      </div>

      <div>
        <h3 class="text-lg font-semibold mb-4">Horizontal Form (Right Labels)</h3>
        <UForm :state="state" label-position="right" class="space-y-4">
          <UFormField label="Name" name="name">
            <UInput v-model="state.name" placeholder="Enter your name" />
          </UFormField>
          <UFormField label="Email" name="email" description="We'll never share your email">
            <UInput v-model="state.email" placeholder="Enter your email" />
          </UFormField>
          <UFormField label="Password" name="password" required>
            <UInput v-model="state.password" type="password" placeholder="Enter password" />
          </UFormField>
        </UForm>
      </div>

      <div>
        <h3 class="text-lg font-semibold mb-4">Mixed Label Positions (Individual Override)</h3>
        <UForm :state="state" label-position="top" class="space-y-4">
          <UFormField label="Name" name="name" label-position="left">
            <UInput v-model="state.name" placeholder="Enter your name" />
          </UFormField>
          <UFormField label="Email" name="email" label-position="right" description="We'll never share your email">
            <UInput v-model="state.email" placeholder="Enter your email" />
          </UFormField>
          <UFormField label="Password" name="password" required>
            <UInput v-model="state.password" type="password" placeholder="Enter password" />
          </UFormField>
        </UForm>
      </div>
    </div>
  </div>
</template>
