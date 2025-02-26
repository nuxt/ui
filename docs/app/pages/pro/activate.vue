<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { joinURL } from 'ufo'

const title = 'Activate your Nuxt UI Pro License'
const description = 'Enable Nuxt UI Pro in your production projects by activating your license key received by email and get invited to the GitHub private repository.'

const route = useRoute()
const { url } = useSiteConfig()

useSeoMeta({
  title,
  description,
  ogTitle: `${title} - Nuxt UI Pro`,
  ogDescription: description,
  ogImage: joinURL(url, '/pro/og-image.png')
})

const schema = z.object({
  license: z.string().length(36, 'Invalid license key'),
  username: z.string().min(1, 'Required')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  license: '',
  username: ''
})

const activating = ref(false)
const successMessage = ref()
const errorMessage = ref('')

async function submit(event: FormSubmitEvent<any>) {
  activating.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const res: { activationsLeft: number, activationsTotal: number } = await $fetch<{ activationsLeft: number, activationsTotal: number }>('https://api.nuxtlabs.com/ui-pro/activate', {
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
    // @ts-expect-error this is not properly typed
    errorMessage.value = err.data?.message || err.message
  }

  activating.value = false
}

onMounted(() => {
  if (route.query.license_key && !state.license) {
    state.license = route.query.license_key as string
  }
})
</script>

<template>
  <UMain>
    <UPageHero headline="License Activation" :title="title" :description="description" :ui="{ container: 'relative' }">
      <template #top>
        <div class="absolute z-[-1] rounded-full bg-(--ui-primary) blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" />
        <StarsBg />
      </template>
      <div aria-hidden="true" class="hidden lg:block absolute z-[-1] border-x border-(--ui-border) inset-0 mx-4 sm:mx-6 lg:mx-8" />

      <div class="lg:border-y border-(--ui-border)">
        <UCard class="lg:w-1/2 m-auto lg:rounded-none overflow-hidden" variant="outline" :ui="{ footer: 'bg-(--ui-bg-muted)' }">
          <UForm
            :schema="schema"
            :validate-on="['blur']"
            :state="state"
            class="space-y-4"
            @submit="submit"
          >
            <UFormField label="License Key" name="license">
              <UInput v-model="state.license" autocomplete="off" :ui="{ root: 'flex' }" />
            </UFormField>
            <UFormField label="GitHub Username" name="username">
              <UInput v-model="state.username" autocomplete="off" :ui="{ root: 'flex' }" />
            </UFormField>
            <UButton type="submit" :loading="activating" :disabled="state.license?.length !== 36 || !state.username">
              Activate the license
            </UButton>
            <UAlert v-if="successMessage" color="success" variant="subtle" :title="successMessage">
              <template #description>
                The GitHub invitation to <NuxtLink to="https://github.com/nuxt/ui-pro/invitations" external target="_blank" class="font-bold text-primary hover:underline">
                  Nuxt UI Pro repository
                </NuxtLink> has been sent and
                you can now use your license key in your projects, checkout the
                <NuxtLink class="font-bold underline" to="/pro/getting-started/installation">
                  installation guide
                </NuxtLink>
              </template>
            </UAlert>
            <UAlert v-else-if="errorMessage" color="error" variant="subtle" :title="errorMessage" />
          </UForm>
          <template #footer>
            <p class="text-sm text-center text-neutral-500 dark:text-neutral-400">
              If you purchased a license with multiple seats, activate the license key for each member of your team.
            </p>
          </template>
        </UCard>
      </div>
    </UPageHero>
  </UMain>
</template>
