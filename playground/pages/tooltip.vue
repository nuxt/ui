<template>
  <div class="flex flex-col">
    <UTooltip text="Top" :shortcuts="['⌘', 'T']" :content="{ side: 'top' }" arrow>
      <UAvatar text="T" />
    </UTooltip>

    <div class="flex items-center gap-2 -ml-[20px]">
      <UTooltip text="Left" :shortcuts="['⌘', 'L']" :content="{ side: 'left' }" arrow>
        <UAvatar text="L" />
      </UTooltip>

      <UTooltip text="Right" :shortcuts="['⌘', 'R']" :content="{ side: 'right' }" arrow>
        <UAvatar text="R" />
      </UTooltip>
    </div>

    <UTooltip text="Bottom" :shortcuts="['⌘', 'B']" arrow>
      <UAvatar text="B" />
    </UTooltip>
  </div>
</template>
