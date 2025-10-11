<script setup lang="ts">
import { camelCase, pascalCase } from 'scule'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import type { TabsItem } from '@nuxt/ui'

const props = withDefaults(defineProps<{
  name: string
  /**
   * Whether to format the code with Prettier
   * @defaultValue false
   */
  prettier?: boolean
  /**
   * Custom height for the iframe container
   * @defaultValue '500px'
   */
  height?: string
  /**
   * Whether to collapse the code block
   * @defaultValue false
   */
  collapse?: boolean
  /**
   * Whether to show the source code
   * @defaultValue true
   */
  source?: boolean
  /**
   * A list of line numbers to highlight in the code block
   */
  highlights?: number[]
  /**
   * Whether to center the example content
   * @defaultValue true
   */
  centered?: boolean
  title?: string
  description?: string
  hint?: string
}>(), {
  source: true,
  height: '500px',
  centered: true
})

const toast = useToast()
const colorMode = useColorMode()

const { $prettier } = useNuxtApp()
const camelName = camelCase(props.name)

const id = computed(() => props.name ? `block-${props.name}` : undefined)

const localTheme = ref<'light' | 'dark'>()
const effectiveTheme = computed(() => {
  return localTheme.value || colorMode.value
})

const toggleTheme = () => {
  if (effectiveTheme.value === 'light') {
    localTheme.value = 'dark'
  } else {
    localTheme.value = 'light'
  }
}

const themeIcon = computed(() => {
  return effectiveTheme.value === 'light' ? 'i-lucide-moon' : 'i-lucide-sun'
})

const themeTooltip = computed(() => {
  return effectiveTheme.value === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
})

const data = await fetchComponentExample(camelName)

const code = computed(() => {
  let code = ''

  if (props.collapse) {
    code += `::code-collapse
`
  }

  code += `\`\`\`vue${props.highlights?.length ? `{${props.highlights.join('-')}}` : ''}
${data?.code ?? ''}
\`\`\``

  if (props.collapse) {
    code += `
::`
  }

  return code
})

const { data: ast } = await useAsyncData(`block-example-${camelName}`, async () => {
  if (!props.prettier) {
    return parseMarkdown(code.value)
  }

  let formatted = ''
  try {
    formatted = await $prettier.format(code.value, {
      trailingComma: 'none',
      semi: false,
      singleQuote: true,
      printWidth: 100
    })
  } catch {
    formatted = code.value
  }

  return parseMarkdown(formatted)
}, { watch: [code] })

const items = [
  {
    label: 'Preview',
    slot: 'preview' as const
  },
  {
    label: 'Code',
    slot: 'code' as const
  }
] satisfies TabsItem[]

const openFullscreen = () => {
  const url = `/examples/blocks/${props.name}?centered=${props.centered}&theme=${effectiveTheme.value}`
  window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes')
}

const copyCode = async () => {
  if (data?.code) {
    try {
      await navigator.clipboard.writeText(data.code)
      toast.add({
        title: 'Code copied to clipboard',
        color: 'success'
      })
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }
}

const downloadCode = () => {
  if (data?.code) {
    try {
      const fileName = pascalCase(props.name)
      const blob = new Blob([data.code], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${fileName}.vue`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.add({
        title: 'Component downloaded',
        color: 'success'
      })
    } catch (err) {
      console.error('Failed to download code:', err)
    }
  }
}
</script>

<template>
  <div :id="id" class="relative border border-default mb-10 scroll-mt-[calc(45px+var(--ui-header-height))] lg:scroll-mt-(--ui-header-height)">
    <div v-if="title || description" class="flex flex-col gap-1 p-4">
      <span v-if="title" class="text-xl font-bold text-highlighted">
        <a v-if="id" :href="`#${id}`" class="inline-flex items-center gap-1 group hover:underline underline-offset-2 decoration-1">
          {{ title }}
          <UIcon
            name="i-lucide-link"
            class="size-4 hidden group-hover:block"
          />
        </a>
        <template v-else>
          {{ title }}
        </template>
      </span>
      <span v-if="description" class="text-muted">
        {{ description }}
      </span>
    </div>
    <div class="border-t border-default overflow-hidden" :style="{ height: props.height }">
      <UTabs
        :items="items"
        class="size-full gap-0"
        variant="link"
        :ui="{
          content: 'relative size-full border-t border-default',
          indicator: 'z-10'
        }"
      >
        <template #preview>
          <span v-if="hint" class="absolute bottom-2 left-2 bg-muted/50 backdrop-blur-3xl border border-default px-2 py-1 rounded text-xs">
            {{ hint }}
          </span>
          <SplitterGroup
            :id="`splitter-${camelName}`"
            direction="horizontal"
          >
            <SplitterPanel
              :id="`splitter-${camelName}-panel-1`"
              :default-size="70"
              :min-size="30"
              class="overflow-hidden"
            >
              <iframe
                :src="`/examples/blocks/${name}?centered=${centered}&theme=${effectiveTheme}`"
                class="size-full"
              />
            </SplitterPanel>
            <SplitterResizeHandle
              :id="`splitter-${camelName}-handle`"
              class="group w-4 flex items-center justify-center bg-default"
            >
              <div class="w-1 h-8 group-hover:h-16 bg-elevated transition-all rounded-full" />
            </SplitterResizeHandle>

            <SplitterPanel
              :id="`splitter-${camelName}-panel-2`"
              class="bg-stripes"
              :default-size="0"
              :min-size="0"
            />
          </SplitterGroup>
        </template>

        <template #code>
          <div
            v-if="source"
            class="overflow-y-auto h-full"
          >
            <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" class="*:my-0 *:*:border-none *:*:rounded-none" />
          </div>
        </template>

        <template #list-trailing>
          <div class="flex flex-1 items-center justify-end gap-2">
            <UButton
              variant="ghost"
              size="sm"
              square
              color="neutral"
              icon="i-lucide-copy"
              label="Copy code"
              @click="copyCode"
            />

            <UTooltip
              text="Download component"
              :delay-duration="0"
              :content="{
                side: 'top'
              }"
            >
              <UButton
                variant="ghost"
                size="sm"
                square
                color="neutral"
                icon="i-lucide-download"
                @click="downloadCode"
              />
            </UTooltip>

            <UTooltip
              :text="themeTooltip"
              :delay-duration="0"
              :content="{
                side: 'top'
              }"
            >
              <UButton
                variant="ghost"
                size="sm"
                square
                color="neutral"
                :icon="themeIcon"
                @click="toggleTheme"
              />
            </UTooltip>

            <UTooltip
              text="Open in fullscreen"
              :delay-duration="0"
              :content="{
                side: 'top'
              }"
            >
              <UButton
                variant="ghost"
                size="sm"
                square
                color="neutral"
                icon="i-lucide-maximize"
                @click="openFullscreen"
              />
            </UTooltip>
          </div>
        </template>
      </UTabs>
    </div>
  </div>
</template>

<style>
@reference '../../assets/css/main.css';

.bg-stripes {
  @apply w-full [background-size:8px_8px];
  @apply dark:[background-image:linear-gradient(-45deg,var(--color-neutral-800)_12.50%,transparent_12.50%,transparent_50%,var(--color-neutral-800)_50%,var(--color-neutral-800)_62.50%,transparent_62.50%,transparent_100%)];
  @apply not-dark:[background-image:linear-gradient(-45deg,var(--color-neutral-100)_12.50%,transparent_12.50%,transparent_50%,var(--color-neutral-100)_50%,var(--color-neutral-100)_62.50%,transparent_62.50%,transparent_100%)];
}
</style>
