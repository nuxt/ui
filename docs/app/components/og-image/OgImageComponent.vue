<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description: string
  component: string
  module: string
}>(), {
  module: ''
})
</script>

<template>
  <div class="bg-white w-full h-full flex flex-col">
    <div class="absolute top-0 bottom-0 left-26 w-[2px] bg-slate-200" />
    <div class="absolute top-0 bottom-0 right-26 w-[2px] bg-slate-200" />
    <div class="absolute top-12 inset-x-0 h-[2px] bg-slate-200" />
    <svg
      class="absolute top-[24px] left-33 bg-white p-1 h-11 w-11"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M281.44 397.667H438.32C443.326 397.667 448.118 395.908 452.453 393.427C456.789 390.946 461.258 387.831 463.76 383.533C466.262 379.236 468.002 374.36 468 369.399C467.998 364.437 466.266 359.563 463.76 355.268L357.76 172.947C355.258 168.65 352.201 165.534 347.867 163.053C343.532 160.573 337.325 158.813 332.32 158.813C327.315 158.813 322.521 160.573 318.187 163.053C313.852 165.534 310.795 168.65 308.293 172.947L281.44 219.587L227.733 129.13C225.229 124.834 222.176 120.307 217.84 117.827C213.504 115.346 208.713 115 203.707 115C198.701 115 193.909 115.346 189.573 117.827C185.238 120.307 180.771 124.834 178.267 129.13L46.8267 355.268C44.3208 359.563 44.0022 364.437 44 369.399C43.9978 374.36 44.3246 379.235 46.8267 383.533C49.3288 387.83 53.7979 390.946 58.1333 393.427C62.4688 395.908 67.2603 397.667 72.2667 397.667H171.2C210.401 397.667 238.934 380.082 258.827 346.787L306.88 263.4L332.32 219.587L410.053 352.44H306.88L281.44 397.667ZM169.787 352.44H100.533L203.707 174.36L256 263.4L221.361 323.784C208.151 345.387 193.089 352.44 169.787 352.44Z" fill="#00DC82" />
    </svg>
    <div class="w-full border-b-2 border-slate-200">
      <div class="mx-34 mt-16">
        <h1 class="text-4xl font-semibold mb-0 flex gap-1">
          <span>{{ title }}</span>
          <sup v-if="module === 'ui-pro'" class="text-base font-semibold align-top text-[#00C16A]">PRO</sup>
        </h1>
        <p class="text-2xl text-slate-500 truncate line-clamp-1 mt-2 mb-8">
          {{ description }}
        </p>
      </div>
    </div>
    <div class="mx-[106px] bg-slate-50 text-center">
      <img
        :src="`/components/light/${component}.png`"
        class="mx-auto h-[400px] object-contain"
      >
    </div>
  </div>
</template>
