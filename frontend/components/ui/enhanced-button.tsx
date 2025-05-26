"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-foreground shadow-glass hover:bg-white/20",
        glassDark: "bg-black/30 backdrop-blur-md border border-white/10 text-white shadow-glass hover:bg-black/40",
        gradient: "bg-gradient-to-r from-primary to-accent text-white shadow-md hover:shadow-lg",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "hover:animate-bounce",
        ripple: "", // Handle with JS ripple effect
        scale: "hover:scale-105 active:scale-95 transition duration-200",
        slide: "transition-all duration-300 hover:-translate-y-1",
        glow: "transition-all duration-300 hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "scale",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    asChild = false, 
    loading = false,
    leadingIcon,
    trailingIcon,
    children,
    onClick,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    const [coords, setCoords] = React.useState({ x: -1, y: -1 });
    const [isRippling, setIsRippling] = React.useState(false);
    
    React.useEffect(() => {
      if (coords.x !== -1 && coords.y !== -1) {
        setIsRippling(true);
        setTimeout(() => setIsRippling(false), 500);
      } else {
        setIsRippling(false);
      }
    }, [coords]);
    
    React.useEffect(() => {
      if (!isRippling) setCoords({ x: -1, y: -1 });
    }, [isRippling]);
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (animation === "ripple") {
        const rect = e.currentTarget.getBoundingClientRect();
        setCoords({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
      onClick?.(e);
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        onClick={handleClick}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!loading && leadingIcon && (
          <span className="mr-2">{leadingIcon}</span>
        )}
        {children}
        {!loading && trailingIcon && (
          <span className="ml-2">{trailingIcon}</span>
        )}
        {animation === "ripple" && isRippling && (
          <span 
            className="absolute bg-white/30 rounded-full animate-[ripple_0.5s_ease-out]"
            style={{
              left: coords.x,
              top: coords.y,
              width: '500%',
              height: '500%',
              transform: 'translate(-50%, -50%) scale(0)',
            }}
          />
        )}
      </Comp>
    )
  }
)
Button.displayName = "EnhancedButton"

export { Button, buttonVariants }
