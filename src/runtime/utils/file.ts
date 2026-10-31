export function formatFileSize(bytes?: number): string | undefined {
  if (bytes === undefined) return undefined
  if (bytes === 0) {
    return '0B'
  }

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1)

  const value = bytes / Math.pow(k, i)
  const formattedSize = i === 0 ? value.toString() : value.toFixed(0)

  return `${formattedSize}${sizes[i]}`
}
