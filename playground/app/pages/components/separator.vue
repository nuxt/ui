<template>
  <div class="flex flex-col gap-4">
    <div>
      <p class="font-semibold text-[var(--ui-text-highlighted)]">
        Nuxt UI
      </p>
      <p>An open-source UI component library.</p>
    </div>

    <USeparator icon="i-simple-icons-nuxtdotjs" type="dashed" />

    <div class="h-24 flex gap-4 items-center">
      <div class="flex-1 text-center">
        Blog
      </div>

      <USeparator
        :avatar="{ src: 'https://github.com/benjamincanac.png' }"
        decorative
        orientation="vertical"
      />

      <div class="flex-1 text-center">
        Docs
      </div>

      <USeparator decorative orientation="vertical">
        <UAvatar size="2xs" src="https://github.com/sandros94.png" />
      </USeparator>

      <div class="flex-1 text-center">
        Source
      </div>
    </div>

    <USeparator label="As simple as it gets" type="dotted" size="lg" color="primary" />
  </div>
</template>
