import type { pt } from './pt'

// Values that are identifiers, not copy: they must match exactly in every locale.
type LiteralKeys = 'tab' | 'art' | 'slug'

/** The pt dictionary's shape with copy widened to `string`, so other locales can differ in text. */
type DeepWiden<T> = T extends (...args: infer A) => infer R
  ? (...args: A) => DeepWiden<R>
  : T extends string
    ? string
    : T extends object
      ? { readonly [K in keyof T]: K extends LiteralKeys ? T[K] : DeepWiden<T[K]> }
      : T

export type Dictionary = DeepWiden<typeof pt> & {
  /** en-US only: pt-BR contract message → translation (see `translateMessage`). */
  readonly messages?: Readonly<Record<string, string>>
}
