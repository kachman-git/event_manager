'use client'

import React, { ErrorInfo } from 'react'
import { useToast } from "@/hooks/use-toast"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundaryClass extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
    // You can log the error to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h1>
          <p className="text-gray-600 mb-4">We're sorry for the inconvenience. Please try refreshing the page.</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const { toast } = useToast()

  // We're not using the toast function directly, but we'll keep it for future use
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Toast function is available for use')
    }
  }, [toast])

  return (
    <ErrorBoundaryClass>
      {children}
    </ErrorBoundaryClass>
  )
}

