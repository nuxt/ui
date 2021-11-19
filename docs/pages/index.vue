<template>
  <div class="space-y-4">
    <h1 class="font-medium text-xl">
      Nuxt3 UI module documentation by NuxtLabs:
    </h1>

    <div>
      <UButton variant="primary" loading icon="heroicons-outline:bell">
        toto
      </UButton>
    </div>

    <div>
      <UAvatar src="https://picsum.photos/200/300" />
    </div>

    <div>
      <UCard @submit.prevent="onSubmit">
        <UInputGroup label="Email" name="email">
          <UInput type="email" name="email" />
        </UInputGroup>

        <UButton type="submit" label="Submit" />
      </UCard>
    </div>

    <div>
      <UButton @click="toggleModalIsOpen()">
        Toggle modal!
      </UButton>

      <UModal v-model="isModalOpen" title="Modal">
        Body
      </UModal>
    </div>

    <div>
      <UDropdown v-slot="{ open }" :items="dropdownItems" placement="bottom-start">
        <UButton variant="white" :icon="open ? 'heroicons-solid:chevron-up' : 'heroicons-solid:chevron-down'" trailing icon-class="transition">
          Open menu!
        </UButton>
      </UDropdown>
    </div>

    <div>
      <UDropdown :items="customDropdownItems" placement="bottom-end">
        <button>
          <UAvatar src="https://picsum.photos/200/300" />
        </button>

        <template #item-with-avatar="{ item }">
          <UAvatar v-if="item.avatar" :src="item.avatar" size="xxs" class="mr-3" />

          {{ item.label }}
        </template>
      </UDropdown>
    </div>

    <div>
      <UToggle v-model="isSwitchEnabled" />
    </div>

    <!-- <UPopover v-slot="{ open }">
      <UButton trailing variant="white" :icon="open ? 'heroicons-outline:chevron-up' : 'heroicons-outline:chevron-down'">
        toto
      </UButton>
    </UPopover> -->
  </div>
</template>

<script setup>
const isModalOpen = ref(false)
const isSwitchEnabled = ref(false)

function toggleModalIsOpen () {
  isModalOpen.value = !isModalOpen.value
}

function onClick () {
  // eslint-disable-next-line no-console
  console.warn('click')
}

function onSubmit () {
  // eslint-disable-next-line no-console
  console.warn('submit')
}

const dropdownItems = [
  [{
    label: 'Edit',
    icon: 'heroicons-solid:pencil',
    click: () => onClick()
  }, {
    label: 'Duplicate',
    icon: 'heroicons-solid:duplicate'
  }],
  [{
    label: 'Archive',
    icon: 'heroicons-solid:archive'
  }, {
    label: 'Move',
    icon: 'heroicons-solid:external-link'
  }],
  [{
    label: 'Delete',
    icon: 'heroicons-solid:trash'
  }]
]

const customDropdownItems = [
  [{
    label: 'benjamincanac',
    avatar: 'https://picsum.photos/200/300',
    href: 'https://google.fr',
    target: '_blank',
    slot: 'item-with-avatar'
  }],
  [{
    label: 'About',
    icon: 'heroicons-solid:plus',
    to: '/about'
  }]
]
</script>
