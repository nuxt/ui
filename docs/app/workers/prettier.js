/* eslint-disable no-undef */
import('https://unpkg.com/prettier@3.0.3/standalone.js')
import('https://unpkg.com/prettier@3.0.3/plugins/html.js')
import('https://unpkg.com/prettier@3.0.3/plugins/markdown.js')

self.onmessage = async function (event) {
  self.postMessage({
    uid: event.data.uid,
    message: await handleMessage(event.data.message)
  })
}

function handleMessage (message) {
  switch (message.type) {
    case 'format':
      return handleFormatMessage(message)
  }
}

async function handleFormatMessage (message) {
  const { options, source } = message
  const formatted = await prettier.format(source, {
    parser: 'markdown',
    plugins: prettierPlugins,
    ...options
  })

  return formatted
}
