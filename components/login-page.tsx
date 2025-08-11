"use client"

import type React from "react"
import { useState, useRef, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, Mail, Building, ShieldCheck, Shield, Timer } from 'lucide-react'
import { useAuth } from "@/contexts/auth-context"
import { useI18n } from "@/contexts/i18n-context"
import { LanguageSwitcher } from "@/components/language-switcher"

type Step = "credentials" | "mfa" | "deviceTrust"

const MAX_ATTEMPTS = 5
const LOCKOUT_SECONDS = 60

export default function LoginPage() {
  const router = useRouter()
  const { t } = useI18n()
  const { login, isLoading } = useAuth()

  // Testing mode toggle to bypass backend and MFA.
  const [mockAuth, setMockAuth] = useState<boolean>(() => {
    if (typeof window === "undefined") return true
    const v = window.localStorage.getItem("feebee:auth:mock")
    return v ? v === "1" : true
  })
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("feebee:auth:mock", mockAuth ? "1" : "0")
    }
  }, [mockAuth])

  // Steps & UI state
  const [step, setStep] = useState<Step>("credentials")
  const [showPassword, setShowPassword] = useState(false)

  // Errors & lockout
  const [error, setError] = useState<string | null>(null)
  const [attempts, setAttempts] = useState<number>(0)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)

  // Orgs
  const [orgsLoading, setOrgsLoading] = useState(false)
  const [orgsError, setOrgsError] = useState<string | null>(null)
  const [organizations, setOrganizations] = useState<{ code: string; name: string }[]>([])

  // MFA & trust
  const [mfaCode, setMfaCode] = useState("")
  const [trustDevice, setTrustDevice] = useState(true)

  // Form data
  const [formData, setFormData] = useState({
    email: "demo@feebee.com",
    password: "password",
    company: "",
  })

  // Focus management
  const alertRef = useRef<HTMLDivElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const mfaRef = useRef<HTMLInputElement>(null)

  // Step announcement for a11y
  const stepAnnouncement = useMemo(() => {
    const names: Record<Step, string> = {
      credentials: t("auth.login.title"),
      mfa: t("auth.login.mfa.title"),
      deviceTrust: t("auth.login.deviceTrust.title"),
    }
    const index = step === "credentials" ? 1 : step === "mfa" ? 2 : 3
    return t("auth.login.stepAnnounce", { current: index, total: 3, name: names[step] })
  }, [step, t])

  // Lockout countdown
  const [now, setNow] = useState<number>(Date.now())
  useEffect(() => {
    if (!lockedUntil) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [lockedUntil])
  const secondsLeft = useMemo(() => {
    if (!lockedUntil) return 0
    const diff = Math.ceil((lockedUntil - now) / 1000)
    return diff > 0 ? diff : 0
  }, [lockedUntil, now])

  // Focus first field on step change
  useEffect(() => {
    if (step === "credentials") emailRef.current?.focus()
    if (step === "mfa") mfaRef.current?.focus()
  }, [step])

  // Announce errors
  useEffect(() => {
    if (error && alertRef.current) {
      alertRef.current.focus()
    }
  }, [error])

  // Discover organizations only when the email is valid and the user leaves the email field.
  async function discoverOrganizations(email: string) {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!emailValid) {
      setOrganizations([])
      setFormData((prev) => ({ ...prev, company: "" }))
      return
    }
    try {
      setOrgsLoading(true)
      setOrgsError(null)
      // CURSOR: API call to GET /api/v1/organizations?email={email}
      const res = await fetch(`/api/organizations?email=${encodeURIComponent(email)}`, { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load orgs")
      const data = (await res.json()) as { organizations: { code: string; name: string }[] }
      setOrganizations(data.organizations || [])
      // Auto-select when only one org is allowed; hide the selector later if needed.
      const first = data.organizations?.[0]
      setFormData((prev) => ({ ...prev, company: first ? first.code : "" }))
    } catch {
      setOrgsError(t("auth.login.orgsError"))
      setOrganizations([])
      setFormData((prev) => ({ ...prev, company: "" }))
    } finally {
      setOrgsLoading(false)
    }
  }

  const handleCredentialsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (lockedUntil && Date.now() < lockedUntil) {
      setError(t("auth.login.lockout.subtitle"))
      return
    }
    setError(null)

    // Basic validation
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    if (!emailValid) {
      setError(t("auth.login.errors.emailInvalid"))
      return
    }

    // Require a company if multiple are possible; when none returned, prompt for support or fallback.
    if (!formData.company) {
      setError(t("auth.login.orgsError")) // reuse existing key
      return
    }

    // Mock path: go straight in while testing
    if (mockAuth) {
      try {
        await login(formData.email, formData.company)
        router.push("/dashboard")
      } catch {
        router.push("/dashboard")
      }
      return
    }

    // Real flow (when backend is ready)
    // CURSOR: API call to POST /api/v1/auth/login
    // For now require MFA in the placeholder path
    setStep("mfa")
  }

  const handleVerifyMfa = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (lockedUntil && Date.now() < lockedUntil) {
      setError(t("auth.login.lockout.subtitle"))
      return
    }
    setError(null)

    // CURSOR: API call to POST /api/v1/auth/mfa/verify
    const ok = mfaCode.trim().length === 6
    if (!ok) {
      const nextAttempts = attempts + 1
      setAttempts(nextAttempts)
      if (nextAttempts >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_SECONDS * 1000)
        setError(t("auth.login.lockout.title"))
      } else {
        setError(t("auth.login.errors.generic"))
      }
      return
    }

    setStep("deviceTrust")
  }

  const handleTrustDevice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    // CURSOR: API call to POST /api/v1/auth/device-trust

    try {
      await login(formData.email, formData.company)
      router.push("/dashboard")
    } catch {
      setError(t("auth.login.errors.generic"))
    }
  }

  const currentYear = new Date().getFullYear()
  const companyName = t("auth.login.companyName")
  const isLocked = lockedUntil !== null && Date.now() < (lockedUntil ?? 0)

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative" aria-labelledby="login-title">
      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 opacity-50"
        aria-hidden="true"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23e5e7eb' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      {/* Language + Testing toggles */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <label className="hidden md:inline-flex items-center gap-2 text-xs text-gray-600 bg-white/80 border border-gray-200 rounded-md px-2 py-1">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={mockAuth}
            onChange={(e) => setMockAuth(e.target.checked)}
            aria-label={t("auth.login.testing.mockAuthLabel")}
          />
          <span>{t("auth.login.testing.mockAuthLabel")}</span>
        </label>
        <LanguageSwitcher />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-2xl bg-white/95 backdrop-blur-sm border border-gray-200/80 rounded-xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-5" aria-hidden="true">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl mr-3 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">{t("auth.login.brandShort")}</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">{t("auth.login.brandName")}</span>
            </div>

            <CardTitle id="login-title" className="text-2xl font-bold text-gray-900 mb-1">
              {step === "credentials" && t("auth.login.title")}
              {step === "mfa" && t("auth.login.mfa.title")}
              {step === "deviceTrust" && t("auth.login.deviceTrust.title")}
            </CardTitle>
            <p className="text-gray-500">
              {step === "credentials" && t("auth.login.subtitle")}
              {step === "mfa" && t("auth.login.mfa.subtitle")}
              {step === "deviceTrust" && t("auth.login.deviceTrust.description")}
            </p>
          </CardHeader>

          <CardContent className="space-y-6 px-8">
            {/* Step announcement for screen readers */}
            <div className="sr-only" role="status" aria-live="polite">{stepAnnouncement}</div>

            {/* Lockout banner */}
            {isLocked && (
              <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 text-amber-800 p-3">
                <Timer className="h-4 w-4" aria-hidden="true" />
                <div className="text-sm">
                  <div className="font-medium">{t("auth.login.lockout.title")}</div>
                  <div>{t("auth.login.lockout.retryIn", { seconds: Math.max(0, Math.ceil((lockedUntil! - now) / 1000)) })}</div>
                </div>
              </div>
            )}

            {/* Live region for errors */}
            {error ? (
              <div
                ref={alertRef}
                role="alert"
                tabIndex={-1}
                aria-label={t("auth.login.aria.errorRegion")}
                className="rounded-md border border-red-300 bg-red-50 text-red-700 p-3"
              >
                {error}
              </div>
            ) : null}

            {/* Credentials Step */}
            {step === "credentials" && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4" aria-busy={isLoading}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    {t("auth.login.email")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                    <Input
                      ref={emailRef}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder={t("auth.login.emailPlaceholder")}
                      className="pl-10"
                      value={formData.email}
                      onBlur={() => discoverOrganizations(formData.email)}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Organization selector: only shows organizations allowed for the provided email */}
                {organizations.length > 1 && (
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-gray-700">
                      {t("auth.login.company")}
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" aria-hidden="true" />
                      <select
                        id="company"
                        name="organization"
                        className="w-full pl-10 pr-8 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                        aria-busy={orgsLoading}
                        aria-invalid={!!orgsError}
                      >
                        {organizations.map((o) => (
                          <option key={o.code} value={o.code}>
                            {o.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700" aria-hidden="true">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                    {orgsError && <p className="text-xs text-red-600">{orgsError}</p>}
                  </div>
                )}

                {/* If exactly one org is allowed, we don't show the dropdown. If zero, we keep it hidden and rely on support path. */}
                {organizations.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    {orgsLoading ? t("auth.login.orgsLoading") : t("auth.login.selectCompany")}
                  </p>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    {t("auth.login.password")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder={t("auth.login.passwordPlaceholder")}
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-pressed={showPassword}
                      aria-label={showPassword ? t("auth.login.aria.togglePasswordHide") : t("auth.login.aria.togglePasswordShow")}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
                  disabled={isLoading || isLocked}
                >
                  {isLoading ? t("auth.login.loading") : t("auth.login.signIn")}
                </Button>
              </form>
            )}

            {/* MFA Step */}
            {step === "mfa" && (
              <form onSubmit={handleVerifyMfa} className="space-y-4" aria-busy={isLoading}>
                <div className="space-y-2">
                  <Label htmlFor="mfa" className="text-gray-700">
                    {t("auth.login.mfa.codeLabel")}
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                    <Input
                      ref={mfaRef}
                      id="mfa"
                      name="mfa"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      placeholder={t("auth.login.mfa.placeholder")}
                      className="pl-10"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                      required
                      aria-describedby="mfa-help"
                    />
                  </div>
                  <p id="mfa-help" className="text-xs text-gray-500">{t("auth.login.mfa.help")}</p>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="secondary" className="flex-1" onClick={() => setStep("credentials")}>
                    {t("auth.login.mfa.back")}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
                    disabled={isLoading || isLocked}
                  >
                    {t("auth.login.mfa.verify")}
                  </Button>
                </div>
              </form>
            )}

            {/* Device Trust Step */}
            {step === "deviceTrust" && (
              <form onSubmit={handleTrustDevice} className="space-y-4" aria-busy={isLoading}>
                <div className="flex items-start gap-3 rounded-md border border-gray-200 bg-gray-50 p-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5" aria-hidden="true" />
                  <div className="text-sm">
                    <div className="font-medium">{t("auth.login.deviceTrust.title")}</div>
                    <div className="text-gray-600">{t("auth.login.deviceTrust.description")}</div>
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={trustDevice}
                    onChange={(e) => setTrustDevice(e.target.checked)}
                  />
                  <span>{t("auth.login.trustCheckboxLabel")}</span>
                </label>

                <div className="flex gap-3">
                  <Button type="button" variant="secondary" className="flex-1" onClick={() => setStep("mfa")}>
                    {t("auth.login.mfa.back")}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
                    disabled={isLoading}
                  >
                    {t("auth.login.trustSubmit")}
                  </Button>
                </div>
              </form>
            )}

            {/* Footer links */}
            <div className="text-center mt-6 space-y-2 pt-4">
              {step === "credentials" && (
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline transition-colors"
                  onClick={() => router.push("/forgot-password")}
                >
                  {t("auth.login.forgotPassword")}
                </button>
              )}

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <span>{t("auth.login.copyright", { year: currentYear, company: companyName })}</span>
                <span aria-hidden="true">•</span>
                <span>{t("auth.login.systemName")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
