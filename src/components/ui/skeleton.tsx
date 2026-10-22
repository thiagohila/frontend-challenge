import { cn } from "cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        // Shimmer (REQUIREMENTS U3); static under prefers-reduced-motion.
        "rounded-md bg-card bg-[linear-gradient(90deg,var(--surface-card)_0%,var(--surface-raised)_50%,var(--surface-card)_100%)] bg-size-[200%_100%] motion-safe:animate-shimmer",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
