import React from 'react'
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'

interface CustomButtonProps extends ShadcnButtonProps {
  loading?: boolean
}

export const Button: React.FC<CustomButtonProps> = ({ children, loading, disabled, ...props }) => {
  return (
    <ShadcnButton disabled={disabled || loading} {...props}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </ShadcnButton>
  )
}

