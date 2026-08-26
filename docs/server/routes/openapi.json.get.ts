// Prerendered (see `nitro.prerender.routes`), so there is nothing to cache at
// runtime. A `defineCachedEventHandler` here would also be a trap: with `swr`
// the prerenderer is served the previous build's cached body whenever the
// build cache in `node_modules/.cache` survives between builds.
export default defineEventHandler((event) => {
  const { version } = useRuntimeConfig(event).public

  setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8')
  return createOpenApiDocument({ version, url: SITE_URL })
})
