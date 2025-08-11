"use client"

import { useActionState, useEffect } from "react"
import { submitDemoRequest } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSearchParams } from "next/navigation"
import { CheckCircle2 } from 'lucide-react'

export default function RequestDemoPage() {
  const searchParams = useSearchParams()
  const intent = searchParams.get("intent") || ""
  const [state, formAction, pending] = useActionState(async (_prev: any, formData: FormData) => {
    const res = await submitDemoRequest(formData)
    return res
  }, null)

  useEffect(() => {
    // Prefill intent hidden input or display on UI if needed
  }, [intent])

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-xl mx-auto">
          <Card className="border">
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold mb-2">Request a Demo</h1>
              <p className="text-muted-foreground mb-6">
                Tell us a bit about your company and which solution you’re interested in. We’ll reach out shortly.
              </p>

              <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <Input id="email" type="email" name="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" name="company" required />
                </div>
                <input type="hidden" name="intent" value={intent} />
                <Button type="submit" disabled={pending}>
                  {pending ? "Submitting..." : "Submit request"}
                </Button>
              </form>

              {state?.ok && (
                <div className="mt-6 flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Your request was submitted. We’ll get back to you.</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
