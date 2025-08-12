<script setup lang="ts">
import theme from '#build/ui/button'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
</script>

<template>
  <div class="flex flex-col gap-4 items-center">
    <div class="flex flex-col gap-4 -ms-[110px]">
      <UFieldGroup>
        <UButton>Button</UButton>
      </UFieldGroup>

      <UFieldGroup>
        <UInput placeholder="Search..." />
      </UFieldGroup>

      <UFieldGroup>
        <UButton color="neutral" variant="outline">
          Button
        </UButton>
        <UButton color="neutral" variant="subtle">
          Button
        </UButton>
        <UButton color="neutral" variant="outline">
          Button
        </UButton>
      </UFieldGroup>

      <UFieldGroup orientation="vertical">
        <UButton color="neutral" variant="outline">
          Button
        </UButton>
        <UInput placeholder="Search..." />
      </UFieldGroup>

      <UFieldGroup>
        <UButton color="neutral" variant="outline">
          Button
        </UButton>
        <UInput placeholder="Search..." />
      </UFieldGroup>

      <UFieldGroup>
        <UInput placeholder="Search..." />
        <UButton color="neutral" variant="outline">
          Button
        </UButton>
      </UFieldGroup>

      <UFieldGroup>
        <UBadge color="neutral" variant="outline" size="lg" label="https://" />
        <UInput color="neutral" variant="outline" placeholder="www.example.com" />
      </UFieldGroup>
    </div>

    <div class="flex gap-4 items-center justify-center">
      <UFieldGroup v-for="size in sizes" :key="size" :size="size">
        <UInput placeholder="Search..." />
        <UButton color="neutral" variant="outline">
          Button
        </UButton>
      </UFieldGroup>
    </div>
  </div>
</template>
