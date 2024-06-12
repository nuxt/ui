import type { Options } from 'prettier'
import PrettierWorker from '@/workers/prettier.js?worker&inline'

export interface SimplePrettier {
  format: (source: string, options?: Options) => Promise<string>;
}

function createPrettierWorkerApi (worker: Worker): SimplePrettier {
  let counter = 0
  const handlers = {}

  worker.addEventListener('message', (event) => {
    const { uid, message, error } = event.data

    if (!handlers[uid]) {
      return
    }

    const [resolve, reject] = handlers[uid]
    delete handlers[uid]

    if (error) {
      reject(error)
    } else {
      resolve(message)
    }
  })

  function postMessage<T> (message) {
    const uid = ++counter
    return new Promise<T>((resolve, reject) => {
      handlers[uid] = [resolve, reject]
      worker.postMessage({ uid, message })
    })
  }

  return {
    format (source: string, options?: Options) {
      return postMessage({ type: 'format', source, options })
    }
  }
}

export default defineNuxtPlugin({
  async setup () {
    let prettier: SimplePrettier
    if (import.meta.server) {
      const prettierModule = await import('prettier')
      prettier = {
        format (source, options = {
          parser: 'markdown'
        }) {
          return prettierModule.format(source, options)
        }
      }
    } else {
      const worker = new PrettierWorker()
      prettier = createPrettierWorkerApi(worker)
    }

    return {
      provide: {
        prettier
      }
    }
  }
})
