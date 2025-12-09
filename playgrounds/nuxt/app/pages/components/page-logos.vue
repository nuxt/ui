<script setup lang="ts">
const marquee = ref(false)
</script>

<template>
  <Navbar>
    <USwitch v-model="marquee" label="Marquee" />
  </Navbar>

  <UPageLogos title="Trusted by the best front-end teams" :marquee="marquee" class="w-lg">
    <UIcon name="simple-icons:github" class="size-10 shrink-0" />
    <UIcon name="simple-icons:discord" class="size-10 shrink-0" />
    <UIcon name="simple-icons:x" class="size-10 shrink-0" />
    <UIcon name="simple-icons:instagram" class="size-10 shrink-0" />
    <UIcon name="simple-icons:linkedin" class="size-10 shrink-0" />
    <UIcon name="simple-icons:facebook" class="size-10 shrink-0" />
  </UPageLogos>
</template>
