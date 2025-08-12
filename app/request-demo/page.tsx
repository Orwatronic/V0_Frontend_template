"use client"

import { useEffect } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { submitDemoRequest } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSearchParams } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { useI18n } from "@/contexts/i18n-context"

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus()
  return <Button type="submit" disabled={pending}>{pending ? pendingLabel : label}</Button>
}

export default function RequestDemoPage() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const intent = searchParams.get("intent") || ""
  const initialState: any = null
  const [state, formAction] = useFormState(async (_prev: any, formData: FormData) => {
    const res = await submitDemoRequest(formData)
    return res
  }, initialState)

  useEffect(() => {
    // Prefill intent hidden input or display on UI if needed
  }, [intent])

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-xl mx-auto">
          <Card className="border">
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold mb-2">{t("demo.title")}</h1>
              <p className="text-muted-foreground mb-6">{t("demo.description")}</p>

              <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("demo.form.fullName")}</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("demo.form.workEmail")}</Label>
                  <Input id="email" type="email" name="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">{t("demo.form.company")}</Label>
                  <Input id="company" name="company" required />
                </div>
                <input type="hidden" name="intent" value={intent} />
                <SubmitButton label={t("demo.form.submit")} pendingLabel={t("demo.form.submitting")} />
              </form>

              {state?.ok && (
                <div className="mt-6 flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{t("demo.success")}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
