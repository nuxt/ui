<!-- <template>
  <UContainer class="min-h-screen flex items-center">
    <UCard class="flex-1" :ui="{ background: 'bg-gray-50 dark:bg-gray-800/50', ring: 'ring-1 ring-gray-300 dark:ring-gray-700', divide: 'divide-y divide-gray-300 dark:divide-gray-700', header: { base: 'font-bold' } }">
      <template #header>
        Welcome to the playground!
      </template>

      <p class="text-gray-500 dark:text-gray-400">
        Try your components here!
      </p>
    </UCard>
  </UContainer>
</template>

<script setup>

</script>

<style>
body {
  @apply antialiased font-sans text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900;
}
</style> -->
<template>
  <UNotifications />
  <UForm :state="state" @submit="onSubmit" class="flex gap-2">
    <div class="flex flex-col gap-1 w-32">
      <UFormGroup>
        <UInput type="text" v-model="state.textOne" placeholder="Text 1" />
      </UFormGroup>
      <UFormGroup>
        <UInput type="text" v-model="state.texttwo" placeholder="Text 2" />
      </UFormGroup>
      <UFormGroup>
        <UInput type="text" v-model="state.textTree" placeholder="Text 3" />
      </UFormGroup>
    </div>
    <div class="flex flex-col gap-1 w-32">
      <UButton type="submit" block>
        create
      </UButton>
      <UButton  type="submit" name="update" block>
        update
      </UButton>
      <UButton  type="submit" name="delete" block>
        delete
      </UButton>
    </div>
  </UForm>
</template>

<script setup>
  const state = reactive({
    textOne: '',
    textTwo: '',
    textTree: '',
  })

  async function onSubmit(event) {
    switch (event.name) {
      case 'create':
        useToast().add({ title: "is a create submission", description: JSON.stringify(event.data) });
        break;
        case 'update':
          useToast().add({ title: "is a update submission", description: JSON.stringify(event.data)});
          break;
      case 'delete':
        useToast().add({ title: "is a delete submission", description: JSON.stringify(event.data)});
        break;
      default:
        useToast().add({ title: "is a create submission", description: JSON.stringify(event.data)});
        break;
    }
  }
</script>
