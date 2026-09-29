<template>
  <UTheme
    :ui="{
      button: {
        base: 'rounded-full'
      }
    }"
  >
    <div class="flex flex-col items-start gap-4 border border-muted p-4 rounded-lg">
      <div class="flex items-center gap-2">
        <UButton label="Outer theme" />
        <UButton label="Outer theme" color="neutral" variant="outline" />
      </div>

      <UTheme
        :ui="{
          button: {
            base: 'font-black uppercase'
          }
        }"
      >
        <div class="border border-muted p-4 rounded-lg">
          <div class="flex items-center gap-2">
            <UButton label="Inner theme" />
            <UButton label="Inner theme" color="neutral" variant="outline" />
          </div>
        </div>
      </UTheme>
    </div>
  </UTheme>
</template>
