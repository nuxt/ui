<script setup lang="ts">
const pg = usePg()

const page = ref(5)
</script>

<template>
  <Navbar />

  <div :class="pg.flex_flex_col_gap_4">
    <div :class="pg.flex_flex_col_gap_2">
      <p>With buttons (default)</p>
      <UPagination v-model:page="page" :total="100" :sibling-count="1" show-edges />
    </div>

    <div :class="pg.flex_flex_col_gap_2">
      <p>With links</p>
      <UPagination v-model:page="page" :total="100" :to="page => ({ query: { page } })" :sibling-count="1" show-edges />
    </div>
  </div>
</template>
