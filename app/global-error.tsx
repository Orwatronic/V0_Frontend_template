"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <Card className="shadow-lg">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">System Error</CardTitle>
                <p className="text-gray-600 mt-2">A critical error occurred. Please try refreshing the page.</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {process.env.NODE_ENV === "development" && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <div className="text-sm font-medium text-red-800 mb-1">Debug Information:</div>
                    <div className="text-xs text-red-600 font-mono break-all">{error.message}</div>
                    {error.digest && <div className="text-xs text-red-500 mt-1">Error ID: {error.digest}</div>}
                  </div>
                )}

                <div className="space-y-3 pt-4">
                  <Button onClick={reset} className="w-full flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = "/")}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    Go to Homepage
                  </Button>
                </div>

                <div className="text-center pt-4 border-t">
                  <p className="text-xs text-gray-500">If this problem persists, please contact support.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </body>
    </html>
  )
}
