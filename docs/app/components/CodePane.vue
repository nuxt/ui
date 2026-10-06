<script setup lang="ts">
import type { KeyedTokensInfo } from '@shikijs/magic-move/types'
import type { MagicMoveRenderer } from '@shikijs/magic-move/renderer'
import '@shikijs/magic-move/style.css'

/**
 * A generated file in a fixed pane, inside ProsePre like every code block on
 * the site, headerless and without the copy button, the frame around it
 * carries both. When the file changes, the tokens it keeps move to their new
 * place and the rest fade.
 */
const props = defineProps<{
  tokens: KeyedTokensInfo
  ui?: { root?: string, base?: string }
}>()

const container = useTemplateRef<HTMLElement>('container')
const reducedMotion = usePreferredReducedMotion()

const renderer = shallowRef<MagicMoveRenderer>()
let syncTokenKeys: typeof import('@shikijs/magic-move/core').syncTokenKeys
let previous: KeyedTokensInfo | undefined

// The server and the first client render write the tokens below as plain
// spans. The renderer and its differ load after mount, so neither sits in the
// chunk of a page that only shows the file.
onMounted(async () => {
  const [core, { MagicMoveRenderer }] = await Promise.all([import('@shikijs/magic-move/core'), import('@shikijs/magic-move/renderer')])
  if (!container.value) return

  syncTokenKeys = core.syncTokenKeys
  // the renderer only moves the elements it created
  container.value.replaceChildren()
  const instance = new MagicMoveRenderer(container.value, {
    // the pane is a fixed box with ProsePre's own background
    animateContainer: false,
    containerStyle: false,
    duration: 300,
    // the defaults stage a slide: leave, then move, then enter at 0.7 of the
    // duration. Here the file answers a click, so all three start at once.
    delayMove: 0,
    delayLeave: 0,
    delayEnter: 0,
    easing: 'var(--ease-out)'
  })

  // The renderer asks every token for its own animations to learn when it is
  // done, and each call recomputes the styles of the page: a second of blocked
  // main thread on the home page for a file of 500 tokens. One call on the
  // container answers for the whole pass, the callbacks of a pass are all
  // registered in the same tick.
  const el = container.value
  let finished: Promise<unknown> | undefined
  Object.assign(instance, {
    registerTransitionEnd: (_token: HTMLElement, callback: () => void) => () => {
      if (!finished) {
        finished = Promise.allSettled(el.getAnimations({ subtree: true }).map(animation => animation.finished))
        queueMicrotask(() => finished = undefined)
      }

      let done = false
      const resolve = () => {
        if (done) return
        done = true
        callback()
      }
      // the next pass resolves the ones it interrupts
      return Object.assign(finished.then(resolve), { resolve })
    }
  })

  renderer.value = instance
})

watch([renderer, () => props.tokens], ([renderer, tokens]) => {
  if (!renderer) return

  if (!previous) {
    // the renderer's first pass never animates
    renderer.render(tokens)
    previous = tokens
  } else if (previous.lang !== tokens.lang || reducedMotion.value === 'reduce') {
    // another tab is another file, nothing of it moves
    renderer.replace(tokens)
    previous = tokens
  } else {
    previous = syncTokenKeys(previous, tokens).to
    renderer.render(previous)
  }
})
</script>

<template>
  <ProsePre :copy="false" :ui="ui">
    <!-- v-once: the renderer owns these children once it has mounted -->
    <code v-once ref="container" class="shiki shiki-magic-move-container block">
      <template v-for="token in tokens.tokens" :key="token.key">
        <br v-if="token.content === '\n'">
        <span v-else class="shiki-magic-move-item" :class="token.htmlClass" :style="[{ color: token.color }, token.htmlStyle]">{{ token.content }}</span>
      </template>
    </code>
  </ProsePre>
</template>
