<template>
  <div class="flex flex-col gap-2">
    <UTooltip text="Top" :kbds="['meta', 'T']" :content="{ side: 'top' }" arrow>
      <UButton label="Top" color="neutral" variant="outline" block />
    </UTooltip>

    <div class="grid grid-cols-2 gap-2">
      <UTooltip text="Left" :kbds="['meta', 'L']" :content="{ side: 'left' }" arrow>
        <UButton label="Left" color="neutral" variant="outline" block />
      </UTooltip>

      <UTooltip text="Right" :kbds="['meta', 'R']" :content="{ side: 'right' }" arrow>
        <UButton label="Right" color="neutral" variant="outline" block />
      </UTooltip>
    </div>

    <UTooltip text="Bottom" :kbds="['meta', 'B']" arrow>
      <UButton label="Bottom" color="neutral" variant="outline" block />
    </UTooltip>
  </div>
</template>
