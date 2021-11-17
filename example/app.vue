<template>
  <div class="mx-auto max-w-7xl flex flex-col">
    Welcome
    <UButton class="ml-3" variant="primary" icon="mdi:bed-single">
      toto
    </UButton>

    <UIcon name="mdi:bullhorn" class="w-4 h-4 text-black" />

    <UAvatar class="ml-3" src="https://picsum.photos/200/300" />

    <UButton @click="toggleModalIsOpen()">
      Toggle modal!
    </UButton>

    {{ isModalOpen }}

    <UModal v-model="isModalOpen" title="Modal">
      Body
    </UModal>

    <!-- <UPopover v-slot="{ open }">
      <UButton trailing variant="white" :icon="open ? 'heroicons-outline:chevron-up' : 'heroicons-outline:chevron-down'">
        toto
      </UButton>
    </UPopover> -->
  </div>
</template>

<script setup>
const isModalOpen = ref(false)

function toggleModalIsOpen () {
  isModalOpen.value = !isModalOpen.value
}
</script>
