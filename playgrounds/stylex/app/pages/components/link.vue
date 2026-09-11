<script setup lang="ts">
const pg = usePg()
</script>

<template>
  <Navbar />

  <div :class="pg.flex_items_center_gap_2">
    <div :class="pg.flex_flex_col_items_start_gap_2_text_sm">
      <ULink raw>
        Button raw
      </ULink>

      <ULink active>
        Button active
      </ULink>
      <ULink active :class="pg.font_medium" :active-class="pg.text_highlighted">
        Button active with class
      </ULink>
      <ULink active disabled>
        Button active disabled
      </ULink>

      <ULink>
        Button inactive
      </ULink>
      <ULink :class="pg.font_medium" :inactive-class="pg.hover_text_primary">
        Button inactive with class
      </ULink>
      <ULink disabled>
        Button inactive disabled
      </ULink>
    </div>

    <div :class="pg.flex_flex_col_items_start_gap_2_text_sm">
      <ULink to="/components/link" raw>
        Link raw
      </ULink>

      <ULink to="/components/link">
        Link active
      </ULink>
      <ULink to="/components/link" :class="pg.font_medium" :active-class="pg.text_highlighted">
        Link active with class
      </ULink>
      <ULink to="/components/link" disabled>
        Link active disabled
      </ULink>

      <ULink to="/components/button">
        Link inactive
      </ULink>
      <ULink to="/components/button" :class="pg.font_medium" :inactive-class="pg.hover_text_primary">
        Link inactive with class
      </ULink>
      <ULink to="/components/button" disabled>
        Link inactive disabled
      </ULink>
    </div>
  </div>
</template>
