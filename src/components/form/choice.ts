/**
 * Radios/checkboxes styled per the Figma: a primary ring only (no filled native background), with a
 * primary dot when checked. Disabled = dimmed. Native inputs underneath: semantics and keyboard intact.
 */
export const choiceClassName =
  "grid size-4 shrink-0 appearance-none place-content-center rounded-full border border-primary bg-transparent before:size-2 before:scale-0 before:rounded-full before:bg-primary before:transition-transform before:content-[''] checked:before:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:before:transition-none"
