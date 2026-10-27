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

    <div class="flex flex-wrap items-center gap-2">
      <UChatAttachment orientation="vertical" name="landscape.jpg" type="image/jpeg" :url="image" />
      <UChatAttachment orientation="vertical" name="landscape.jpg" type="image/jpeg" :url="image" removable />
      <UChatAttachment orientation="vertical" name="quarterly-report.pdf" type="application/pdf" status="uploading" />
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <UChatAttachment variant="thumbnail" name="landscape.jpg" type="image/jpeg" :url="image" removable />
      <UChatAttachment
        variant="thumbnail"
        name="landscape.jpg"
        type="image/jpeg"
        :url="image"
        status="uploading"
        removable
      />
      <UChatAttachment
        variant="thumbnail"
        name="landscape.jpg"
        type="image/jpeg"
        :url="image"
        status="error"
        removable
      />
      <UChatAttachment variant="thumbnail" name="quarterly-report.pdf" type="application/pdf" removable />
    </div>
  </div>
</template>
