import { ref } from 'vue'

export * from './base'

export const useRoute = () => {
  return {
    fullPath: '/',
    path: '/',
    name: null,
    params: {},
    query: {},
    hash: '',
    meta: {},
    matched: [],
    redirectedFrom: undefined
  }
}

export const useRouter = () => {
  return {
    push: () => Promise.resolve(),
    replace: () => Promise.resolve(),
    go: () => {},
    back: () => {},
    forward: () => {},
    beforeEach: () => () => {},
    beforeResolve: () => () => {},
    afterEach: () => () => {},
    onError: () => () => {},
    isReady: () => Promise.resolve(true),
    currentRoute: ref({
      fullPath: '/',
      path: '/',
      name: null,
      params: {},
      query: {},
      hash: '',
      meta: {},
      matched: [],
      redirectedFrom: undefined
    }),
    options: {}
  }
}
