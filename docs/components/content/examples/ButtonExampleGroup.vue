<template>
  <UButtonGroup>
    <USelect :options="['Email', 'Text']" placeholder="Delivery" />
    <USelectMenu :options="['Benjamin Canac', 'Anthony Fu', 'Daniel Roe']" placeholder="Send To" />
    <UInput placeholder="Message" />
    <UButton icon="i-heroicons-clipboard-document" color="gray" />
    <UDropdown :items="[[{ label: 'Now' }, { label: 'Later' }]]">
      <UButton icon="i-heroicons-paper-airplane" color="gray" />
    </UDropdown>
  </UButtonGroup>
</template>
