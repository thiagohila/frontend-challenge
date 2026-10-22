import { type ButtonHTMLAttributes, type ReactNode, useId } from 'react'

// Deliberately not the Kurio look (slate + indigo, system font): the panel must never pass for product UI.
export const controlClassName =
  'h-8 w-full rounded border border-[#475569] bg-[#0f172a] px-2 text-xs text-[#e2e8f0] focus-visible:outline-2 focus-visible:outline-[#818cf8]'

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2 border-t border-[#334155] pt-3">
      <h3 className="text-xs font-bold tracking-wide text-[#a5b4fc] uppercase">{title}</h3>
      {children}
    </section>
  )
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: (id: string, describedBy?: string) => ReactNode
}) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs">
        {label}
      </label>
      {children(id, hintId)}
      {hint && (
        <p id={hintId} className="text-[11px] text-[#94a3b8]">
          {hint}
        </p>
      )}
    </div>
  )
}

export function PanelButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="h-8 rounded bg-[#4f46e5] px-3 text-xs font-bold text-white hover:bg-[#6366f1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a5b4fc] disabled:opacity-50"
    />
  )
}
