#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'
import make from './commands/make/index.mjs'

const main = defineCommand({
  meta: {
    name: 'nuxt-ui',
    description: 'Nuxt UI CLI'
  },
  subCommands: {
    make
  }
})

runMain(main)
