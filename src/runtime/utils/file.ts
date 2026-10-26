export function formatFileSize(bytes?: number): string | undefined {
  if (bytes === undefined) return undefined
  if (bytes === 0) {
    return '0B'
  }

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  const value = bytes / Math.pow(k, i)
  const formattedSize = i === 0 ? value.toString() : value.toFixed(0)

  return `${formattedSize}${sizes[i]}`
}
