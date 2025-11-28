import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'
import en from './en'

export default defineLocale<Messages>({
  name: 'English (United Kingdom)',
  code: 'en-GB',
  messages: en.messages
})
