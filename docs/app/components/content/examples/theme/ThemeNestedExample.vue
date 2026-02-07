<template>
  <UTheme
    :ui="{
      button: {
        base: 'rounded-full'
      }
    }"
  >
    <div class="flex flex-col items-start gap-4 border p-4 border-gray-500 rounded-md">
      <UButton label="Outer theme" />

      <UTheme
        :ui="{
          button: {
            base: 'bg-error'
          }
        }"
      >
        <div class="border p-4 border-gray-500 rounded-md">
          <UButton label="Nested theme" />
        </div>
      </UTheme>
    </div>
  </UTheme>
</template>
