<script setup lang="ts">
const text = ref('Loading your content...')
const duration = ref(2)
const spread = ref(2)
const asElement = ref('span')
</script>

<template>
  <Navbar>
    <UInput v-model="text" placeholder="Text" class="w-48" />
    <UTooltip text="Duration (seconds) - How long the shimmer animation lasts for one cycle">
      <UInputNumber
        v-model="duration"
        :min="0.5"
        :max="10"
        :step="0.5"
        placeholder="Duration"
        class="w-24"
      />
    </UTooltip>
    <UTooltip text="Spread (pixels/char) - How wide the shimmer highlight appears per character">
      <UInputNumber
        v-model="spread"
        :min="1"
        :max="10"
        :step="1"
        placeholder="Spread"
        class="w-24"
      />
    </UTooltip>
  </Navbar>

  <div class="flex flex-col items-center gap-6">
    <UChatShimmer
      :key="`${duration}-${spread}`"
      :text="text"
      :duration="duration"
      :spread="spread"
      :as="asElement"
      class="text-xl"
    />
    <UChatShimmer text="AI is thinking..." :duration="1.5" class="text-lg" />
    <UChatShimmer text="Processing..." :duration="3" class="text-base" />
  </div>
</template>
