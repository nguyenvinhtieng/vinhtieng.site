export function useImageGenerator() {
  function generateImage({
    width,
    height,
    type = 'png',
    bgColor = '#d1d5db',
    textColor = '#111827',
    capacity = 0, // bytes
  }: {
    width: number
    height: number
    type?: string
    bgColor?: string
    textColor?: string
    capacity?: number
  }): Promise<Blob> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')!

      // background
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, width, height)

      // text
      ctx.fillStyle = textColor
      ctx.font = `${Math.max(20, Math.floor(width / 10))}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`${width}x${height}`, width / 2, height / 2)

      canvas.toBlob(async (blob) => {
        if (!blob) return resolve(new Blob())

        // Add padding (simulate file size)
        if (capacity > 0 && blob.size < capacity) {
          const padSize = capacity - blob.size
          const padding = new Uint8Array(padSize)
          const combined = new Blob([blob, padding], { type: blob.type })
          resolve(combined)
        } else {
          resolve(blob)
        }
      }, `image/${type}`)
    })
  }

  async function downloadImage(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return { generateImage, downloadImage }
}
