import colors from '#ui-colors'

export type FeedIndicatorColor = 'gray' | typeof colors[number]

export interface FeedItem extends Record<string, any> {
  title: string,
  description?: string,
  trailing?: string,
  icon?: string,
  color?: FeedIndicatorColor
}
