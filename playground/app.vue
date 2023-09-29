<script setup lang="ts">

const colorMode = useColorMode()
const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const people = ['Wade Cooper', 'Arlene Mccoy', 'Devon Webb', 'Tom Cook', 'Tanya Fox', 'Hellen Schmidt', 'Caroline Schultz', 'Mason Heaney', 'Claudie Smitham', 'Emil Schaefer']
const countries = ['United States', 'Canada', 'Mexico']

const state = ref({
  email: undefined,
  password: undefined,
  people: undefined,
  country: undefined,
  notification: undefined
})

const validate = (state) => {
  const errors = []
  if (!state.email) errors.push({ path: 'email', message: 'Required' })
  if (!state.password) errors.push({ path: 'password', message: 'Required' })
  if (!state.people) errors.push({ path: 'people', message: 'Required' })
  if (!state.country) errors.push({ path: 'country', message: 'Required' })
  if (!state.notification) errors.push({ path: 'notification', message: 'Required' })
  return errors
}

async function submit (event) {}
</script>

<template>
  <Body class="bg-gray-400" />

  <!-- with bg -->
  <UCard class="m-4">
    <div class="flex flex-col gap-4">
      <UButton
        :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
        color="gray"
        :label="isDark ? 'Dark' : 'Light'"
        aria-label="Theme"
        @click="isDark = !isDark"
      />

      <UForm :validate="validate" :state="state" class="flex flex-col gap-6 py-6" @submit="submit">
        <UFormGroup name="password">
          <UInput v-model="state.password" type="text" />
        </UFormGroup>

        <UFormGroup name="password">
          <UTextarea v-model="state.password" />
        </UFormGroup>

        <UFormGroup name="country">
          <USelect v-model="state.country" :options="countries" />
        </UFormGroup>

        <UFormGroup name="people">
          <USelectMenu v-model="state.people" :options="people" />
        </UFormGroup>

        <UFormGroup name="notification">
          <UCheckbox v-model="state.notification" name="notifications" label="Notifications" />
        </UFormGroup>

        <UFormGroup name="notification">
          <URadio v-model="state.notification" name="notifications" label="Notifications" />
        </UFormGroup>

        <UFormGroup name="notification">
          <UToggle v-model="state.notification" name="notifications" />
        </UFormGroup>

        <UButton type="submit">
          Submit
        </UButton>
      </UForm>
    </div>
  </UCard>

  <!-- without bg -->
  <div class="m-4 flex flex-col gap-4 border rounded p-5">
    <UButton
      :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
      color="gray"
      :label="isDark ? 'Dark' : 'Light'"
      aria-label="Theme"
      @click="isDark = !isDark"
    />

    <UForm :validate="validate" :state="state" class="flex flex-col gap-6 py-6" @submit="submit">
      <UFormGroup name="password">
        <UInput v-model="state.password" type="text" />
      </UFormGroup>

      <UFormGroup name="password">
        <UTextarea v-model="state.password" />
      </UFormGroup>

      <UFormGroup name="country">
        <USelect v-model="state.country" :options="countries" />
      </UFormGroup>

      <UFormGroup name="people">
        <USelectMenu v-model="state.people" :options="people" />
      </UFormGroup>

      <UFormGroup name="notification">
        <UCheckbox v-model="state.notification" name="notifications" label="Notifications" />
      </UFormGroup>

      <UFormGroup name="notification">
        <URadio v-model="state.notification" name="notifications" label="Notifications" />
      </UFormGroup>

      <UFormGroup name="notification">
        <UToggle v-model="state.notification" name="notifications" />
      </UFormGroup>

      <UButton type="submit">
        Submit
      </UButton>
    </UForm>
  </div>
</template>
