<script setup>
const items = [
  [
    {
      label: "Benjamin Canac",
      slot: "account",
      descriotion: "Owner",
      points: "1000",
      avatar: {
        src: "https://avatars.githubusercontent.com/u/739984?v=4",
      },
    },
    {
      label: "Settings",
      icon: "i-heroicons-cog-20-solid",
    },
    {
      label: "Upgrade To Pro",
      iconClass: "text-yellow-500 animate-pulse",
      icon: "i-heroicons-sparkles",
      slot: "upgrade",
    },
    {
      label: "History",
      icon: "i-heroicons-clock-20-solid",
    },
    {
      label: "Logout",
      icon: "i-heroicons-arrow-right-on-rectangle",
    },
  ],
];

const branches = [
  [
    {
      label: "Branch 1",
      mail: "example@mail.com",
    },
    {
      label: "Branch 2",
      mail: "example@mail.com",
    },
    {
      label: "Branch 3",
      mail: "example@mail.com",
    },
    {
      label: "Branch 4",
      mail: "example@mail.com",
    },
  ],
];
</script>

<template>
  <UDropdown
    :items="items"
    :ui="{ rounded: 'rounded-md', with: 'w-100' }"
    :popper="{ placement: 'bottom-start' }"
  >
    <UButton
      color="white"
      label="Profile"
      trailing-icon="i-heroicons-chevron-down-20-solid"
    />
    <template #account="{ item }">
      <div class="flex gap-x-2 justify-between items-center border-b pb-1">
        <div>
          <UAvatar :src="item.avatar.src" :ui="{ rounded: 'rounded-md' }" />
        </div>

        <div class="flex flex-col items-start w-full">
          <div class="text-sm font-medium text-gray-900">
            {{ item.label }}
          </div>

          <div class="flex justify-between gap-x-2">
            <div class="text-sm text-gray-500 inline-flex items-center">
              <UIcon name="i-heroicons-hashtag" /> :
              {{ item.descriotion }}
            </div>

            <div
              class="text-sm text-yellow-500 inline-flex items-center gap-x-0.5"
            >
              <UIcon name="i-heroicons-currency-dollar" /> :
              <span>{{ item.points }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #upgrade="{ item }">
      <UIcon :name="item.icon" class="animate-pulse text-yellow-500" />
      <span class="text-yellow-500">{{ item.label }}</span>
    </template>
  </UDropdown>

  <UDropdown
    class="mx-2"
    :items="branches"
    :ui="{ rounded: 'rounded-md', with: 'w-100' }"
    :popper="{ placement: 'bottom-start' }"
  >
    <UButton
      color="white"
      label="Branches"
      trailing-icon="i-heroicons-chevron-down-20-solid"
    />

    <template #item="{ item }">
      <div>
        <div class="flex gap-x-2 justify-between items-center">
          <div>
            <UAvatar :alt="item.label" :ui="{ rounded: 'rounded-md' }" />
          </div>

          <div class="flex flex-col items-start">
            <div class="text-sm font-medium text-gray-900">
              {{ item.label }}
            </div>

            <div class="text-sm text-gray-500 inline-flex items-center">
              {{ item.mail }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDropdown>
</template>
