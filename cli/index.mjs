import { defineCommand, runMain } from 'citty'
import init from './commands/init.mjs'

const main = defineCommand({
  meta: {
    name: 'nuxtui',
    description: 'Nuxt UI CLI'
  },
  subCommands: {
    init
  }
})

runMain(main)
