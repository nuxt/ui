<script setup lang="ts">
import theme from '#build/ui/navigation-menu'

const orientations = Object.keys(theme.variants.orientation)

const orientation = ref('horizontal' as const)
const loop = ref(false)
const autoplay = ref(false)
const autoScroll = ref(false)
const fade = ref(false)
const wheelGestures = ref(false)
const classNames = ref(false)
const arrows = ref(false)
const dots = ref(false)
const bind = computed(() => ({
  loop: loop.value,
  orientation: orientation.value,
  autoplay: autoplay.value,
  autoScroll: autoScroll.value,
  fade: fade.value,
  wheelGestures: wheelGestures.value,
  classNames: classNames.value,
  arrows: arrows.value,
  dots: dots.value
}))

const items = Array.from({ length: 10 }).map((_, index) => index)
</script>

<template>
  <div class="space-y-12">
    <div class="space-y-4">
      <div class="flex justify-center">
        <USelect v-model="orientation" :items="orientations" placeholder="Orientation" />
      </div>
      <fieldset class="flex items-center justify-center gap-2">
        <legend class="text-xs font-mono font-bold text-center mb-2">
          Options
        </legend>
        <USwitch v-model="loop" label="Loop" />
        <USwitch v-model="arrows" label="Arrows" />
        <USwitch v-model="dots" label="Dots" />
      </fieldset>
      <fieldset class="flex items-center justify-center gap-2">
        <legend class="text-xs font-mono font-bold text-center mb-2">
          Plugins
        </legend>
        <USwitch v-model="autoplay" label="Autoplay" />
        <USwitch v-model="autoScroll" label="Autoscroll" />
        <USwitch v-model="fade" label="Fade" />
        <USwitch v-model="classNames" label="Class Names" />
        <USwitch v-model="wheelGestures" label="Wheel Gestures" />
      </fieldset>
    </div>

    <UCarousel v-slot="{ index }" v-bind="bind" :items="items" class="w-[320px] mx-auto" :ui="{ container: 'h-[320px]' }">
      <img :src="`https://picsum.photos/640/640?v=${index}`" width="320" height="320" class="rounded-lg shadow">
    </UCarousel>

    <UCarousel v-slot="{ index }" v-bind="bind" :items="items" :ui="{ item: 'basis-1/3' }" class="w-full max-w-xs mx-auto">
      <img :src="`https://picsum.photos/640/640?v=${index}`" width="320" height="320" class="rounded-lg shadow">
    </UCarousel>

    <UCarousel v-slot="{ index }" v-bind="bind" :items="items" :ui="{ item: 'basis-[70%] transition-opacity ease-in-out [&:not(.is-snapped)]:opacity-10' }" class="w-full max-w-[48rem] mx-auto">
      <img :src="`https://picsum.photos/600/350?v=${index}`" class="rounded-lg shadow">
    </UCarousel>
  </div>
</template>
