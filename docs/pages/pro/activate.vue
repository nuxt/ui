<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'

const state = ref({
  license: undefined,
  username: undefined
})
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.license) errors.push({ path: 'license', message: 'Required' })
  if (!state.username) errors.push({ path: 'username', message: 'Required' })
  return errors
}
async function submit (event: FormSubmitEvent<any>) {
  // Do something with data
  console.log(event.data)
}
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHero title="Activate your license" description="Enable Nuxt UI Pro in your production projects by activating your license key received by email and get invited to the GitHub private repository." />
      <UCard class="lg:w-1/2">
        <UForm
          :validate="validate"
          :state="state"
          @submit="submit"
        >
          <UFormGroup label="License Key" name="license">
            <UInput v-model="state.license" />
          </UFormGroup>
          <UFormGroup label="GitHub Username" name="username">
            <UInput v-model="state.username" />
          </UFormGroup>
          <UButton type="submit">
            Submit
          </UButton>
        </UForm>
      </UCard>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-4">
        If you purchased the team license, activate the license for each team member.
      </p>
      <div class="h-20" />
    </UPage>
  </UContainer>
</template>
