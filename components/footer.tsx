"use client"

import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Globe, Linkedin, Twitter, Facebook, Youtube, ArrowRight, Shield, Award, Clock } from 'lucide-react'
import Link from "next/link"
import { useI18n } from "@/contexts/i18n-context"

const Footer = () => {
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t">
      {/* Newsletter Section */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">{t("footer.newsletter.title")}</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">{t("footer.newsletter.description")}</p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t("footer.newsletter.placeholder")}
                aria-label={t("footer.newsletter.placeholder")}
                className="flex-1 px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                autoComplete="email"
              />
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                {t("footer.newsletter.subscribe")}
                <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-4">{t("footer.newsletter.privacy")}</p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg mr-3" aria-hidden="true"></div>
              <span className="text-xl font-bold text-foreground">{t("footer.brand")}</span>
            </div>

            <p className="text-muted-foreground mb-6 max-w-md">{t("footer.company.description")}</p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-3 text-primary" aria-hidden="true" />
                <span>{t("footer.company.address")}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-3 text-primary" aria-hidden="true" />
                <span>{t("footer.company.phoneNumber")}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-3 text-primary" aria-hidden="true" />
                <span>{t("footer.company.emailAddress")}</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="p-2" aria-label={"LinkedIn"}>
                <Linkedin className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2" aria-label={"Twitter/X"}>
                <Twitter className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2" aria-label={"Facebook"}>
                <Facebook className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2" aria-label={"YouTube"}>
                <Youtube className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("footer.solutions.title")}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/financial" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.solutions.financial")}
                </Link>
              </li>
              <li>
                <Link href="/employees" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.solutions.hcm")}
                </Link>
              </li>
              <li>
                <Link href="/materials" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.solutions.materials")}
                </Link>
              </li>
              <li>
                <Link href="/sales" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.solutions.sales")}
                </Link>
              </li>
              <li>
                <Link href="/mdm" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.solutions.mdm")}
                </Link>
              </li>
              <li>
                <Link href="/organizational" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.solutions.organizational")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("footer.resources.title")}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/documentation" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.resources.documentation")}
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.resources.apiDocs")}
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.resources.tutorials")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.resources.blog")}
                </Link>
              </li>
              <li>
                <Link href="/webinars" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.resources.webinars")}
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.resources.support")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("footer.company.title")}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.company.about")}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.company.careers")}
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.company.partners")}
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.company.news")}
                </Link>
              </li>
              <li>
                <Link href="/investors" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.company.investors")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.company.contact")}
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.company.events")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm font-medium">{t("footer.trust.soc2")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm font-medium">{t("footer.trust.iso27001")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm font-medium">{t("footer.trust.gdpr")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm font-medium">{t("footer.trust.uptime")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              {"© "}{currentYear} {" "}{t("footer.companyName")}{". "}{t("footer.copyright")}
            </div>

            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t("footer.legal.privacy")}
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t("footer.legal.terms")}
              </Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t("footer.legal.cookies")}
              </Link>
              <Link href="/security" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t("footer.legal.security")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
