<!-- eslint-disable no-useless-escape -->
<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { Repl, useStore, useVueImportMap } from '@vue/repl'
import { useColorMode } from '@vueuse/core'
import CodeMirror from '@vue/repl/codemirror-editor'

const colorMode = useColorMode()
const theme = computed(() => colorMode.value === 'dark' ? 'dark' : 'light')

const {
  importMap: vueImportMap,
  vueVersion
} = useVueImportMap({
  runtimeDev: 'https://esm.sh/vue@3/dist/vue.esm-browser.js',
  runtimeProd: 'https://esm.sh/vue@3/dist/vue.esm-browser.prod.js',
  serverRenderer: 'https://esm.sh/@vue/server-renderer@3/dist/server-renderer.esm-browser.js'
})

const builtinImportMap = computed(() => ({
  imports: {
    ...vueImportMap.value.imports,
    '@nuxt/ui': '/nuxt-ui.js',
    'zod': 'https://esm.sh/zod@4?external=vue',
    '@vueuse/core': 'https://esm.sh/@vueuse/core?external=vue',
    '@tanstack/vue-table': 'https://esm.sh/@tanstack/vue-table?external=vue',
    '@internationalized/date': 'https://esm.sh/@internationalized/date',
    'scule': 'https://esm.sh/scule'
  }
}))

const store = useStore(
  {
    builtinImportMap,
    vueVersion,
    showOutput: ref(false),
    outputMode: ref('preview')
  },
  location.hash
)

const defaultCode = `<script setup lang="ts">
import { z } from 'zod'
import { reactive } from 'vue'

const months = Array.from({ length: 12 }, (_, i) => ({
  label: String(i + 1).padStart(2, '0'),
  value: String(i + 1).padStart(2, '0')
}))

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 10 }, (_, i) => ({
  label: String(currentYear + i),
  value: String(currentYear + i)
}))

const schema = z.object({
  name: z.string({ error: 'Name is required' }).nonempty('Name is required'),
  cardNumber: z
    .string({ error: 'Card number is required' })
    .nonempty('Card number is required')
    .regex(/^[\\d\\s]{16,19}$/, 'Enter a valid 16-digit card number'),
  cvv: z
    .string({ error: 'CVV is required' })
    .nonempty('CVV is required')
    .regex(/^\\d{3,4}$/, 'Enter a valid CVV'),
  month: z.string({ error: 'Month is required' }).nonempty('Select a month'),
  year: z.string({ error: 'Year is required' }).nonempty('Select a year'),
  sameAsShipping: z.boolean().default(true),
  comments: z.string().optional()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  cardNumber: undefined,
  cvv: undefined,
  month: undefined,
  year: undefined,
  sameAsShipping: true,
  comments: undefined
})
<\/script>

<template>
  <div class="min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
    <UCard class="max-w-md mx-auto" variant="subtle">
      <UForm :schema="schema" :state="state" class="space-y-6">
        <UPageCard title="Payment method" description="All transactions are secure and encrypted" variant="naked" />

        <UFormField name="name" label="Name" required>
          <UInput v-model="state.name" placeholder="John Doe" class="w-full" />
        </UFormField>

        <div class="grid grid-cols-3 gap-4">
          <UFormField name="cardNumber" label="Card number" help="Enter your 16-digit number." required class="col-span-2">
            <UInput v-model="state.cardNumber" placeholder="1234 5678 9012 3456" class="w-full" />
          </UFormField>

          <UFormField name="cvv" label="CVV" required>
            <UInput v-model="state.cvv" placeholder="123" class="w-full" />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UFormField name="month" label="Month" required>
            <USelect v-model="state.month" :items="months" placeholder="MM" value-key="value" class="w-full" />
          </UFormField>

          <UFormField name="year" label="Year" required>
            <USelect v-model="state.year" :items="years" placeholder="YYYY" value-key="value" class="w-full" />
          </UFormField>
        </div>

        <USeparator />

        <UPageCard title="Billing address" description="The billing address associated with your payment method" variant="naked" />

        <UFormField name="sameAsShipping">
          <UCheckbox v-model="state.sameAsShipping" label="Same as shipping address" color="neutral" />
        </UFormField>

        <USeparator />

        <UFormField name="comments" label="Comments">
          <UTextarea v-model="state.comments" placeholder="Add any additional comments" :rows="3" class="w-full" />
        </UFormField>

        <div class="flex gap-3">
          <UButton type="submit" color="neutral" label="Submit" />
          <UButton type="button" label="Cancel" color="neutral" variant="outline" />
        </div>
      </UForm>
    </UCard>
  </div>
</template>`

