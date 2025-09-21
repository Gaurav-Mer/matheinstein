import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

// Generate a consistent color based on a string (name)
function generateColorFromName(name: string): string {
  if (!name) return "hsl(220, 13%, 69%)" // default gray

  // Create a hash from the name
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Color palette with good contrast and professional appearance
  const colors = [
    "hsl(220, 90%, 56%)",   // Blue
    "hsl(262, 83%, 58%)",   // Purple
    "hsl(198, 93%, 60%)",   // Cyan
    "hsl(158, 64%, 52%)",   // Green
    "hsl(48, 96%, 53%)",    // Yellow
    "hsl(20, 90%, 56%)",    // Orange
    "hsl(346, 87%, 60%)",   // Pink
    "hsl(291, 64%, 42%)",   // Dark Purple
    "hsl(142, 71%, 45%)",   // Forest Green
    "hsl(217, 91%, 60%)",   // Light Blue
    "hsl(36, 100%, 50%)",   // Amber
    "hsl(339, 82%, 52%)",   // Rose
    "hsl(176, 77%, 47%)",   // Teal
    "hsl(270, 95%, 75%)",   // Lavender
    "hsl(12, 76%, 61%)",    // Red-Orange
    "hsl(60, 100%, 50%)",   // Lime
  ]

  return colors[Math.abs(hash) % colors.length]
}

// Extract initials from a name
function getInitials(name: string): string {
  if (!name) return "?"

  const words = name.trim().split(/\s+/)
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase()
  }

  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
}

interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  /** Name used to generate background color and initials */
  name?: string
}

interface AvatarFallbackProps extends React.ComponentProps<typeof AvatarPrimitive.Fallback> {
  /** Name used to generate background color and initials */
  name?: string
  /** Custom initials (overrides name-based initials) */
  initials?: string
}

function Avatar({
  className,
  ...props
}: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  name,
  initials,
  children,
  ...props
}: AvatarFallbackProps) {
  const backgroundColor = name ? generateColorFromName(name) : undefined
  const displayInitials = initials || (name ? getInitials(name) : children)

  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full text-white font-medium text-sm",
        !backgroundColor && "bg-muted text-muted-foreground", // fallback to default styling
        className
      )}
      style={backgroundColor ? { backgroundColor } : undefined}
      {...props}
    >
      {displayInitials}
    </AvatarPrimitive.Fallback>
  )
}

export { Avatar, AvatarImage, AvatarFallback }