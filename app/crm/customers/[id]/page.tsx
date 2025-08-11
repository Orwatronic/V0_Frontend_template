import { AppShell } from "@/components/app-shell"
import Customer360 from "@/components/customer-360"

type PageProps = {
  params: { id: string }
  searchParams?: Record<string, string | string[] | undefined>
}

export default function Customer360Page({ params }: PageProps) {
  // Renders the shell exactly once at the page level, like other modules.
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl p-4 md:p-6">
        <Customer360 customerId={params.id} />
      </div>
    </AppShell>
  )
}
