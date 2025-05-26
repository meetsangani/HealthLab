import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg shadow-sm text-card-foreground",
  {
    variants: {
      variant: {
        default: "bg-card border border-border",
        ghost: "bg-transparent border-none shadow-none",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 shadow-glass",
        glassDark: "bg-black/30 backdrop-blur-md border border-white/10 shadow-glass",
        gradient: "bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10",
        outline: "bg-transparent border border-border",
        animated: "relative p-[1px] bg-gradient-to-br from-primary via-accent to-secondary bg-[length:400%_400%] animate-gradient-xy overflow-hidden",
      },
      hover: {
        none: "",
        lift: "transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
        scale: "transition-all duration-300 hover:scale-[1.02] hover:shadow-md",
        glow: "transition-all duration-300 hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]",
        border: "transition-all duration-300 hover:border-primary/50",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: "lift",
    },
  }
)

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>
>(({ className, variant, hover, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, hover }), className)}
    {...props}
  >
    {variant === 'animated' ? (
      <div className="bg-card h-full w-full rounded-[calc(var(--radius)-1px)] p-4">
        {props.children}
      </div>
    ) : (
      props.children
    )}
  </div>
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }
