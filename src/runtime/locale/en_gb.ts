import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'
import en from './en'

export default defineLocale<Messages>({
  name: 'English (United Kingdom)',
  code: 'en-GB',
  messages: en.messages
})
