<script setup>
const links = [{
  label: 'Navigation',
  children: [{
    label: 'Vertical Navigation',
    to: '/navigation/vertical-navigation'
  }, {
    label: 'Command Palette',
    to: '/navigation/command-palette'
  }]
}, {
  label: 'Data',
  children: [{
    label: 'Table',
    to: '/data/table'
  }]
}]
</script>

<template>
  <UVerticalNavigation :links="links">
    <template #default="{ link }">
      <div class="relative text-left w-full">
        <div class="mb-2">
          {{ link.label }}
        </div>
        <UVerticalNavigation v-if="link.children" :links="link.children" />
      </div>
    </template>
  </UVerticalNavigation>
</template>
