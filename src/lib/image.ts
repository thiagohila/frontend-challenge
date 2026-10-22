/** Avatar pipeline (SECURITY.md): MIME allowlist, input ≤ 2 MB, re-encoded as a 256×256 WebP (drops EXIF/metadata). */
export const AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const
export const AVATAR_INPUT_MAX_BYTES = 2 * 1024 * 1024
const AVATAR_SIZE = 256

export type AvatarProblem = 'type' | 'size'

export function checkAvatar(file: File): AvatarProblem | null {
  if (!(AVATAR_TYPES as readonly string[]).includes(file.type)) return 'type'
  if (file.size > AVATAR_INPUT_MAX_BYTES) return 'size'
  return null
}

export async function toAvatarDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const side = Math.min(bitmap.width, bitmap.height)
  const canvas = document.createElement('canvas')
  canvas.width = AVATAR_SIZE
  canvas.height = AVATAR_SIZE
  const context = canvas.getContext('2d')
  if (!context) throw new Error('canvas 2d context unavailable')
  // Center-crop to a square, then scale down.
  context.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE)
  bitmap.close()
  return canvas.toDataURL('image/webp', 0.85)
}
