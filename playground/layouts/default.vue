<template>
  <div class="p-10">
    <div class="container mx-auto">
      <div class="flex flex-row">
        <div class="basis-40">
          <UVerticalNavigation :links="links" />
        </div>
        <div class="pl-5 grow">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const links = [{
  label: 'Home',
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/739984?v=4'
  },
  badge: 100,
  to: '/'
}, {
  label: 'Forms',
  icon: 'i-heroicons-pencil-square',
  to: '/forms'
}]
</script>
