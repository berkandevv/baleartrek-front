import { resolveImageUrl } from './urls'

// Extrae y normaliza todas las URLs de imágenes asociadas a un comentario sin duplicados
export const extractCommentImageUrls = (comment) => {
  const fromArray = Array.isArray(comment?.images) ? comment.images : []
  const fromSingle = comment?.image ? [comment.image] : []
  const rawItems = [...fromArray, ...fromSingle]

  const urls = rawItems
    .map((item) => {
      if (typeof item === 'string') return item
      return item?.url ?? item?.imageUrl ?? item?.path ?? item?.src ?? ''
    })
    .concat([comment?.imageUrl ?? ''])
    .map((url) => resolveImageUrl(url))
    .filter(Boolean)

  return [...new Set(urls)]
}
