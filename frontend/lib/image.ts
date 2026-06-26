/**
 * Compressão de imagem no cliente. Aceita arquivos até `maxInputBytes`
 * (5 MB por padrão), redimensiona para no máximo `maxSize` px no maior
 * lado e exporta JPEG reduzindo a qualidade até caber em `maxOutputBytes`.
 * Retorna um data URL (base64) pronto para enviar ao backend — perde um
 * pouco de qualidade, mas economiza bastante armazenamento.
 */

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB

export class ImageTooLargeError extends Error {
  constructor() {
    super('A imagem excede o limite de 5 MB.')
    this.name = 'ImageTooLargeError'
  }
}

interface CompressOptions {
  maxSize?: number // maior lado, em px
  maxOutputBytes?: number // alvo do arquivo final
  maxInputBytes?: number
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Não foi possível ler a imagem.'))
    img.src = src
  })
}

/** Tamanho aproximado, em bytes, de um data URL JPEG (sem o cabeçalho). */
function dataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
  return Math.floor((base64.length * 3) / 4)
}

export async function compressImage(
  file: File,
  { maxSize = 1280, maxOutputBytes = 400 * 1024, maxInputBytes = MAX_IMAGE_BYTES }: CompressOptions = {},
): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Selecione um arquivo de imagem.')
  if (file.size > maxInputBytes) throw new ImageTooLargeError()

  const objectUrl = URL.createObjectURL(file)
  try {
    const img = await loadImage(objectUrl)

    const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
    const width = Math.round(img.width * scale)
    const height = Math.round(img.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas indisponível neste navegador.')
    ctx.drawImage(img, 0, 0, width, height)

    // Reduz a qualidade progressivamente até caber no alvo de tamanho.
    let quality = 0.82
    let dataUrl = canvas.toDataURL('image/jpeg', quality)
    while (dataUrlBytes(dataUrl) > maxOutputBytes && quality > 0.4) {
      quality -= 0.12
      dataUrl = canvas.toDataURL('image/jpeg', quality)
    }
    return dataUrl
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
