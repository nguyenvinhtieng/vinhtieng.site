import { defineEventHandler, getQuery, setHeader } from 'h3'
import { createCanvas } from 'canvas'
import { Buffer } from 'node:buffer'
import { CANVAS_TYPE_MAP, IMAGE_TYPE } from '~/constants/tools/image-generate'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const width = Number(query.width) || 800
  const height = Number(query.height) || 600
  const type = (query.type as string)?.toLowerCase() || IMAGE_TYPE.PNG
  const textColor = (query.textColor as string) || '#111827'
  const bgColor = (query.bgColor as string) || '#d1d5db'
  const capacity = query.capacity === 'auto' ? 0 : Number(query.capacity) || 0

  // Prevent OOM: clamp size
  const maxSide = 4096
  const w = Math.min(width, maxSide)
  const h = Math.min(height, maxSide)

  const mimeMap: Record<string, string> = {
    [IMAGE_TYPE.JPG]: 'image/jpeg',
    [IMAGE_TYPE.PNG]: 'image/png',
    [IMAGE_TYPE.WEBP]: 'image/webp',
    [IMAGE_TYPE.SVG]: 'image/svg+xml',
    [IMAGE_TYPE.GIF]: 'image/gif',
  }

  const canvasType = CANVAS_TYPE_MAP[type] || undefined
  const canvas = createCanvas(w, h, canvasType)
  const ctx = canvas.getContext('2d')

  // Draw background
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, w, h)

  // Draw text
  ctx.fillStyle = textColor
  ctx.font = `${Math.max(20, Math.floor(w / 10))}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`${w}x${h}`, w / 2, h / 2)

  let mimeType = mimeMap[type] || 'image/png'
  let imageBuffer: Buffer

  try {
    if (type === IMAGE_TYPE.GIF) {
      // GIF unsupported → fallback
      mimeType = 'image/png'
      imageBuffer = canvas.toBuffer('image/png')
    } else if (type === IMAGE_TYPE.SVG) {
      // SVG returns string
      const svgData = canvas.toBuffer().toString()
      let svgWithPadding = svgData

      // Append comment padding for SVG (since binary padding corrupts XML)
      if (capacity > 0 && capacity > svgData.length) {
        const padSize = capacity - svgData.length
        const padComment = `<!-- ${'P'.repeat(Math.min(padSize - 10, 50000))} -->`
        svgWithPadding = svgData.replace('</svg>', `${padComment}</svg>`)
      }

      imageBuffer = Buffer.from(svgWithPadding, 'utf8')
    } else {
      // Standard formats
      imageBuffer = canvas.toBuffer(mimeType as any)
    }
  } catch {
    // Fallback if WEBP or other format not supported
    mimeType = 'image/png'
    imageBuffer = canvas.toBuffer('image/png')
  }

  // Binary padding for non-SVG formats
  if (type !== IMAGE_TYPE.SVG && capacity > 0 && capacity > imageBuffer.length) {
    const padSize = capacity - imageBuffer.length
    const padding = Buffer.alloc(padSize)
    imageBuffer = Buffer.concat([imageBuffer, padding])
  }

  // Headers
  const filename = `${w}x${h}${capacity ? `-${formatCapacity(capacity)}` : ''}.${type}`
  setHeader(event, 'Content-Type', mimeType)
  setHeader(event, 'Cache-Control', 'no-cache, no-store')
  setHeader(event, 'Content-Length', imageBuffer.length)
  setHeader(event, 'Content-Disposition', `inline; filename="${filename}"`)

  return imageBuffer
})

function formatCapacity(capacity: number): string {
  if (capacity >= 1024 * 1024) return `${Math.round(capacity / (1024 * 1024))}_MB`
  if (capacity >= 1024) return `${Math.round(capacity / 1024)}_KB`
  return `${capacity}_B`
}
