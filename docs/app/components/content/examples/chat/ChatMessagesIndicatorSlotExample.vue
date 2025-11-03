<template>
  <UChatMessages
    :messages="[
      {
        id: '1',
        role: 'user',
        parts: [{ type: 'text', text: 'Hello! Can you help me with something?' }]
      }
    ]"
    status="submitted"
    :should-scroll-to-bottom="false"
    :user="{
      avatar: { icon: 'i-lucide-user' },
      variant: 'soft',
      side: 'right'
    }"
  >
    <template #indicator>
      <UButton
        class="px-0"
        color="neutral"
        variant="link"
        loading
        loading-icon="i-lucide-loader"
        label="Thinking..."
      />
    </template>
  </UChatMessages>
</template>
