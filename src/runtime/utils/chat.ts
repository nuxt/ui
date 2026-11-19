import type { ComputedRef, InjectionKey } from 'vue'

// Whether a submit from `UChatPrompt` would be queued right now, so `UChatPromptSubmit` sends instead of stopping
export const chatPromptQueueingInjectionKey: InjectionKey<ComputedRef<boolean>> = Symbol('nuxt-ui.chat-prompt-queueing')
