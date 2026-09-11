<script setup lang="ts">
const pg = usePg()
</script>

<template>
  <UDashboardNavbar :class="pg.absolute_top_0_inset_x_0_lg_border_b_0" />

  <div :class="pg.text_center_space_y_4">
    <h1 :class="pg.text_2xl_font_bold_text_primary">
      Playground
    </h1>
    <p :class="pg.max_w_sm_mx_auto_text_muted">
      Explore and test all Nuxt UI components in an interactive environment.
    </p>
  </div>
</template>
