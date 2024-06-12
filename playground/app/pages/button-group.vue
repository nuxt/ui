<script setup lang="ts">
import theme from '#build/ui/button'

const sizes = Object.keys(theme.variants.size)
</script>

<template>
  <div class="flex flex-col gap-4 items-center">
    <div class="flex flex-col gap-4 -ml-[110px]">
      <UButtonGroup>
        <UButton> Click me! </UButton>
      </UButtonGroup>

      <UButtonGroup>
        <UInput />
      </UButtonGroup>

      <UButtonGroup>
        <UButton> Click me! </UButton>
        <UButton color="white">
          Click me!
        </UButton>
        <UButton> Click me! </UButton>
      </UButtonGroup>

      <UButtonGroup orientation="vertical">
        <UButton color="white">
          Click me!
        </UButton>
        <UInput />
      </UButtonGroup>

      <UButtonGroup>
        <UButton color="white">
          Click me!
        </UButton>
        <UInput />
      </UButtonGroup>

      <UButtonGroup>
        <UInput />
        <UButton color="white">
          Click me!
        </UButton>
      </UButtonGroup>
    </div>

    <div class="flex gap-4 items-center justify-center">
      <UButtonGroup v-for="size in sizes" :key="size" :size="(size as any)">
        <UInput />
        <UButton color="white">
          Click me!
        </UButton>
      </UButtonGroup>
    </div>
  </div>
</template>
