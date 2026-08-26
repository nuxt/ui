import { defineNuxtModule } from 'nuxt/kit'
import { vercelMarkdownRoutes } from '../server/utils/markdownNegotiation'

export default defineNuxtModule((_options, nuxt) => {
  nuxt.hooks.hook('nitro:init', (nitro) => {
    if (nitro.options.dev || !nitro.options.preset.includes('vercel')) {
      return
    }
    nitro.hooks.hook('compiled', async () => {
      const { resolve } = process.getBuiltinModule('node:path')
      const { readFile, writeFile }
        = process.getBuiltinModule('node:fs/promises')
      // We edit .vercel/output/config.json (Vercel Build Output API v3),
      // not vercel.json, which has a different schema. The `check: true` and
      // `continue` flags are documented on the Source route type here:
      // https://vercel.com/docs/build-output-api/configuration
      const vcJSON = resolve(nitro.options.output.dir, 'config.json')
      const vcConfig = JSON.parse(await readFile(vcJSON, 'utf8'))
      // The routes are defined in `server/utils/markdownNegotiation.ts` so
      // they share one source of truth with the Nitro middleware, which
      // handles the same negotiation on the server function and in dev.
      //
      // Note: the `Vary` and `Link` routeRules in `nuxt.config.ts` only cover
      // responses Nitro serves itself. A request rewritten here to a
      // prerendered `/raw/**.md` file never reaches them, because the Vercel
      // preset emits routeRules headers after these routes and without
      // `continue: true`. That is why `vercelMarkdownRoutes()` starts with its
      // own `continue: true` header routes.
      vcConfig.routes.unshift(...vercelMarkdownRoutes())
      await writeFile(vcJSON, JSON.stringify(vcConfig, null, 2), 'utf8')
    })
  })
})
