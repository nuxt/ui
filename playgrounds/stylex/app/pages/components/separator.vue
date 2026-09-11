<script setup lang="ts">
const pg = usePg()
</script>

<template>
  <Navbar />

  <div :class="pg.flex_flex_col_gap_4_min_h_0">
    <div>
      <p :class="pg.font_semibold_text_highlighted">
        Nuxt UI
      </p>
      <p>An open-source UI component library.</p>
    </div>

    <USeparator icon="i-simple-icons-nuxtdotjs" type="dashed" />

    <div :class="pg.h_24_flex_gap_4_items_center">
      <div :class="pg.flex_1_text_center">
        Blog
      </div>

      <USeparator
        :avatar="{ src: 'https://github.com/benjamincanac.png' }"
        decorative
        orientation="vertical"
      />

      <div :class="pg.flex_1_text_center">
        Docs
      </div>

      <USeparator decorative orientation="vertical">
        <UAvatar size="2xs" src="https://github.com/sandros94.png" />
      </USeparator>

      <div :class="pg.flex_1_text_center">
        Source
      </div>
    </div>

    <USeparator label="As simple as it gets" type="dotted" size="lg" color="primary" />

    <USeparator label="Start" position="start" />

    <USeparator label="End" position="end" />

    <div :class="pg.h_24_flex_gap_4_items_center">
      <div :class="pg.flex_1_text_center">
        Start
      </div>

      <USeparator
        :avatar="{ src: 'https://github.com/benjamincanac.png' }"
        decorative
        orientation="vertical"
        position="start"
      />

      <USeparator decorative orientation="vertical" position="end">
        <UAvatar size="2xs" src="https://github.com/sandros94.png" />
      </USeparator>

      <div :class="pg.flex_1_text_center">
        End
      </div>
    </div>
  </div>
</template>
