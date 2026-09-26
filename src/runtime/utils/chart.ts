import type { ChartCurve } from '@tanstack/charts'

type Point = readonly [number, number]

// Same precision as the paths TanStack Charts renders itself.
function round(value: number) {
  return Math.round(value * 100) / 100
}

function sign(value: number) {
  return value < 0 ? -1 : 1
}

// Tangent at the middle point, Fritsch–Carlson as in d3's `curveMonotoneX`.
function innerTangent([x0, y0]: Point, [x1, y1]: Point, [x2, y2]: Point) {
  const h0 = x1 - x0
  const h1 = x2 - x1
  const s0 = (y1 - y0) / (h0 || (h1 < 0 ? -0 : 0))
  const s1 = (y2 - y1) / (h1 || (h0 < 0 ? -0 : 0))
  const p = (s0 * h1 + s1 * h0) / (h0 + h1)

  return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0
}

function edgeTangent([x0, y0]: Point, [x1, y1]: Point, tangent: number) {
  const h = x1 - x0

  return h ? (3 * (y1 - y0) / h - tangent) / 2 : tangent
}

function monotoneSegments(points: readonly Point[]) {
  if (points.length < 3) {
    return points.slice(1).map(([x, y]) => `L${round(x)},${round(y)}`).join('')
  }

  const tangents = points.map((point, i) => i > 0 && i < points.length - 1 ? innerTangent(points[i - 1]!, point, points[i + 1]!) : 0)
  tangents[0] = edgeTangent(points[0]!, points[1]!, tangents[1]!)
  tangents[points.length - 1] = edgeTangent(points[points.length - 2]!, points[points.length - 1]!, tangents[points.length - 2]!)

  return points.slice(1).map(([x1, y1], i) => {
    const [x0, y0] = points[i]!
    const dx = (x1 - x0) / 3

    return `C${round(x0 + dx)},${round(y0 + dx * tangents[i]!)},${round(x1 - dx)},${round(y1 - dx * tangents[i + 1]!)},${round(x1)},${round(y1)}`
  }).join('')
}

function stepSegments(points: readonly Point[]) {
  return points.slice(1).map(([x1, y1], i) => {
    const [x0, y0] = points[i]!
    const x = round((x0 + x1) / 2)

    return `L${x},${round(y0)}L${x},${round(y1)}L${round(x1)},${round(y1)}`
  }).join('')
}

function createCurve(segments: (points: readonly Point[]) => string): ChartCurve {
  const line = (points: readonly Point[]) => points.length ? `M${round(points[0]![0])},${round(points[0]![1])}${segments(points)}` : ''

  return {
    line,
    area: (top, bottom) => {
      if (!top.length) {
        return ''
      }

      const reversed = [...bottom].reverse()

      return `${line(top)}L${round(reversed[0]![0])},${round(reversed[0]![1])}${segments(reversed)}Z`
    }
  }
}

export const chartCurves = {
  monotone: createCurve(monotoneSegments),
  step: createCurve(stepSegments)
}
