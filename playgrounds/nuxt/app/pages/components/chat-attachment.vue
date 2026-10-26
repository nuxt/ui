<script setup lang="ts">
const image = 'https://picsum.photos/id/1015/200'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-2">
      <UChatAttachment name="quarterly-report.pdf" type="application/pdf" />
      <UChatAttachment name="quarterly-report.pdf" type="application/pdf" removable />
      <UChatAttachment name="quarterly-report.pdf" type="application/pdf" status="uploading" />
      <UChatAttachment name="quarterly-report.pdf" type="application/pdf" status="error" removable />
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <UChatAttachment name="landscape.jpg" type="image/jpeg" :url="image" />
      <UChatAttachment name="landscape.jpg" type="image/jpeg" :url="image" removable />
      <UChatAttachment name="landscape.jpg" type="image/jpeg" :url="image" status="uploading" />
      <UChatAttachment name="landscape.jpg" type="image/jpeg" :url="image" status="error" removable />
    </div>
  </div>
</template>
