<script lang="ts" setup>
const model = ref([])
const fileuploadEl = ref(null)
</script>

<template>
  <UFileUpload ref="fileuploadEl" v-model="model" accept="image/*" />
  {{ model }}
  {{ fileuploadEl }}
</template>
