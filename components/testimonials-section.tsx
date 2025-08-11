"use client"

import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote, Building, MapPin, TrendingUp, Award, CheckCircle } from "lucide-react"
import Image from "next/image"

// Mock translation function
const useTranslation = () => {
  return {
    t: (key: string) => {
      const translations: Record<string, string> = {
        "testimonials.title": "Trusted by Industry Leaders",
        "testimonials.subtitle":
          "Join thousands of companies worldwide who have transformed their operations with our cloud-native ERP system.",
        "testimonials.stats.companies": "Companies Served",
        "testimonials.stats.countries": "Countries",
        "testimonials.stats.uptime": "Uptime SLA",
        "testimonials.stats.rating": "Customer Rating",
        "testimonials.results": "Key Results",
        "testimonials.trustedBy": "Trusted by leading companies worldwide",
        "testimonials.verified": "Verified Customer",
      }
      return translations[key] || key
    },
  }
}

const TestimonialsSection = () => {
  const { t } = useTranslation()

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Chief Financial Officer",
      company: "TechCorp Industries",
      industry: "Technology",
      location: "San Francisco, USA",
      avatar: "/professional-woman-cfo.png",
      rating: 5,
      quote:
        "Feebee ERP transformed our financial operations completely. The real-time reporting and multi-currency support helped us expand globally with confidence. Our month-end closing process that used to take 10 days now takes just 6 days.",
      results: ["40% faster month-end closing", "Reduced manual errors by 85%", "Improved cash flow visibility"],
      verified: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Operations Director",
      company: "Global Manufacturing Ltd",
      industry: "Manufacturing",
      location: "Singapore",
      avatar: "/professional-asian-operations-director.png",
      rating: 5,
      quote:
        "The materials management module revolutionized our inventory control. We now have complete visibility across all our warehouses worldwide. The batch tracking and serial number management features are exceptional.",
      results: [
        "30% reduction in inventory costs",
        "Improved stock accuracy to 99.5%",
        "Streamlined procurement process",
      ],
      verified: true,
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      title: "HR Director",
      company: "Retail Solutions Group",
      industry: "Retail",
      location: "Madrid, Spain",
      avatar: "/hispanic-hr-director.png",
      rating: 5,
      quote:
        "Managing 2,000+ employees across multiple countries became effortless with Feebee's HCM module. The payroll automation alone saved us countless hours, and the employee self-service portal improved satisfaction significantly.",
      results: [
        "50% reduction in HR admin time",
        "Improved employee satisfaction by 35%",
        "Automated compliance reporting",
      ],
      verified: true,
    },
    {
      id: 4,
      name: "James Wilson",
      title: "CEO",
      company: "Innovate Solutions",
      industry: "Professional Services",
      location: "London, UK",
      avatar: "/british-ceo.png",
      rating: 5,
      quote:
        "The sales and distribution module gave us the insights we needed to optimize our pricing strategy. The integration with our financial module provides real-time profitability analysis that drives our decision-making.",
      results: ["25% increase in profit margins", "Improved sales forecasting accuracy", "Faster quote-to-cash cycle"],
      verified: true,
    },
    {
      id: 5,
      name: "Lisa Park",
      title: "Supply Chain Manager",
      company: "Future Logistics",
      industry: "Logistics",
      location: "Seoul, South Korea",
      avatar: "/korean-supply-chain-manager.png",
      rating: 5,
      quote:
        "The organizational management features helped us restructure our operations efficiently. The cost center tracking and profit center analysis provide the visibility we need to optimize our supply chain operations.",
      results: [
        "20% improvement in operational efficiency",
        "Better cost allocation tracking",
        "Enhanced reporting capabilities",
      ],
      verified: true,
    },
    {
      id: 6,
      name: "Robert Anderson",
      title: "IT Director",
      company: "Enterprise Systems Inc",
      industry: "Technology",
      location: "Toronto, Canada",
      avatar: "/placeholder-1m414.png",
      rating: 5,
      quote:
        "The API-first architecture and master data management capabilities made integration with our existing systems seamless. The cloud-native design ensures we can scale without infrastructure concerns.",
      results: ["Seamless system integration", "99.9% system availability", "Reduced IT maintenance costs by 40%"],
      verified: true,
    },
  ]

  const stats = [
    { value: "500+", label: t("testimonials.stats.companies") },
    { value: "50+", label: t("testimonials.stats.countries") },
    { value: "99.9%", label: t("testimonials.stats.uptime") },
    { value: "4.9/5", label: t("testimonials.stats.rating") },
  ]

  const companyLogos = [
    { name: "TechCorp Industries", logo: "/techcorp-logo.png" },
    { name: "Global Manufacturing", logo: "/placeholder-sudjw.png" },
    { name: "Retail Solutions", logo: "/retail-solutions-logo.png" },
    { name: "Innovate Solutions", logo: "/placeholder-815k4.png" },
    { name: "Future Logistics", logo: "/future-logistics-logo.png" },
    { name: "Enterprise Systems", logo: "/enterprise-systems-logo.png" },
  ]

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">Customer Success</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("testimonials.subtitle")}</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full hover:shadow-hover transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full object-cover"
                      />
                      {testimonial.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                      <p className="text-sm font-medium text-primary">{testimonial.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                  <blockquote className="text-muted-foreground italic leading-relaxed pl-6">
                    "{testimonial.quote}"
                  </blockquote>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-semibold text-foreground flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                    {t("testimonials.results")}
                  </h5>
                  <ul className="space-y-1">
                    {testimonial.results.map((result, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-600 flex-shrink-0" />
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Building className="h-3 w-3 mr-1" />
                    {testimonial.industry}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {testimonial.location}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Company Logos */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-8">{t("testimonials.trustedBy")}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {companyLogos.map((company, index) => (
              <div key={index} className="flex items-center justify-center h-12 group">
                <Image
                  src={company.logo || "/placeholder.svg"}
                  alt={company.name}
                  width={120}
                  height={40}
                  className="object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center space-x-8 opacity-60">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">G2 Leader 2024</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">Capterra Best Value</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">ISO 27001 Certified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
