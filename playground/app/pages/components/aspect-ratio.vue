<template>
  <div class="w-[500px] overflow-hidden rounded-[var(--ui-radius)]">
    <UAspectRatio :ratio="16 / 9">
      <img class="h-full w-full object-cover" src="https://picsum.photos/800/480?random=1" alt="">
    </UAspectRatio>
  </div>
</template>
