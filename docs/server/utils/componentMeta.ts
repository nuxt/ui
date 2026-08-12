import { camelCase, upperFirst } from 'scule'
import { linkKeys } from '../../../src/runtime/utils/link-keys'
import * as theme from '../../.nuxt/ui'

export interface ComponentMetaTag {
  name: string
  text?: string
}

export interface CompactProp {
  name: string
  type: string
  description?: string
  required?: boolean
  default?: any
  tags?: ComponentMetaTag[]
}

/**
 * Compacts a `vue-component-meta` prop entry into a lean shape without the
 * recursive `schema` field, which can expand to megabytes for generic props.
 * Mirrors the display logic of `docs/app/components/content/ComponentProps.vue`,
 * with stricter fallbacks: an explicit `@defaultValue` tag wins even when empty
 * and falsy theme defaults are surfaced.
 */
export function compactProp(prop: any, defaultVariants?: Record<string, any>): CompactProp {
  const rawType = prop.type
    ? Array.isArray(prop.type)
      ? prop.type.map((t: any) => t.name || t).join(' | ')
      : prop.type.name || prop.type
    : 'any'
  let type: string = typeof rawType === 'string' ? rawType : 'any'

  if (!type.startsWith('boolean') && prop.schema?.kind === 'enum' && Object.keys(prop.schema.schema ?? {}).length) {
    type = Object.values(prop.schema.schema).map((schema: any) => schema?.type ? schema.type : schema).join(' | ')
  }

  let defaultValue = prop.default
  if (typeof defaultValue === 'string') {
    defaultValue = defaultValue.replace(' as never', '').replace(/^"(.*)"$/, '\'$1\'')
  }
  if (defaultValue === undefined) {
    const tag = prop.tags?.find((tag: ComponentMetaTag) => tag.name === 'defaultValue')?.text
    if (tag !== undefined) {
      defaultValue = tag
    } else if (defaultVariants && prop.name in defaultVariants) {
      const variant = defaultVariants[prop.name]
      defaultValue = typeof variant === 'string' ? `'${variant}'` : variant
    }
  }

  const tags = prop.tags?.filter((tag: ComponentMetaTag) => tag.name !== 'defaultValue')

  return {
    name: prop.name,
    type,
    ...(prop.description?.trim() ? { description: prop.description } : {}),
    ...(prop.required ? { required: true } : {}),
    ...(defaultValue !== undefined ? { default: defaultValue } : {}),
    ...(tags?.length ? { tags } : {})
  }
}

export function compactProps(props: any[] | undefined, defaultVariants?: Record<string, any>): CompactProp[] {
  return (props ?? []).map(prop => compactProp(prop, defaultVariants))
}

export function getDefaultVariants(camelName: string, prose = false): Record<string, any> | undefined {
  return ((prose ? (theme as Record<string, any>).prose : theme) as Record<string, any>)[camelName]?.defaultVariants
}

/**
 * Fetches the prerendered component meta and maps it to the shape shared by the
 * `get-component-metadata` tool and the `implement-component-with-props` prompt.
 * Returns `null` when no meta exists for the component.
 */
export async function fetchComponentMetadata(normalizedName: string, { full = false }: { full?: boolean } = {}) {
  const camelName = camelCase(normalizedName)
  const componentMetaName: string = `U${upperFirst(camelName)}`

  let metadata: Record<string, any>
  try {
    metadata = await $fetch<Record<string, any>>(`/api/component-meta/${componentMetaName}.json`)
  } catch {
    return null
  }

  return {
    pascalName: metadata.pascalName,
    kebabName: metadata.kebabName,
    props: full ? metadata.meta.props : compactProps(metadata.meta.props, getDefaultVariants(camelName)),
    slots: metadata.meta.slots,
    emits: metadata.meta.events
  }
}

/**
 * Keys from `linkKeys` that Button-like components document as their own surface:
 * the complement of `LinkPropsKeys` in `src/runtime/components/Link.vue`, plus
 * `active` since Button documents `active`, `activeColor` and `activeVariant` as
 * first-class props.
 */
export const OWN_LINK_KEYS = [
  'active',
  'as',
  'disabled',
  'exactActiveClass',
  'form',
  'formaction',
  'formenctype',
  'formmethod',
  'formnovalidate',
  'formtarget',
  'onClick',
  'title',
  'type',
  'viewTransition'
] as const

const linkPassthroughKeys = new Set<string>(linkKeys.filter(key => !(OWN_LINK_KEYS as readonly string[]).includes(key)))

export function hasLinkPassthrough(props: { name: string }[]): boolean {
  return props.some(prop => prop.name === 'to') && props.some(prop => prop.name === 'href')
}

export function partitionLinkProps<T extends { name: string }>(props: T[]): { own: T[], inherited: T[] } {
  return {
    own: props.filter(prop => !linkPassthroughKeys.has(prop.name)),
    inherited: props.filter(prop => linkPassthroughKeys.has(prop.name))
  }
}
