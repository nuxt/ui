<template>
  <UChip size="md" position="bottom-right" inset :ui="{ base: '-mx-2 rounded-none ring-0', background: '' }">
    <UAvatar
      src="https://avatars.githubusercontent.com/u/739984?v=4"
      alt="Avatar"
      size="lg"
    />

    <template #content>
      <UAvatar
        src="https://avatars.githubusercontent.com/in/80442?v=4"
        alt="Avatar"
        size="xs"
        :ui="{ rounded: 'rounded-md' }"
        class="shadow-md"
      />
    </template>
  </UChip>
</template>
