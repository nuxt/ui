import type { Options } from 'prettier'
import { defu } from 'defu'
import PrettierWorker from '@/workers/prettier.js?worker&inline'

export interface SimplePrettier {
  format: (source: string, options?: Options) => Promise<string>
}

function createPrettierWorkerApi(worker: Worker): SimplePrettier {
  let counter = 0
  const handlers: any = {}

  worker.addEventListener('message', (event) => {
    const { uid, message, error } = event.data

    if (!handlers[uid]) {
      return
    }

    const [resolve, reject] = handlers[uid]
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete handlers[uid]

    if (error) {
      reject(error)
    } else {
      resolve(message)
    }
  })

  function postMessage<T>(message: any) {
    const uid = ++counter
    return new Promise<T>((resolve, reject) => {
      handlers[uid] = [resolve, reject]
      worker.postMessage({ uid, message })
    })
  }

  return {
    format(source: string, options?: Options) {
      return postMessage({ type: 'format', source, options })
    }
  }
}

export default defineNuxtPlugin(async () => {
  let prettier: SimplePrettier
  if (import.meta.server) {
    const prettierModule = await import('prettier')
    prettier = {
      format(source, options = {}) {
        return prettierModule.format(source, defu(options, {
          parser: 'markdown'
        }))
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
})
