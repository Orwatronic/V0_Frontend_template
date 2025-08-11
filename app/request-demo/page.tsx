"use client"

import { useActionState, useEffect } from "react"
import { submitDemoRequest } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSearchParams } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { useI18n } from "@/contexts/i18n-context"

export default function RequestDemoPage() {
  const { t } = useI18n()
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
              <h1 className="text-2xl font-bold mb-2">{t("requestDemo.title")}</h1>
              <p className="text-muted-foreground mb-6">{t("requestDemo.description")}</p>

              <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("requestDemo.form.name")}</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("requestDemo.form.email")}</Label>
                  <Input id="email" type="email" name="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">{t("requestDemo.form.company")}</Label>
                  <Input id="company" name="company" required />
                </div>
                <input type="hidden" name="intent" value={intent} />
                <Button type="submit" disabled={pending}>
                  {pending ? t("requestDemo.form.submitting") : t("requestDemo.form.submit")}
                </Button>
              </form>

              {state?.ok && (
                <div className="mt-6 flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{t("requestDemo.success")}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
