import { defineMarkdownComponent } from '@comark/vue'
import { markdownPlugins } from '../utils/markdown'

/** Markdown rendered at runtime: it resolves the same prose components the content pipeline does. */
export default defineMarkdownComponent({
  name: 'DocsMarkdown',
  plugins: markdownPlugins
})
