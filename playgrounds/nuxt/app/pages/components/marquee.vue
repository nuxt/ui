<script setup lang="ts">
import theme from '#build/ui/marquee'

const orientations = Object.keys(theme.variants.orientation)

const orientation = ref('horizontal' as keyof typeof theme.variants.orientation)
const pauseOnHover = ref(false)
const reverse = ref(false)
const overlay = ref(false)
</script>

<template>
  <Navbar>
    <USelect v-model="orientation" :items="orientations" />
    <USwitch v-model="pauseOnHover" label="Pause" />
    <USwitch v-model="reverse" label="Reverse" />
    <USwitch v-model="overlay" label="Overlay" />
  </Navbar>

  <UMarquee
    :orientation="orientation"
    :pause-on-hover="pauseOnHover"
    :reverse="reverse"
    :overlay="overlay"
    class="data-[orientation=horizontal]:w-lg"
  >
    <UIcon name="simple-icons:github" class="size-10 shrink-0" />
    <UIcon name="simple-icons:discord" class="size-10 shrink-0" />
    <UIcon name="simple-icons:x" class="size-10 shrink-0" />
    <UIcon name="simple-icons:instagram" class="size-10 shrink-0" />
    <UIcon name="simple-icons:linkedin" class="size-10 shrink-0" />
    <UIcon name="simple-icons:facebook" class="size-10 shrink-0" />
  </UMarquee>
</template>
