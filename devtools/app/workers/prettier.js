/* eslint-disable no-undef */
self.onmessage = async function (event) {
  self.postMessage({
    uid: event.data.uid,
    message: await handleMessage(event.data.message)
  })
}

function handleMessage(message) {
  switch (message.type) {
    case 'format':
      return handleFormatMessage(message)
  }
}

async function handleFormatMessage(message) {
  if (!globalThis.prettier) {
    await Promise.all([
      import('https://unpkg.com/prettier@3.5.0/standalone.js'),
      import('https://unpkg.com/prettier@3.5.0/plugins/html.js'),
      import('https://unpkg.com/prettier@3.5.0/plugins/postcss.js'),
      import('https://unpkg.com/prettier@3.5.0/plugins/babel.js'),
      import('https://unpkg.com/prettier@3.5.0/plugins/estree.js'),
      import('https://unpkg.com/prettier@3.5.0/plugins/typescript.js')
    ])
  }

  const { options, source } = message
  const formatted = await prettier.format(source, {
    parser: 'vue',
    plugins: prettierPlugins,
    ...options
  })

  return formatted
}
