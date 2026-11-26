import type { ComputedRef, InjectionKey } from 'vue'

// What a submit from `UChatPrompt` would do right now, so `UChatPromptSubmit` submits instead of stopping or retrying:
// `queue` during a response with a queue, `send` after an error when the prompt holds a message and has no `error`
export const chatPromptSubmitInjectionKey: InjectionKey<ComputedRef<{ queue: boolean, send: boolean }>> = Symbol('nuxt-ui.chat-prompt-submit')
