import { promises as fsp } from 'node:fs'

export async function sortFile(path) {
  const file = await fsp.readFile(path, 'utf-8')

  const lines = file.trim().split('\n').sort()

  await fsp.writeFile(path, lines.join('\n') + '\n')
}

export async function appendFile(path, content) {
  const file = await fsp.readFile(path, 'utf-8')

  if (!file.includes(content)) {
    await fsp.writeFile(path, file.trim() + '\n' + content + '\n')
  }
}
