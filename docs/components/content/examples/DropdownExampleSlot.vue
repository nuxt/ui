<script setup>
  const items = [
    [
      {
        label: 'Haytham Salama',
        slot: 'account',
        avatar: {
          src: 'https://avatars.githubusercontent.com/u/37311945?v=4'
        }
      }
    ],
    [
      {
        label: '🚀 Focusing',
        slot: 'status'
      }
    ],
    [
      { label: 'Your profile' },
      { label: 'Your repositories' },
      { label: ' Your organizations' },
      { label: 'Your projects' },
      { label: 'Your discussions' },
      { label: 'Your stars' },
      { label: 'Your sponsors' }
    ],
    [
      { label: 'Upgrade' },
      { label: 'Try Enterprise' },
      { label: 'Help' },
      { label: 'Help' },
      { label: 'Setting' }
    ],
    [
      { label: 'Sign out' }
    ]
  ]
</script>

<template>
  <UDropdown
    :items="items"
    :ui="{ rounded: 'rounded-md', }"
  >
    <UButton
      color="white"
      label="Profile"
      trailing-icon="i-heroicons-chevron-down-20-solid"
    />
    <template #account="{ item }">
      <div class="flex gap-x-1.5 items-center">
        <div>
          <UAvatar :src="item.avatar.src" :ui="{ rounded: 'rounded-md' }" />
        </div>

        <div class="flex flex-col items-start text-start w-full">
          <div class="text-sm">
            Signed in as
          </div>
          <div class="font-bold">
            {{ item.label }}
          </div>
        </div>
      </div>
    </template>

    <template #status="{ item }">
      <div class="flex justify-center w-full">
        <span class="text-start py-1 px-2 border border-green-500 rounded-md w-full animate-pulse text-green-500">{{ item.label }}</span>
      </div>
    </template>

    <template #item="{ item }">
      <UIcon :name="item.icon" />
      <span>{{ item.label }}</span>
    </template>
  </UDropdown>
</template>
