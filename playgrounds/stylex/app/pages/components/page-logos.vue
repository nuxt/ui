<script setup lang="ts">
const pg = usePg()

const marquee = ref(false)
</script>

<template>
  <Navbar>
    <USwitch v-model="marquee" label="Marquee" />
  </Navbar>

  <UPageLogos title="Trusted by the best front-end teams" :marquee="marquee" :class="pg.w_lg">
    <UIcon name="simple-icons:github" :class="pg.size_10_shrink_0" />
    <UIcon name="simple-icons:discord" :class="pg.size_10_shrink_0" />
    <UIcon name="simple-icons:x" :class="pg.size_10_shrink_0" />
    <UIcon name="simple-icons:instagram" :class="pg.size_10_shrink_0" />
    <UIcon name="simple-icons:linkedin" :class="pg.size_10_shrink_0" />
    <UIcon name="simple-icons:facebook" :class="pg.size_10_shrink_0" />
  </UPageLogos>
</template>
