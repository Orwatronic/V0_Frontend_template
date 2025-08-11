"use client"

import { useState, useMemo } from 'react'
import { Building, Calendar, Users, FileText, CheckCircle, ArrowRight, ArrowLeft, Loader2, Upload, Plus, Trash2, Globe, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

const useTranslation = () => ({
  t: (key: string) =>
    ({
      'onboarding.title': 'Company Setup Wizard',
      'onboarding.description': 'Follow these steps to configure your new ERP environment.',
      'step.1.title': 'Company Profile',
      'step.1.description': 'Enter your basic company information.',
      'step.2.title': 'Fiscal Year',
      'step.2.description': 'Define your company’s financial calendar.',
      'step.3.title': 'Chart of Accounts',
      'step.3.description': 'Establish your general ledger structure.',
      'step.4.title': 'Invite Users',
      'step.4.description': 'Invite your team members to the platform.',
      'step.5.title': 'Confirmation',
      'step.5.description': 'Review your setup and finalize the onboarding.',
      'form.companyName': 'Company Name',
      'form.legalName': 'Legal Business Name',
      'form.taxId': 'Tax ID / VAT Number',
      'form.country': 'Country',
      'form.currency': 'Default Currency',
      'form.address': 'Company Address',
      'form.fiscalYearStart': 'Fiscal Year Start Month',
      'form.accountingPeriods': 'Number of Accounting Periods',
      'form.coaSetupMethod': 'How would you like to set up your Chart of Accounts?',
      'form.coa.template': 'Use a pre-defined template',
      'form.coa.upload': 'Upload a CSV file',
      'form.coa.selectTemplate': 'Select a CoA Template',
      'form.coa.uploadFile': 'Upload CSV File',
      'form.invite.email': 'Email Address',
      'form.invite.role': 'Role',
      'form.invite.add': 'Add User',
      'summary.companyInfo': 'Company Information',
      'summary.fiscalConfig': 'Fiscal Configuration',
      'summary.coaMethod': 'Chart of Accounts Method',
      'summary.invitedUsers': 'Invited Users',
      'final.successTitle': 'Setup Complete!',
      'final.successMessage': 'Your Feebee ERP environment has been successfully configured. You will be redirected to the dashboard shortly.',
      'common.next': 'Next Step',
      'common.back': 'Back',
      'common.finish': 'Complete Setup',
      'common.loading': 'Processing...',
    }[key] || key),
})

const mockCountries = [
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED' },
]

const mockCoaTemplates = [
  { id: 'std-retail', name: 'Standard Retail CoA' },
  { id: 'std-mfg', name: 'Standard Manufacturing CoA' },
  { id: 'std-service', name: 'Standard Service Business CoA' },
]

const steps = [
  { id: 1, title: 'step.1.title', icon: Building },
  { id: 2, title: 'step.2.title', icon: Calendar },
  { id: 3, title: 'step.3.title', icon: FileText },
  { id: 4, title: 'step.4.title', icon: Users },
  { id: 5, title: 'step.5.title', icon: CheckCircle },
]

export const OnboardingWizard = () => {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    companyName: '',
    legalName: '',
    taxId: '',
    country: 'AE',
    currency: 'AED',
    address: '',
    fiscalYearStart: '1', // January
    accountingPeriods: '12',
    coaSetupMethod: 'template',
    coaTemplate: '',
    coaFile: null,
    userInvites: [],
  })
  const [newInvite, setNewInvite] = useState({ email: '', role: 'Standard User' })

  const progress = useMemo(() => ((currentStep - 1) / (steps.length - 1)) * 100, [currentStep])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === 'country') {
      const selectedCountry = mockCountries.find(c => c.code === value);
      if (selectedCountry) {
        setFormData(prev => ({ ...prev, currency: selectedCountry.currency }));
      }
    }
  }

  const handleAddInvite = () => {
    if (newInvite.email) {
      setFormData((prev) => ({
        ...prev,
        userInvites: [...prev.userInvites, newInvite],
      }))
      setNewInvite({ email: '', role: 'Standard User' })
    }
  }

  const handleRemoveInvite = (index) => {
    setFormData((prev) => ({
      ...prev,
      userInvites: prev.userInvites.filter((_, i) => i !== index),
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    console.log('Finalizing setup with data:', formData)
    // CURSOR: API call to POST /api/v1/companies
    await new Promise((res) => setTimeout(res, 1000))
    const companyId = `comp-${Date.now()}`
    console.log(`Company created with ID: ${companyId}`)

    // CURSOR: API call to POST /api/v1/companies/${companyId}/fiscal-year
    await new Promise((res) => setTimeout(res, 500))
    console.log('Fiscal year configured')

    // CURSOR: API call to POST /api/v1/companies/${companyId}/coa
    await new Promise((res) => setTimeout(res, 1000))
    console.log('Chart of Accounts initialized')

    // CURSOR: API call to POST /api/v1/companies/${companyId}/invites
    await new Promise((res) => setTimeout(res, 500))
    console.log('User invites sent')

    // CURSOR: API call to POST /api/v1/companies/${companyId}/finalize
    await new Promise((res) => setTimeout(res, 500))
    console.log('Finalizing setup')

    setIsLoading(false)
    setCurrentStep(currentStep + 1) // Move to success screen
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Company Profile
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">{t('form.companyName')}</Label>
                <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="legalName">{t('form.legalName')}</Label>
                <Input id="legalName" name="legalName" value={formData.legalName} onChange={handleInputChange} />
              </div>
            </div>
            <div>
              <Label htmlFor="taxId">{t('form.taxId')}</Label>
              <Input id="taxId" name="taxId" value={formData.taxId} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">{t('form.country')}</Label>
                <Select name="country" value={formData.country} onValueChange={(v) => handleSelectChange('country', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {mockCountries.map((c) => (
                      <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currency">{t('form.currency')}</Label>
                <Input id="currency" name="currency" value={formData.currency} readOnly disabled />
              </div>
            </div>
            <div>
              <Label htmlFor="address">{t('form.address')}</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
            </div>
          </div>
        )
      case 2: // Fiscal Year
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="fiscalYearStart">{t('form.fiscalYearStart')}</Label>
              <Select name="fiscalYearStart" value={formData.fiscalYearStart} onValueChange={(v) => handleSelectChange('fiscalYearStart', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="accountingPeriods">{t('form.accountingPeriods')}</Label>
              <Select name="accountingPeriods" value={formData.accountingPeriods} onValueChange={(v) => handleSelectChange('accountingPeriods', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12 (Monthly)</SelectItem>
                  <SelectItem value="4">4 (Quarterly)</SelectItem>
                  <SelectItem value="1">1 (Annually)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      case 3: // Chart of Accounts
        return (
          <div className="space-y-4">
            <RadioGroup
              name="coaSetupMethod"
              value={formData.coaSetupMethod}
              onValueChange={(v) => handleSelectChange('coaSetupMethod', v)}
              className="space-y-2"
            >
              <Label>{t('form.coaSetupMethod')}</Label>
              <div className="flex items-center space-x-2 rounded-md border p-4">
                <RadioGroupItem value="template" id="template" />
                <Label htmlFor="template" className="font-normal">{t('form.coa.template')}</Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-4">
                <RadioGroupItem value="upload" id="upload" />
                <Label htmlFor="upload" className="font-normal">{t('form.coa.upload')}</Label>
              </div>
            </RadioGroup>
            {formData.coaSetupMethod === 'template' && (
              <div>
                <Label htmlFor="coaTemplate">{t('form.coa.selectTemplate')}</Label>
                <Select name="coaTemplate" value={formData.coaTemplate} onValueChange={(v) => handleSelectChange('coaTemplate', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {/* CURSOR: API call to GET /api/v1/coa-templates */}
                    {mockCoaTemplates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {formData.coaSetupMethod === 'upload' && (
              <div>
                <Label htmlFor="coaFile">{t('form.coa.uploadFile')}</Label>
                <div className="flex items-center space-x-2">
                  <Input id="coaFile" type="file" accept=".csv" className="flex-grow" />
                  <Button variant="outline" size="icon"><Upload className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </div>
        )
      case 4: // Invite Users
        return (
          <div className="space-y-4">
            <div className="flex items-end space-x-2">
              <div className="flex-grow">
                <Label htmlFor="inviteEmail">{t('form.invite.email')}</Label>
                <Input id="inviteEmail" type="email" value={newInvite.email} onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })} />
              </div>
              <div className="w-48">
                <Label htmlFor="inviteRole">{t('form.invite.role')}</Label>
                <Select value={newInvite.role} onValueChange={(v) => setNewInvite({ ...newInvite, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Standard User">Standard User</SelectItem>
                    <SelectItem value="Read-Only">Read-Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddInvite}><Plus className="h-4 w-4 mr-2" />{t('form.invite.add')}</Button>
            </div>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('form.invite.email')}</TableHead>
                    <TableHead>{t('form.invite.role')}</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.userInvites.map((invite, index) => (
                    <TableRow key={index}>
                      <TableCell>{invite.email}</TableCell>
                      <TableCell>{invite.role}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveInvite(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )
      case 5: // Confirmation
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>{t('summary.companyInfo')}</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1">
                <p><strong>{t('form.companyName')}:</strong> {formData.companyName}</p>
                <p><strong>{t('form.country')}:</strong> {mockCountries.find(c => c.code === formData.country)?.name}</p>
                <p><strong>{t('form.currency')}:</strong> {formData.currency}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>{t('summary.fiscalConfig')}</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1">
                <p><strong>{t('form.fiscalYearStart')}:</strong> {new Date(0, parseInt(formData.fiscalYearStart) - 1).toLocaleString('default', { month: 'long' })}</p>
                <p><strong>{t('form.accountingPeriods')}:</strong> {formData.accountingPeriods}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>{t('summary.coaMethod')}</CardTitle></CardHeader>
              <CardContent className="text-sm">
                {formData.coaSetupMethod === 'template'
                  ? mockCoaTemplates.find(t => t.id === formData.coaTemplate)?.name || 'Not selected'
                  : 'CSV Upload'}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>{t('summary.invitedUsers')}</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm">
                  {formData.userInvites.map((u, i) => <li key={i}>{u.email} ({u.role})</li>)}
                </ul>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  if (currentStep > steps.length) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">{t('final.successTitle')}</h2>
        <p className="text-muted-foreground mt-2">{t('final.successMessage')}</p>
      </div>
    )
  }

  const CurrentStepIcon = steps[currentStep - 1].icon

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50 border-b">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">{t('onboarding.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('onboarding.description')}</p>
          </div>
          <div className="flex items-center gap-4">
            <Progress value={progress} className="w-full" />
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Step {currentStep} of {steps.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CurrentStepIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{t(steps[currentStep - 1].title)}</h3>
              <p className="text-sm text-muted-foreground">{t(steps[currentStep - 1].title.replace('title', 'description'))}</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">{t('common.loading')}</p>
            </div>
          ) : (
            renderStepContent()
          )}
        </CardContent>
        <div className="bg-muted/50 border-t p-6 flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || isLoading}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          {currentStep < steps.length ? (
            <Button onClick={handleNext} disabled={isLoading}>
              {t('common.next')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              {t('common.finish')}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
