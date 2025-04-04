<script lang="ts" setup>
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'

const [DefineFormTemplate, ReuseFormTemplate] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 768px)')

const open = ref(false)

const state = reactive({
  email: undefined
})

const title = 'Edit profile'
const description = 'Make changes to your profile here. Click save when you\'re done.'
</script>

<template>
  <DefineFormTemplate>
    <UForm :state="state" class="space-y-4">
      <UFormField label="Email" name="email" required>
        <UInput v-model="state.email" placeholder="shadcn@example.com" required />
      </UFormField>

      <UButton label="Save changes" type="submit" />
    </UForm>
  </DefineFormTemplate>

  <UModal v-if="isDesktop" v-model:open="open" :title="title" :description="description">
    <UButton label="Edit profile" color="neutral" variant="outline" />

    <template #body>
      <ReuseFormTemplate />
    </template>
  </UModal>

  <UDrawer v-else v-model:open="open" :title="title" :description="description">
    <UButton label="Edit profile" color="neutral" variant="outline" />

    <template #body>
      <ReuseFormTemplate />
    </template>
  </UDrawer>
</template>
