<script setup lang="ts">
const pg = usePg()
</script>

<template>
  <Navbar />

  <div :class="pg.flex_items_center_gap_4">
    <USkeleton :class="pg.size_12_rounded_full" />

    <div :class="pg.space_y_2">
      <USkeleton :class="pg.h_4_w_250px" />
      <USkeleton :class="pg.h_4_w_200px" />
    </div>
  </div>
</template>
