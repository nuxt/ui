// Mark the project as a local development project
process.env.NUXT_UI_LOCAL_DEV = 'true'

export default defineNuxtConfig({
  modules: ['../src/module']
})