const hasInitialHash = !!location.hash

if (!hasInitialHash) {
  store.setFiles({
    'src/App.vue': defaultCode
  }, 'src/App.vue')
}

watchEffect(() => {
  const serialized = store.serialize()
  if (!hasInitialHash && store.getFiles()['App.vue']?.trimEnd() === defaultCode.trimEnd()) {
    if (location.hash) {
      history.replaceState({}, '', location.pathname)
    }
    return
  }
  history.replaceState({}, '', serialized)
})

const previewOptions = {
  headHTML: [
    '<script>window.__VUE_PROD_DEVTOOLS__=false<\/script>',
    '<link rel="stylesheet" href="/nuxt-ui.css">',
    '<link rel="preconnect" href="https://fonts.bunny.net">',
    '<link href="https://fonts.bunny.net/css?family=public-sans:400,500,600,700" rel="stylesheet">',
    '<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"><\/script>',
    '<style type="text/tailwindcss">@theme { --font-sans: \'Public Sans\', sans-serif; }</style>',
    '<style>body { font-family: var(--font-sans); }</style>',
    '<style>#app { isolation: isolate; }</style>'
  ].join(''),
  customCode: {
    importCode: `import ui, { useToast, useOverlay, defineShortcuts, extractShortcuts } from '@nuxt/ui'\nimport { h } from 'vue'\nwindow.useToast = useToast\nwindow.useOverlay = useOverlay\nwindow.defineShortcuts = defineShortcuts\nwindow.extractShortcuts = extractShortcuts`,
    useCode: `app.use(ui)\napp.component('Placeholder', { template: '<div class="relative overflow-hidden rounded-sm border border-dashed border-accented opacity-75 px-4 flex items-center justify-center"><svg class="absolute inset-0 size-full stroke-inverted/10" fill="none"><defs><pattern id="placeholder-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3" /></pattern></defs><rect stroke="none" fill="url(#placeholder-pattern)" width="100%" height="100%" /></svg><slot /></div>' })\nconst _Root = app._component\nconst _UApp = app.component('UApp')\nconst _origMount = app.mount\napp.mount = function(el) {\n  const wrapper = _createApp({ render() { return h(_UApp, null, { default: () => h(_Root) }) } })\n  Object.assign(wrapper._context.components, app._context.components)\n  Object.assign(wrapper._context.directives, app._context.directives)\n  Object.assign(wrapper._context.provides, app._context.provides)\n  wrapper.config.errorHandler = e => console.error(e)\n  wrapper.mount(el)\n  window.__app__ = wrapper\n}`
  }
}
</script>

<template>
  <UApp>
    <div class="h-dvh flex flex-col">
      <UHeader title="Nuxt UI Playground" :ui="{ container: 'max-w-none' }">
        <template #left>
          <Logo class="w-auto h-6 shrink-0 text-highlighted" />
        </template>

        <template #right>
          <UColorModeButton />

          <UTooltip text="Open on GitHub">
            <UButton
              color="neutral"
              variant="ghost"
              to="https://github.com/nuxt/ui"
              target="_blank"
              icon="i-simple-icons:github"
              aria-label="GitHub"
            />
          </UTooltip>
        </template>
      </UHeader>

      <Repl
        :store="store"
        :editor="CodeMirror"
        :theme="theme"
        preview-theme
        :show-compile-output="false"
        :show-ts-config="false"
        :show-import-map="false"
        :clear-console="false"
        :preview-options="previewOptions"
        class="flex-1"
      />
    </div>
  </UApp>
</template>

<style>
.iframe-container,
.iframe-container iframe {
  background-color: var(--ui-bg) !important;
}

.vue-repl,
.dark .vue-repl {
  --bg: var(--ui-bg);
  --bg-soft: var(--ui-bg-muted);
  --border: var(--ui-border);
  --text-light: var(--ui-text-muted);
  --color-branding: var(--ui-primary);
  --color-branding-dark: var(--ui-primary);

  & .file-selector {
    padding-inline: calc(var(--spacing) * 4);

    @media (width >= 40rem) {
      padding-inline: calc(var(--spacing) * 6);
    }

    @media (width >= 64rem) {
      padding-inline: calc(var(--spacing) * 8);
    }
  }

  & .add,
  & .import-map-wrapper,
  & .tab-buttons {
    display: none;
  }

  & .output-container {
    height: 100%;
  }
}

.CodeMirror,
.dark .CodeMirror {
  --base: var(--ui-text);
  --comment: var(--ui-text-dimmed);
  --selected-bg: var(--ui-bg-accented);
  --selected-bg-non-focus: var(--ui-bg-accented);
}
</style>
