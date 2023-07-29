<template>
  <UAlert title="Heads <i>up</i>!" icon="i-heroicons-command-line">
    <template #title="{ title }">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="title" />
    </template>

    <template #description>
      You can add <b>components</b> to your app using the <u>cli</u>.
    </template>
  </UAlert>
</template>
