<script setup lang="ts">
const el = useTemplateRef('el')

const { style } = useScrollShadow(el, { orientation: 'horizontal' })
</script>

<template>
  <UDashboardNavbar class="absolute top-0 inset-x-0 lg:border-b-0" />

  <div ref="el" class="max-w-[500px] overflow-x-auto flex gap-4" :style="style">
    <div v-for="i in 100" :key="i" class="size-50 ring ring-default rounded-lg p-4 text-center">
      {{ i }}
    </div>
  </div>
</template>
