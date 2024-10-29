<script setup lang="ts">
import theme from '#build/ui/button'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
</script>

<template>
  <div class="flex flex-col gap-4 items-center">
    <div class="flex flex-col gap-4 -ms-[110px]">
      <UButtonGroup>
        <UButton>Button</UButton>
      </UButtonGroup>

      <UButtonGroup>
        <UInput placeholder="Search..." />
      </UButtonGroup>

      <UButtonGroup>
        <UButton color="neutral" variant="outline">
          Button
        </UButton>
        <UButton color="neutral" variant="subtle">
          Button
        </UButton>
        <UButton color="neutral" variant="outline">
          Button
        </UButton>
      </UButtonGroup>

      <UButtonGroup orientation="vertical">
        <UButton color="neutral" variant="outline">
          Button
        </UButton>
        <UInput placeholder="Search..." />
      </UButtonGroup>

      <UButtonGroup>
        <UButton color="neutral" variant="outline">
          Button
        </UButton>
        <UInput placeholder="Search..." />
      </UButtonGroup>

      <UButtonGroup>
        <UInput placeholder="Search..." />
        <UButton color="neutral" variant="outline">
          Button
        </UButton>
      </UButtonGroup>
    </div>

    <div class="flex gap-4 items-center justify-center">
      <UButtonGroup v-for="size in sizes" :key="size" :size="size">
        <UInput placeholder="Search..." />
        <UButton color="neutral" variant="outline">
          Button
        </UButton>
      </UButtonGroup>
    </div>
  </div>
</template>
