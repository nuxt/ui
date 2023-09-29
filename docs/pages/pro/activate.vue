<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'

const title = 'Activate your Nuxt UI Pro License'
const description = 'Enable Nuxt UI Pro in your production projects by activating your license key received by email and get invited to the GitHub private repository.'
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

const state = reactive({
  license: undefined,
  username: undefined
})
const activating = ref(false)
const successMessage = ref()
const errorMessage = ref('')
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.license) errors.push({ path: 'license', message: 'Required' })
  if (!state.username) errors.push({ path: 'username', message: 'Required' })
  if (state.license?.length !== 36) errors.push({ path: 'license', message: 'Invalid' })
  return errors
}
async function submit (event: FormSubmitEvent<any>) {
  activating.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const res = await $fetch<{ activationsLeft: number, activationsTotal: number }>('https://api.nuxtlabs.com/ui-pro/activate', {
      method: 'POST',
      body: {
        key: event.data.license,
        username: event.data.username
      }
    })
    successMessage.value = 'License activated!'
    if (res.activationsTotal > 1) {
      successMessage.value += ` ${res.activationsLeft} activation${res.activationsLeft > 1 ? 's' : ''} left.`
    }
    state.username = ''
  } catch (err) {
    errorMessage.value = err.data?.message || err.message
  }
  activating.value = false
}
</script>

<template>
  <UContainer class="min-h-[calc(100vh-var(--header-height)-var(--header-height))]">
    <UPage>
      <UPageHero align="center" :title="title" :description="description" />
      <ULandingCard title="Unlock Nuxt UI Pro:" class="lg:w-1/2 m-auto">
        <UForm
          :validate="validate"
          :state="state"
          class="space-y-4"
          @submit="submit"
        >
          <UFormGroup label="License Key" name="license">
            <UInput v-model="state.license" />
          </UFormGroup>
          <UFormGroup label="GitHub Username" name="username">
            <UInput v-model="state.username" />
          </UFormGroup>
          <UButton type="submit" :loading="activating" :disabled="!state.license || !state.username">
            Activate the license
          </UButton>
          <UAlert v-if="successMessage" color="green" variant="subtle" :title="successMessage">
            <template #description>
              The GitHub invitation to Nuxt UI Pro repository has been sent and
              you can now use your license key in your projects, checkout the
              <NuxtLink class="font-bold underline" to="/pro/guide/installation">
                installation guide
              </NuxtLink>
            </template>
          </UAlert>
          <UAlert v-else-if="errorMessage" color="amber" variant="subtle" :title="errorMessage" />
        </UForm>
      </ULandingCard>
      <p class="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
        If you purchased a team license, activate the license key for each of your team members.
      </p>
      <div class="h-20" />
    </UPage>
  </UContainer>
</template>
