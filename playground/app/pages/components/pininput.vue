<script setup lang="ts">
const onComplete = (abc: string[]) => {
  alert(abc.join(''))
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <p>With buttons (default)</p>
      <UPinInput @complete="onComplete" />
    </div>
  </div>
</template>
