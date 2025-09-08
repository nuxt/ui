<template>
  <UAvatarGroup :ui="{ base: 'rounded-none squircle' }">
    <UAvatar
      src="https://github.com/benjamincanac.png"
      alt="Benjamin Canac"
      class="rounded-none squircle"
    />

    <UAvatar
      src="https://github.com/romhml.png"
      alt="Romain Hamel"
      class="rounded-none squircle"
    />

    <UAvatar
      src="https://github.com/noook.png"
      alt="Neil Richter"
      class="rounded-none squircle"
    />
  </UAvatarGroup>
</template>

<style>
.squircle {
  mask-image: url("data:image/svg+xml,%3csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M100 0C20 0 0 20 0 100s20 100 100 100 100-20 100-100S180 0 100 0Z'/%3e%3c/svg%3e");
  mask-size: contain;
  mask-position: center;
  mask-repeat: no-repeat;
}
</style>
