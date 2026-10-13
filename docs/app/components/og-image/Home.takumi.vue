<script setup lang="ts">
import { computed } from 'vue'

/**
 * The landing's hero as a card: the wordmark, the two-tone title and the
 * description on the left, the theme as the file you would ship on the
 * right with the preset pills under it, over the hero's texture. `dark`
 * swaps the palette: the README banner is rendered from this template too.
 */
const props = withDefaults(defineProps<{
  lead?: string
  accent?: string
  description?: string
  dark?: boolean
}>(), {
  dark: false
})

// the site's tokens, resolved to hex since takumi reads no CSS variables
const c = computed(() => props.dark
  ? { bg: '#0f172b', fg: '#ffffff', muted: '#90a1b9', dot: '#314158', primary: '#00DC82', card: '#1d293d', border: '#314158', tab: '#2c3a4f', code: '#0f172b', kw: '#89ddff', str: '#c3e88d', text: '#e2e8f0', val: '#f78c6c' }
  : { bg: '#ffffff', fg: '#0f172b', muted: '#62748e', dot: '#cad5e2', primary: '#00C16A', card: '#f8fafc', border: '#e2e8f0', tab: '#e6eaf0', code: '#ffffff', kw: '#39adb5', str: '#91b859', text: '#314158', val: '#f76d47' }
)

// each preset's primary as the theme menu chips show it, 500 in light, 400 in dark
const PRESETS = {
  light: { default: '#00C16A', mono: '#000000', cobalt: '#0d6efd', sky: '#00a6f4', mint: '#00bba7', iris: '#8e51ff', crimson: '#fb2c36', coral: '#ff2056', sunset: '#ff6900', carbon: '#fe9a00', bubblegum: '#f6339a', parchment: '#d97757' },
  dark: { default: '#00DC82', mono: '#ffffff', cobalt: '#3d8bfd', sky: '#00bcff', mint: '#00d5be', iris: '#a684ff', crimson: '#ff6467', coral: '#ff637e', sunset: '#ff8904', carbon: '#ffb900', bubblegum: '#fb64b6', parchment: '#dd9977' }
}
const preset = (id: keyof typeof PRESETS.light) => PRESETS[props.dark ? 'dark' : 'light'][id]
const pill = (id: keyof typeof PRESETS.light) => ({ backgroundColor: `${preset(id)}26`, borderColor: preset(id) })
</script>

