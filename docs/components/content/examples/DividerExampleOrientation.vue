<script setup lang="ts">
const form = reactive({ email: 'mail@example.com', password: 'password' })
</script>

<template>
  <div class="w-full flex flex-col gap-y-4">
    <UCard :ui="{ body: { base: 'grid grid-cols-3' } }">
      <div class="space-y-4">
        <UFormGroup label="Email" name="email">
          <UInput v-model="form.email" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="form.password" type="password" />
        </UFormGroup>

        <UButton label="Login" color="gray" block />
      </div>

      <UDivider label="OR" orientation="vertical" />

      <div class="space-y-4 flex flex-col justify-center">
        <UButton color="black" label="Login with GitHub" icon="i-simple-icons-github" block />
        <UButton color="black" label="Login with Google" icon="i-simple-icons-google" block />
      </div>
    </UCard>

    <UCard>
      <div class="space-y-4">
        <UFormGroup label="Email" name="email">
          <UInput v-model="form.email" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="form.password" type="password" />
        </UFormGroup>

        <UButton label="Login" color="gray" block />

        <UDivider label="OR" />

        <UButton color="black" label="Login with GitHub" icon="i-simple-icons-github" block />
        <UButton color="black" label="Login with Google" icon="i-simple-icons-google" block />
      </div>
    </UCard>
  </div>
</template>
