import { defineEventHandler, getQuery, setHeader } from 'h3'
import { createCanvas } from 'canvas'
import { Buffer } from 'node:buffer'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const width = Number(query.width) || 800
  const height = Number(query.height) || 600
  const type = (query.type as string)?.toLowerCase() || 'png'
  const capacity = query.capacity === 'auto' ? 0 : Number(query.capacity) || 0

  // Giới hạn hợp lý để tránh crash server
  const maxSide = 4096
  const w = Math.min(width, maxSide)
  const h = Math.min(height, maxSide)

  // 🎨 1. Tạo canvas
  const canvas = createCanvas(w, h)
  const ctx = canvas.getContext('2d')

  // Nền xám + text kích thước
  ctx.fillStyle = '#d1d5db'
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = '#111827'
  ctx.font = `${Math.max(20, Math.floor(w / 10))}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`${w}×${h}`, w / 2, h / 2)

  // 🧩 2. Xuất ra buffer hình ảnh
  let imageBuffer: Buffer
  if (type === 'jpg' || type === 'jpeg') {
    imageBuffer = canvas.toBuffer('image/jpeg')
  } else if (type === 'gif') {
    // canvas không tạo GIF được, fallback về PNG
    imageBuffer = canvas.toBuffer('image/png')
  } else {
    imageBuffer = canvas.toBuffer('image/png')
  }

  // 🧱 3. Nếu có yêu cầu dung lượng → thêm padding byte
  if (capacity > 0 && capacity > imageBuffer.length) {
    const padSize = capacity - imageBuffer.length
    const padding = Buffer.alloc(padSize, 0)
    imageBuffer = Buffer.concat([imageBuffer, padding])
  }

  // 🏷️ 4. Headers trả về
  setHeader(event, 'Content-Type', `image/${type}`)
  setHeader(event, 'Cache-Control', 'no-cache, no-store')
  setHeader(event, 'Content-Length', imageBuffer.length)

  // ✅ Thêm tên file khi tải về
  const capLabel = capacity > 0 ? `(${formatCapacity(capacity)})` : ''
  const filename = `${w}x${h}${capLabel}.${type}`
  setHeader(event, 'Content-Disposition', `inline; filename="${filename}"`)

  return imageBuffer
})

// 🔢 Hàm helper định dạng capacity đẹp (ví dụ: 31457280 → 30MB)
function formatCapacity(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${Math.round(bytes / (1024 * 1024))}MB`
  if (bytes >= 1024) return `${Math.round(bytes / 1024)}KB`
  return `${bytes}B`
}
