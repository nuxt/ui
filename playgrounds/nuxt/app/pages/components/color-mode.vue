<template>
  <Navbar to="https://ui.nuxt.com/docs/getting-started/integrations/color-mode" />

  <div class="flex flex-col items-center gap-4">
    <div class="flex items-center gap-2">
      <UColorModeSwitch />
      <UColorModeSelect />
      <UColorModeButton />
    </div>

    <div class="flex items-center gap-2">
      <UColorModeAvatar light="https://github.com/vuejs.png" dark="https://github.com/nuxt.png" />
      <UColorModeImage light="https://github.com/vuejs.png" dark="https://github.com/nuxt.png" class="size-8" />
    </div>
  </div>
</template>
