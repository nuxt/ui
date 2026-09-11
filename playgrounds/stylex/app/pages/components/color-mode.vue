<script setup lang="ts">
const pg = usePg()
</script>

<template>
  <Navbar to="https://ui.nuxt.com/docs/getting-started/integrations/color-mode" />

  <div :class="pg.flex_flex_col_items_center_gap_4">
    <div :class="pg.flex_items_center_gap_2">
      <UColorModeSwitch />
      <UColorModeSelect />
      <UColorModeButton />
    </div>

    <div :class="pg.flex_items_center_gap_2">
      <UColorModeAvatar light="https://github.com/vuejs.png" dark="https://github.com/nuxt.png" />
      <UColorModeImage light="https://github.com/vuejs.png" dark="https://github.com/nuxt.png" :class="pg.size_8" />
    </div>
  </div>
</template>
