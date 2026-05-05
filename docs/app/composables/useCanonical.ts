import { joinURL } from 'ufo'
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

export function useCanonical(markdownAlternate?: MaybeRefOrGetter<string | undefined>) {
  const route = useRoute()
  const site = useSiteConfig()

  useHead({
    link: computed(() => {
      const links: Array<{ rel: string, href: string, type?: string }> = [
        { rel: 'canonical', href: joinURL(site.url, route.path) }
      ]

      const md = toValue(markdownAlternate)
      if (md) {
        links.push({ rel: 'alternate', type: 'text/markdown', href: joinURL(site.url, md) })
      }

      return links
    })
  })
}
