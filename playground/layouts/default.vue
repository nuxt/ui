<template>
  <div class="cwa-p-10">
    <div class="cwa-container cwa-mx-auto">
      <div class="cwa-flex cwa-flex-row">
        <div class="cwa-basis-40">
          <UVerticalNavigation :links="links" />
        </div>
        <div class="cwa-pl-5 cwa-grow">
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
