import { getCurrentInstance } from 'vue'
import { useNuxtApp } from '#imports'

const ATTR_KEY = 'data-n-ids'
export function useId (key = 'n') {
  const nuxt = useNuxtApp()
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('[nuxt] useId() must be called within a component.')
  }
  let id
  if (nuxt.payload.serverRendered && nuxt.isHydrating) {
    instance._nuxtIdIndex = instance._nuxtIdIndex || 0
    let serverIds = []
    if (instance.vnode.el?.nodeType === 8 && instance.vnode.el?.nextElementSibling?.getAttribute) {
      serverIds = instance.vnode.el?.nextElementSibling?.getAttribute?.(ATTR_KEY)?.split?.(',') || []
    } else {
      serverIds = instance.vnode.el?.getAttribute?.(ATTR_KEY)?.split?.(',') || []
    }

    if (serverIds.length) {
      id = parseInt(serverIds[instance._nuxtIdIndex], 10) || 0
      instance._nuxtIdIndex++
    } else {
      if (!instance.vnode.el?.getAttribute && (!instance.parent || instance.parent.type.name !== 'ClientOnly')) {
        console.error('[nuxt] useId() needs to be used with a component having on single root element.')
      }
      // @ts-ignore
      id = ++nuxt.payload._id
    }
  } else {
    nuxt.payload._id = nuxt.payload._id || 0
    // @ts-ignore
    id = ++nuxt.payload._id
    if (import.meta.server) {
      if (instance.attrs[ATTR_KEY]) {
        instance.attrs[ATTR_KEY] = instance.attrs[ATTR_KEY] + ',' + id
      } else {
        instance.attrs[ATTR_KEY] = id
      }
    }
  }
  return key + '-' + id
}
