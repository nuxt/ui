<script lang="ts" setup>
defineOptions({
  inheritAttrs: false
})

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="w-full h-full flex flex-col justify-between items-start bg-[#020420] p-20 pt-32 pb-16">
    <div
      style="position: absolute;width: 1156px;height: 1000px;left: -215px;top: -337px;background: radial-gradient(50% 50% at 50% 50%, #00DC82 0%, rgba(0, 220, 130, 0) 100%);filter: blur(180.5px);opacity: 0.5;"
    />
    <div>
      <h1 class="text-8xl mb-4 text-white">
        {{ title }}
      </h1>
      <p class="text-5xl text-gray-200 leading-tight pr-10">
        {{ description }}
      </p>
    </div>
    <LogoGreen class="w-[306px] h-[60px] text-white" />
  </div>
</template>
