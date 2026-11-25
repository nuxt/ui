import type { ComputedRef, InjectionKey } from 'vue'

// Whether a submit from `UChatPrompt` would go out right now, queued during a response or sent after an error,
// so `UChatPromptSubmit` submits instead of stopping or retrying
export const chatPromptSendingInjectionKey: InjectionKey<ComputedRef<boolean>> = Symbol('nuxt-ui.chat-prompt-sending')
