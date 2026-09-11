<script setup lang="ts">
const pg = usePg()

const open = ref(false)
const openCustomAnchor = ref(false)
const loading = ref(false)

function send() {
  loading.value = true

  setTimeout(() => {
    loading.value = false
    open.value = false
  }, 1000)
}
</script>

<template>
  <Navbar />

  <div :class="pg.text_center_min_h_0">
    <div>
      <UPopover arrow :content="{ side: 'top' }">
        <UButton label="Click me top" color="neutral" variant="outline" />

        <template #content="{ close }">
          <div :class="pg.flex_justify_center_gap_2_p_4_w_48">
            <UButton label="Close" color="neutral" @click="close" />
          </div>
        </template>
      </UPopover>

      <div :class="pg.flex_items_center_gap_2_my_2">
        <UPopover arrow :content="{ side: 'left' }">
          <UButton label="Click me left" color="neutral" variant="outline" />

          <template #content>
            <div :class="pg.w_48_h_16" />
          </template>
        </UPopover>

        <UPopover arrow :content="{ side: 'right' }">
          <UButton label="Click me right" color="neutral" variant="outline" />

          <template #content>
            <div :class="pg.w_48_h_16" />
          </template>
        </UPopover>
      </div>

      <UPopover v-model:open="open" arrow>
        <UButton label="Click me bottom" color="neutral" variant="outline" />

        <template #content>
          <div :class="pg.flex_justify_center_gap_2_p_4_w_48">
            <UButton label="Close" color="neutral" @click="open = false" />
            <UButton label="Send" color="neutral" trailing-icon="i-lucide-send-horizontal" :loading="loading" @click="send" />
          </div>
        </template>
      </UPopover>

      <div :class="pg.mt_8_relative">
        <UPopover
          v-model:open="openCustomAnchor"
          :dismissible="false"
        >
          <template #anchor>
            <UInput placeholder="Search" :class="pg.w_56" @focus="openCustomAnchor = true" />
          </template>

          <template #content>
            <Placeholder :class="pg.size_48_m_4_inline_flex" />
          </template>
        </UPopover>
      </div>
    </div>

    <div :class="pg.mt_24">
      <UPopover mode="hover" arrow :content="{ side: 'top' }">
        <UButton label="Hover me top" color="neutral" variant="outline" />

        <template #content>
          <div :class="pg.w_48_h_16" />
        </template>
      </UPopover>

      <div :class="pg.flex_items_center_gap_2_my_2">
        <UPopover mode="hover" arrow :content="{ side: 'left' }">
          <UButton label="Hover me left" color="neutral" variant="outline" />

          <template #content>
            <div :class="pg.w_48_h_16" />
          </template>
        </UPopover>

        <UPopover mode="hover" arrow :content="{ side: 'right' }">
          <UButton label="Hover me right" color="neutral" variant="outline" />

          <template #content>
            <div :class="pg.w_48_h_16" />
          </template>
        </UPopover>
      </div>

      <UPopover mode="hover" arrow>
        <UButton label="Hover me bottom" color="neutral" variant="outline" />

        <template #content>
          <div :class="pg.w_48_h_16" />
        </template>
      </UPopover>
    </div>
  </div>
</template>