<template>
  <!-- the families named here are what nuxt-og-image fetches for the render -->
  <div class="size-full flex flex-col" :style="{ backgroundColor: c.bg, color: c.fg, fontFamily: 'Public Sans' }">
    <!-- The landing hero's texture, drawn once as an SVG since takumi has no
         background-image, mask or oklch: a dot grid fading in and out
         vertically, a few of its dots lit in primary, and the horizon, a
         glow rising from the bottom edge under a hairline that fades out at
         both ends. -->
    <svg class="absolute inset-0" width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="14" cy="14" r="1" :fill="c.dot" />
        </pattern>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity="0" />
          <stop offset="0.3" stop-color="#fff" />
          <stop offset="0.7" stop-color="#fff" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </linearGradient>
        <mask id="fade-mask">
          <rect width="1200" height="630" fill="url(#fade)" />
        </mask>
        <linearGradient id="glow" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" :stop-color="c.primary" stop-opacity="0.15" />
          <stop offset="1" :stop-color="c.primary" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" :stop-color="c.primary" stop-opacity="0" />
          <stop offset="0.3" :stop-color="c.primary" />
          <stop offset="0.7" :stop-color="c.primary" />
          <stop offset="1" :stop-color="c.primary" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#dots)" opacity="0.5" mask="url(#fade-mask)" />
      <g :fill="c.primary" mask="url(#fade-mask)">
        <circle cx="70" cy="126" r="1.5" /><circle cx="266" cy="70" r="1.5" /><circle cx="434" cy="238" r="1.5" /><circle cx="602" cy="98" r="1.5" /><circle cx="770" cy="322" r="1.5" /><circle cx="910" cy="182" r="1.5" /><circle cx="1050" cy="406" r="1.5" /><circle cx="1134" cy="70" r="1.5" /><circle cx="1162" cy="266" r="1.5" /><circle cx="322" cy="434" r="1.5" /><circle cx="686" cy="462" r="1.5" /><circle cx="994" cy="518" r="1.5" />
      </g>
      <rect y="450" width="1200" height="180" fill="url(#glow)" />
      <rect y="628" width="1200" height="2" fill="url(#line)" />
    </svg>

    <div class="absolute left-[64px] top-[150px] w-[470px] flex flex-col">
      <svg class="w-[189px] h-[37px]" viewBox="0 0 1020 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M377 200C379.16 200 381 198.209 381 196V103C381 103 386 112 395 127L434 194C435.785 197.74 439.744 200 443 200H470V50H443C441.202 50 439 51.4941 439 54V148L421 116L385 55C383.248 51.8912 379.479 50 376 50H350V200H377Z" fill="currentColor" />
        <path d="M726 92H739C742.314 92 745 89.3137 745 86V60H773V92H800V116H773V159C773 169.5 778.057 174 787 174H800V200H783C759.948 200 745 185.071 745 160V116H726V92Z" fill="currentColor" />
        <path d="M591 92V154C591 168.004 585.742 179.809 578 188C570.258 196.191 559.566 200 545 200C530.434 200 518.742 196.191 511 188C503.389 179.809 498 168.004 498 154V92H514C517.412 92 520.769 92.622 523 95C525.231 97.2459 526 98.5652 526 102V154C526 162.059 526.457 167.037 530 171C533.543 174.831 537.914 176 545 176C552.217 176 555.457 174.831 559 171C562.543 167.037 563 162.059 563 154V102C563 98.5652 563.769 96.378 566 94C567.96 91.9107 570.028 91.9599 573 92C573.411 92.0055 574.586 92 575 92H591Z" fill="currentColor" />
        <path d="M676 144L710 92H684C680.723 92 677.812 93.1758 676 96L660 120L645 97C643.188 94.1758 639.277 92 636 92H611L645 143L608 200H634C637.25 200 640.182 196.787 642 194L660 167L679 195C680.818 197.787 683.75 200 687 200H713L676 144Z" fill="currentColor" />
        <path d="M168 200H279C282.542 200 285.932 198.756 289 197C292.068 195.244 295.23 193.041 297 190C298.77 186.959 300.002 183.51 300 179.999C299.998 176.488 298.773 173.04 297 170.001L222 41C220.23 37.96 218.067 35.7552 215 34C211.933 32.2448 207.542 31 204 31C200.458 31 197.067 32.2448 194 34C190.933 35.7552 188.77 37.96 187 41L168 74L130 9.99764C128.228 6.95784 126.068 3.75491 123 2C119.932 0.245087 116.542 0 113 0C109.458 0 106.068 0.245087 103 2C99.9323 3.75491 96.7717 6.95784 95 9.99764L2 170.001C0.226979 173.04 0.00154312 176.488 1.90993e-06 179.999C-0.0015393 183.51 0.229648 186.959 2 190C3.77035 193.04 6.93245 195.244 10 197C13.0675 198.756 16.4578 200 20 200H90C117.737 200 137.925 187.558 152 164L186 105L204 74L259 168H186L168 200ZM89 168H40L113 42L150 105L125.491 147.725C116.144 163.01 105.488 168 89 168Z" fill="#00DC82" />
        <path d="M958 60.0001H938C933.524 60.0001 929.926 59.9395 927 63C924.074 65.8905 925 67.5792 925 72V141C925 151.372 923.648 156.899 919 162C914.352 166.931 908.468 169 899 169C889.705 169 882.648 166.931 878 162C873.352 156.899 873 151.372 873 141V72.0001C873 67.5793 872.926 65.8906 870 63.0001C867.074 59.9396 863.476 60.0001 859 60.0001H840V141C840 159.023 845.016 173.458 855 184C865.156 194.542 879.893 200 899 200C918.107 200 932.844 194.542 943 184C953.156 173.458 958 159.023 958 141V60.0001Z" fill="#00DC82" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1000 60.0233L1020 60V77L1020 128V156.007L1020 181L1020 189.004C1020 192.938 1019.98 194.429 1017 197.001C1014.02 199.725 1009.56 200 1005 200H986.001V181.006L986 130.012V70.0215C986 66.1576 986.016 64.5494 989 62.023C991.819 59.6358 995.437 60.0233 1000 60.0233Z" fill="#00DC82" />
      </svg>
      <h1 class="flex flex-col text-[66px] leading-[70px] font-medium mt-11 mb-0">
        <span>{{ lead }}</span>
        <span class="font-semibold" :style="{ color: c.primary }">{{ accent }}</span>
      </h1>
      <p v-if="description" class="text-[23px] leading-[34px] mt-7 mb-0" :style="{ color: c.muted, lineClamp: 3, textOverflow: 'ellipsis' }">
        {{ description }}
      </p>
    </div>

    <!-- takumi has no preflight reset: every border side is set explicitly -->
    <div class="absolute left-[562px] top-[84px] w-[604px] h-[450px] flex flex-col rounded-2xl border-2 border-solid p-3" :style="{ backgroundColor: c.card, borderColor: c.border }">
      <div class="flex flex-row items-center">
        <div class="flex flex-row items-center h-[36px] px-3 rounded-lg text-[16px] font-medium" :style="{ backgroundColor: c.tab, color: c.text }">
          <div class="flex items-center justify-center w-[18px] h-[18px] rounded-[4px] mr-2 text-[8px] font-bold text-white bg-[#7c3aed]">
            css
          </div>
          main.css
        </div>
        <div class="flex flex-row items-center h-[36px] px-3 text-[16px] font-medium" :style="{ color: c.text }">
          <span class="mr-2 text-[13px] font-bold text-[#3178c6]">TS</span>
          app.config.ts
        </div>
      </div>
      <div class="flex flex-col flex-1 rounded-xl border-2 border-solid mt-3 px-5 py-4 text-[16px] leading-[27px]" :style="{ backgroundColor: c.code, borderColor: c.border, color: c.text, fontFamily: 'Geist Mono' }">
        <div class="flex flex-row h-[27px]">
          <span :style="{ color: c.kw }">@import "</span><span :style="{ color: c.str }">tailwindcss</span><span :style="{ color: c.kw }">";</span>
        </div>
        <div class="flex flex-row h-[27px]">
          <span :style="{ color: c.kw }">@import "</span><span :style="{ color: c.str }">@nuxt/ui</span><span :style="{ color: c.kw }">";</span>
        </div>
        <div class="flex h-[27px]" />
        <div class="flex flex-row h-[27px]">
          <span :style="{ color: c.kw }">@theme</span><span>&nbsp;{</span>
        </div>
        <div class="flex flex-row h-[27px]">
          <span>&nbsp;&nbsp;--font-sans:&nbsp;</span><span :style="{ color: c.str }">'Public Sans'</span><span>,&nbsp;</span><span :style="{ color: c.val }">sans-serif</span><span>;</span>
        </div>
        <div class="flex flex-row h-[27px]">
          <span>}</span>
        </div>
      </div>
      <div class="flex flex-row items-center mt-3 px-1" style="gap: 12px">
        <div class="flex items-center justify-center w-[36px] h-[36px] rounded-full" :class="{ 'border-2 border-solid': true }" :style="pill('default')">
          <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" :style="{ color: preset('default') }"><path fill="currentColor" d="M13.464 19.83h8.922c.283 0 .562-.073.807-.21a1.6 1.6 0 0 0 .591-.574a1.53 1.53 0 0 0 .216-.783a1.53 1.53 0 0 0-.217-.782L17.792 7.414a1.6 1.6 0 0 0-.591-.573a1.65 1.65 0 0 0-.807-.21c-.283 0-.562.073-.807.21a1.6 1.6 0 0 0-.59.573L13.463 9.99L10.47 4.953a1.6 1.6 0 0 0-.591-.573a1.65 1.65 0 0 0-.807-.21c-.284 0-.562.073-.807.21a1.6 1.6 0 0 0-.591.573L.216 17.481a1.53 1.53 0 0 0-.217.782c0 .275.074.545.216.783a1.6 1.6 0 0 0 .59.574c.246.137.525.21.808.21h5.6c2.22 0 3.856-.946 4.982-2.79l2.733-4.593l1.464-2.457l4.395 7.382h-5.859Zm-6.341-2.46l-3.908-.002l5.858-9.842l2.923 4.921l-1.957 3.29c-.748 1.196-1.597 1.632-2.916 1.632" /></svg>
        </div>
        <div class="flex items-center justify-center w-[36px] h-[36px] rounded-full" :class="{ 'border-2 border-solid': false }" :style="pill('mono')">
          <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" :style="{ color: preset('mono') }"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10" /><path d="M12 18a6 6 0 0 0 0-12z" /></g></svg>
        </div>
        <div class="flex items-center justify-center w-[36px] h-[36px] rounded-full" :class="{ 'border-2 border-solid': false }" :style="pill('cobalt')">
          <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" :style="{ color: preset('cobalt') }"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10.5 3L8 9l4 13l4-13l-2.5-6" /><path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3zM2 9h20" /></g></svg>
        </div>
        <div class="flex items-center justify-center w-[36px] h-[36px] rounded-full" :class="{ 'border-2 border-solid': false }" :style="pill('sky')">
          <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" :style="{ color: preset('sky') }"><path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 2v2m-7.07.93l1.41 1.41M20 12h2m-2.93-7.07l-1.41 1.41m-1.713 6.31a4 4 0 0 0-5.925-4.128M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6"
          /></svg>
        </div>
        <div class="flex items-center justify-center w-[36px] h-[36px] rounded-full" :class="{ 'border-2 border-solid': false }" :style="pill('mint')">
          <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" :style="{ color: preset('mint') }"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M11 20a10 10 0 0 0 10-10a25.9 25.9 0 0 0-1.04-7.281a1 1 0 0 0-1.755-.325C15.833 5.5 13 5.5 9.8 6.1A7 7 0 0 0 11 20" /><path d="M2 21a5 5 0 0 1 2.911-4.544C7.613 15.212 8.351 15.24 11 13" /></g></svg>
        </div>
        <div class="flex items-center justify-center w-[36px] h-[36px] rounded-full" :class="{ 'border-2 border-solid': false }" :style="pill('iris')">
          <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" :style="{ color: preset('iris') }"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="3" /><path d="M12 16.5A4.5 4.5 0 1 1 7.5 12A4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5a4.5 4.5 0 1 1-4.5 4.5m0-9V9m-4.5 3H9m7.5 0H15m-3 4.5V15M8 8l1.88 1.88m4.24 0L16 8m-8 8l1.88-1.88m4.24 0L16 16" /></g></svg>
        </div>
        <div class="flex items-center justify-center w-[36px] h-[36px] rounded-full" :class="{ 'border-2 border-solid': false }" :style="pill('crimson')">
          <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" :style="{ color: preset('crimson') }"><path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m12.296 3.464l3.02 3.956M20.2 6L3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3zM3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm3.18-5.724l3.1 3.899"
          /></svg>
        </div>
        <div class="flex items-center justify-center w-[36px] h-[36px] rounded-full" :class="{ 'border-2 border-solid': false }" :style="pill('coral')">
          <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" :style="{ color: preset('coral') }"><path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14 11a2 2 0 1 1-4 0a4 4 0 0 1 8 0a6 6 0 0 1-12 0a8 8 0 0 1 16 0a10 10 0 1 1-20 0a11.93 11.93 0 0 1 2.42-7.22a2 2 0 1 1 3.16 2.44"
          /></svg>
        </div>
        <div class="flex items-center justify-center w-[36px] h-[36px] rounded-full" :class="{ 'border-2 border-solid': false }" :style="pill('sunset')">
          <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" :style="{ color: preset('sunset') }"><path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 10V2m-7.07 8.93l1.41 1.41M2 18h2m16 0h2m-2.93-7.07l-1.41 1.41M22 22H2M16 6l-4 4l-4-4m8 12a4 4 0 0 0-8 0"
          /></svg>
        </div>
        <div class="flex items-center justify-center w-[36px] h-[36px] rounded-full" :class="{ 'border-2 border-solid': false }" :style="pill('carbon')">
          <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" :style="{ color: preset('carbon') }"><path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.914 4a1.5 1.5 0 0 0-2.474-1.561l-9 9A1.5 1.5 0 0 0 5.5 14h4.002a.5.5 0 0 1 .471.666L8.086 20a1.5 1.5 0 0 0 2.475 1.56l9-9A1.5 1.5 0 0 0 18.5 10h-3.997a.5.5 0 0 1-.472-.667z"
          /></svg>
        </div>
        <div class="flex items-center justify-center w-[36px] h-[36px] rounded-full" :class="{ 'border-2 border-solid': false }" :style="pill('bubblegum')">
          <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" :style="{ color: preset('bubblegum') }"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10 7v10.9m4-11.8V17m2-10V3a1 1 0 0 1 1.707-.707a2.5 2.5 0 0 0 2.152.717a1 1 0 0 1 1.131 1.131a2.5 2.5 0 0 0 .717 2.152A1 1 0 0 1 21 8h-4" /><path d="M16.536 7.465a5 5 0 0 0-7.072 0l-2 2a5 5 0 0 0 0 7.07a5 5 0 0 0 7.072 0l2-2a5 5 0 0 0 0-7.07" /><path d="M8 17v4a1 1 0 0 1-1.707.707a2.5 2.5 0 0 0-2.152-.717a1 1 0 0 1-1.131-1.131a2.5 2.5 0 0 0-.717-2.152A1 1 0 0 1 3 16h4" /></g></svg>
        </div>
        <div class="flex items-center justify-center w-[36px] h-[36px] rounded-full" :class="{ 'border-2 border-solid': false }" :style="pill('parchment')">
          <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" :style="{ color: preset('parchment') }"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M15 12h-5m5-4h-5m9 9V5a2 2 0 0 0-2-2H4" /><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" /></g></svg>
        </div>
      </div>
    </div>
  </div>
</template>
