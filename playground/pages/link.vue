<script setup lang="ts">
const activeClass = 'text-primary-500 dark:text-primary-400'
const inactiveClass = 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
</script>

<template>
  <div class="flex flex-col items-start gap-2 text-sm">
    <ULink v-slot="{ active }" active :active-class="activeClass" :inactive-class="inactiveClass">
      Button active ({{ active }})
    </ULink>
    <ULink v-slot="{ active }" disabled :active-class="activeClass" :inactive-class="inactiveClass">
      Button disabled ({{ active }})
    </ULink>
    <ULink v-slot="{ active }" to="/link" :active-class="activeClass" :inactive-class="inactiveClass">
      Link ({{ active }})
    </ULink>
    <ULink v-slot="{ active }" to="/link" disabled :active-class="activeClass" :inactive-class="inactiveClass">
      Link disabled ({{ active }})
    </ULink>
    <ULink v-slot="{ active }" to="/modal" :active-class="activeClass" :inactive-class="inactiveClass">
      Modal ({{ active }})
    </ULink>
  </div>
</template>
