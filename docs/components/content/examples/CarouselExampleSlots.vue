<script setup>
const items = [
  {
    id: 'Atinux',
    label: 'Atinux',
    href: 'https://github.com/Atinux',
    target: '_blank',
    avatar: { src: 'https://avatars.githubusercontent.com/u/904724?v=4' }
  },
  {
    id: 'Pi0',
    label: 'Pi0',
    href: 'https://github.com/Pi0',
    target: '_blank',
    avatar: { src: 'https://avatars.githubusercontent.com/u/5158436?v=4' }
  },
  {
    id: 'Gobler',
    label: 'Gobler',
    href: 'https://github.com/Gobler',
    target: '_blank',
    avatar: { src: 'https://avatars.githubusercontent.com/u/4085733?v=4' }
  },
  {
    id: 'manniL',
    label: 'manniL',
    href: 'https://github.com/Atinux',
    target: '_blank',
    avatar: { src: 'https://avatars.githubusercontent.com/u/640208?v=4' }
  },
  {
    id: 'antfu',
    label: 'antfu',
    href: 'https://github.com/antfu',
    target: '_blank',
    avatar: { src: 'https://avatars.githubusercontent.com/u/11247099?v=4' }
  },
  {
    id: 'alexchopin',
    label: 'alexchopin',
    href: 'https://github.com/alexchopin',
    target: '_blank',
    avatar: { src: 'https://avatars.githubusercontent.com/u/4084277?v=4' }
  },
  {
    id: 'danielroe',
    label: 'danielroe',
    href: 'https://github.com/danielroe',
    target: '_blank',
    avatar: { src: 'https://avatars.githubusercontent.com/u/28706372?v=4' }
  },
  {
    id: 'benjamincanac',
    label: 'benjamincanac',
    href: 'https://github.com/benjamincanac',
    target: '_blank',
    avatar: { src: 'https://avatars.githubusercontent.com/u/739984?v=4' }
  }
]
</script>

<template>
  <UCarousel :items="items">
    <template #item="{ item }">
      <div class="flex place-content-center">
        <img :src="item.avatar.src" :alt="item.label" class="rounded-full p-2">
      </div>
    </template>
    <template #next="{ onClick, isDisabled }">
      <button v-show="!isDisabled" @click="onClick()">
        Next
      </button>
    </template>
    <template #prev="{ onClick, isDisabled }">
      <button v-show="!isDisabled" @click="onClick()">
        Prev
      </button>
    </template>
    <template #indicator="{ onClick, indicator, isCurrent }">
      <button
        :class="[{
          'bg-white text-black': isCurrent,
          'bg-red': !isCurrent,
        }, 'p-2']"
        @click="onClick(indicator)"
      >
        {{ indicator }}
      </button>
    </template>
  </UCarousel>
</template>
