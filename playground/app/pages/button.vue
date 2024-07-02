<script setup lang="ts">
import theme from '#build/ui/button'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
const variants = Object.keys(theme.variants.variant) as Array<keyof typeof theme.variants.variant>
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <UButton class="font-bold">
        Button
      </UButton>
    </div>
    <div class="flex items-center gap-2">
      <UButton disabled>
        Disabled
      </UButton>
    </div>
    <div class="flex items-center gap-2">
      <UButton loading>
        Loading
      </UButton>
    </div>
    <div class="flex items-center gap-2">
      <UButton loading trailing>
        Loading
      </UButton>
    </div>
    <div class="flex items-center gap-2">
      <UButton v-for="variant in variants" :key="variant" icon="i-heroicons-rocket-launch" label="Button" :variant="variant" />
    </div>
    <div class="flex items-center gap-2">
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="white" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="white" variant="ghost" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="white" variant="link" />
    </div>
    <div class="flex items-center gap-2">
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="gray" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="gray" variant="ghost" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="gray" variant="link" />
    </div>
    <div class="flex items-center gap-2">
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="black" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="black" variant="ghost" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="black" variant="link" />
    </div>
    <div class="flex items-center gap-2 ml-[-129px]">
      <UButton v-for="size in sizes" :key="size" label="Button" :size="size" />
    </div>
    <div class="flex items-center gap-2 ml-[-171px]">
      <UButton v-for="size in sizes" :key="size" icon="i-heroicons-rocket-launch" label="Button" :size="size" />
    </div>
    <div class="flex items-center gap-2 ml-[-159px]">
      <UButton
        v-for="size in sizes"
        :key="size"
        icon="i-heroicons-rocket-launch"
        label="Square"
        square
        :size="size"
      />
    </div>
    <div class="flex items-center gap-2 ml-[-68px]">
      <UButton v-for="size in sizes" :key="size" icon="i-heroicons-rocket-launch" :size="size" />
    </div>
    <div class="flex items-center gap-2">
      <UButton icon="i-heroicons-rocket-launch" trailing-icon="i-heroicons-chevron-down-20-solid" label="Block" block />
    </div>
    <div class="flex items-center gap-2">
      <UButton icon="i-heroicons-cloud-arrow-down" label="Button" class="group" :ui="{ leadingIcon: 'group-hover:animate-pulse' }" />
    </div>
  </div>
</template>
