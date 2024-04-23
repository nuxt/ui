<template>
  <div class="flex flex-col">
    <UTooltip text="Top" :kbds="['meta', 'T']" :content="{ side: 'top' }" arrow>
      <UAvatar text="T" />
    </UTooltip>

    <div class="flex items-center gap-2 ml-[-20px]">
      <UTooltip text="Left" :kbds="['meta', 'L']" :content="{ side: 'left' }" arrow>
        <UAvatar text="L" />
      </UTooltip>

      <UTooltip text="Right" :kbds="['meta', 'R']" :content="{ side: 'right' }" arrow>
        <UAvatar text="R" />
      </UTooltip>
    </div>

    <UTooltip text="Bottom" :kbds="['meta', 'B']" arrow>
      <UAvatar text="B" />
    </UTooltip>
  </div>
</template>
