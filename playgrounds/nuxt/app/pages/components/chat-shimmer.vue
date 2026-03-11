<template>
  <div class="flex flex-col items-start gap-4">
    <UChatShimmer label="Thinking..." />

    <UChatShimmer label="Loading content..." :duration="4" />

    <UChatShimmer label="Generating response..." :spread="5" />
  </div>
</template>
