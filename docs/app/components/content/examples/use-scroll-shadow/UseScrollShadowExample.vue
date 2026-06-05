<script setup lang="ts">
const el = useTemplateRef('el')

const { style } = useScrollShadow(el)
</script>

<template>
  <div class="max-w-sm bg-elevated/50 rounded-lg">
    <div
      ref="el"
      :style="style"
      class="h-72 p-4 space-y-4 overflow-y-auto"
    >
      <p v-for="i in 6" :key="i">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor quam. Morbi accumsan cursus enim, sed ultricies sapien.
      </p>
    </div>
  </div>
</template>
