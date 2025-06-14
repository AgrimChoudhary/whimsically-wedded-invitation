
import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'underlined-golden';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, variant = 'default', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        {variant === 'underlined-golden' ? (
          <div className="relative">
            <input
              type={type}
              className={cn(
                "w-full bg-transparent border-0 border-b-2 border-gray-200 px-0 py-3 text-lg font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-transparent transition-all duration-300",
                "focus:ring-0 focus:shadow-none",
                error ? "border-red-500" : "",
                className
              )}
              ref={ref}
              {...props}
            />
            
            {/* Modern Golden Underline */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-200">
              <div className="golden-underline-animation h-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 transform scale-x-0 origin-left transition-transform duration-700 ease-out shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
            
            {/* Glow effect */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400/20 via-yellow-500/40 to-amber-400/20 blur-sm opacity-0 golden-glow-animation transition-opacity duration-700"></div>
          </div>
        ) : (
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              error ? "border-red-500" : "",
              className
            )}
            ref={ref}
            {...props}
          />
        )}
        
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
