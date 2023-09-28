<script setup>
const loginForm = reactive({ email: 'mail@example.com', passowrd: 'passowrd' })
</script>

<template>
  <div class="w-full flex flex-col gap-y-4">
    <UCard :ui="{ body: { base: 'w-full grid grid-cols-3' } }">
      <div class="w-ful">
        <UFormGroup label="Email" name="email" class="mb-3">
          <UInput v-model="loginForm.email" />
        </UFormGroup>

        <UFormGroup label="Passowrd" name="passowrd">
          <UInput v-model="loginForm.passowrd" type="password" />
        </UFormGroup>

        <UButton class="w-full my-4" color="black" variant="outline">
          Login
        </UButton>
      </div>

      <UDivider class="my-4 w-ful" label="OR" color="gray" orientation="vertical" />

      <div class="w-full flex flex-col gap-y-2 justify-center">
        <UButton color="black">
          <UIcon name="i-simple-icons-github" />
          Login with Github
        </UButton>
        <UButton color="black">
          <UIcon name="i-simple-icons-google" />
          Login with Google
        </UButton>
      </div>
    </UCard>

    <UCard>
      <UFormGroup label="Email" name="email" class="mb-3">
        <UInput v-model="loginForm.email" />
      </UFormGroup>

      <UFormGroup label="Passowrd" name="passowrd">
        <UInput v-model="loginForm.passowrd" type="password" />
      </UFormGroup>

      <UButton class="w-full mt-4" color="black" variant="outline">
        Login
      </UButton>

      <UDivider class="my-4" label="OR" color="gray" />

      <div class="flex flex-col gap-y-2">
        <UButton color="black">
          <UIcon name="i-simple-icons-github" />
          Login with Github
        </UButton>
        <UButton color="black">
          <UIcon name="i-simple-icons-google" />
          Login with Google
        </UButton>
      </div>
    </UCard>
  </div>
</template>
