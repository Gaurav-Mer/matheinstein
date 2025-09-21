/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-6", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  variant?: "default" | "pills" | "underline" | "cards" | "gradient"
}) {
  const variants = {
    default: "bg-transparent backdrop-blur-sm border border-gray-200/50 shadow-lg shadow-gray-200/20",
    pills: "bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200/60 shadow-sm",
    underline: "bg-transparent border-b border-gray-200",
    cards: "bg-white shadow-xl shadow-gray-200/25 border border-gray-100",
    gradient: "bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100/50 shadow-lg shadow-blue-100/30"
  };

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex w-fit items-center justify-center rounded-2xl border-none  p-1 transition-all duration-300",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  variant = "underline",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  variant?: "default" | "pills" | "underline" | "cards" | "gradient"
}) {
  const variants = {
    default: cn(
      "relative overflow-hidden",
      "data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:shadow-none data-[state=active]:shadow-none",
      "data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-white",
      "before:absolute before:inset-0 before:rounded-xl before:opacity-0 before:transition-opacity before:duration-300",
      "data-[state=active]:before:opacity-100 data-[state=active]:before:animate-pulse",
      "after:absolute after:inset-[1px] after:rounded-[11px] after:bg-white after:transition-all after:duration-300",
      "data-[state=active]:after:bg-transparent data-[state=inactive]:after:bg-transparent"
    ),
    pills: cn(
      "data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-200/50",
      "data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-white/70"
    ),
    underline: cn(
      "border-b-2 border-transparent rounded-none shadow-none bg-transparent",
      "data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent",
      "data-[state=inactive]:text-gray-600"
    ),
    cards: cn(
      "data-[state=active]:bg-gradient-to-br data-[state=active]:from-white data-[state=active]:to-gray-50 data-[state=active]:text-gray-900 data-[state=active]:shadow-md data-[state=active]:shadow-gray-200/30 data-[state=active]:border data-[state=active]:border-gray-200/50",
      "data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:bg-white/50"
    ),
    gradient: cn(
      "relative overflow-hidden",
      "data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-200/50",
      "data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-white/60",
      "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-blue-400 before:via-indigo-400 before:to-purple-400 before:opacity-0 before:blur-xl before:transition-opacity before:duration-500",
      "data-[state=active]:before:opacity-30"
    )
  };

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative z-10 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        "disabled:pointer-events-none disabled:opacity-50",
        "transform hover:scale-[1.02] active:scale-[0.98]",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 outline-none",
        "animate-in fade-in-0 slide-in-from-bottom-1 duration-300",
        "data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:slide-out-to-bottom-1",
        className
      )}
      {...props}
    />
  )
}

// Enhanced Tabs with built-in variants
function ModernTabs({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & {
  variant?: "default" | "pills" | "underline" | "cards" | "gradient"
}) {
  return (
    <Tabs className={className} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabsList) {
          return React.cloneElement(child, { variant } as any);
        }
        if (React.isValidElement(child) && child.type === TabsTrigger) {
          return React.cloneElement(child, { variant } as any);
        }
        return child;
      })}
    </Tabs>
  );
}

// Animated Badge for Tab Labels
function TabBadge({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "ml-2 inline-flex items-center justify-center rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600",
        "group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary",
        "transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// Tab with Icon Support
function IconTab({
  children,
  icon: Icon,
  badge,
  className,
  ...props
}: React.ComponentProps<typeof TabsTrigger> & {
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
}) {
  return (
    <TabsTrigger className={cn("group", className)} {...props}>
      {Icon && <Icon className="transition-transform duration-200 group-hover:scale-110" />}
      {children}
      {badge && <TabBadge>{badge}</TabBadge>}
    </TabsTrigger>
  );
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ModernTabs,
  TabBadge,
  IconTab
}

