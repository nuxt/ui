import type { ShikiTransformer } from 'shiki'

export interface TransformerIconHighlightOptions {
  /**
   * Custom function to render the icon HTML
   * @default Uses Iconify API with mask mode
   */
  htmlIcon?: (icon: string) => string
}

// Common icon collections to validate against (sorted by length descending for proper matching)
const ICON_COLLECTIONS = [
  'simple-icons',
  'vscode-icons',
  'tabler',
  'lucide',
  'logos',
  'ph'
]

function parseIconName(text: string): { collection: string, name: string, format: 'i' | 'colon' } | null {
  // Strip quotes if present (single, double, or backticks)
  let cleanText = text
  if (/^['"`].*['"`]$/.test(text)) {
    cleanText = text.slice(1, -1)
  }

  // Try i-{collection}-{name} format
  if (cleanText.startsWith('i-')) {
    const rest = cleanText.slice(2)
    for (const collection of ICON_COLLECTIONS) {
      if (rest.startsWith(`${collection}-`)) {
        const name = rest.slice(collection.length + 1)
        if (name && /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(name)) {
          return { collection, name, format: 'i' }
        }
      }
    }
  }

  // Try {collection}:{name} format
  const colonIndex = cleanText.indexOf(':')
  if (colonIndex > 0) {
    const collection = cleanText.slice(0, colonIndex)
    const name = cleanText.slice(colonIndex + 1)
    if (ICON_COLLECTIONS.includes(collection) && name && /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(name)) {
      return { collection, name, format: 'colon' }
    }
  }

  return null
}

export function transformerIconHighlight(options: TransformerIconHighlightOptions = {}): ShikiTransformer {
  const { htmlIcon } = options

  return {
    name: 'shiki-transformer-icon-highlight',
    span(hast, _line, _col, _lineElement, token) {
      const text = token.content

      // Try to parse as an icon
      const parsed = parseIconName(text)
      if (!parsed) return

      const iconIdentifier = `${parsed.collection}:${parsed.name}`
      // Add color=black for mask-image to work properly (mask uses luminance)
      const iconUrl = `https://api.iconify.design/${iconIdentifier}.svg?color=%23000`

      // Create the icon element as a proper HAST element
      const iconElement = htmlIcon
        ? { type: 'raw' as const, value: htmlIcon(iconIdentifier) }
        : {
            type: 'element' as const,
            tagName: 'i',
            properties: {
              class: 'shiki-icon-highlight',
              style: `--shiki-icon-url: url(${iconUrl})`
            },
            children: []
          }

      // Prepend the icon to the span content
      if (hast.children) {
        hast.children.unshift(iconElement)
      }
    }
  }
}
