<script setup lang="ts">
const { data: users, status } = await useFetch('https://jsonplaceholder.typicode.com/users', {
  transform: (data: { id: number, name: string }[]) => {
    return data?.map(user => ({
      label: user.name,
      value: String(user.id),
      avatar: { src: `https://i.pravatar.cc/120?img=${user.id}` }
    })) || []
  },
  lazy: true
})

function getUserAvatar(value: string) {
  return users.value?.find(user => user.value === value)?.avatar || {}
}
</script>

<template>
  <USelect
    :items="users || []"
    :loading="status === 'pending'"
    icon="i-lucide-user"
    placeholder="Select user"
    class="w-48"
  >
    <template #leading="{ modelValue, ui }">
      <UAvatar
        v-if="modelValue"
        v-bind="getUserAvatar(modelValue as string)"
        :size="ui.leadingAvatarSize()"
        :class="ui.leadingAvatar()"
      />
    </template>
  </USelect>
</template>
