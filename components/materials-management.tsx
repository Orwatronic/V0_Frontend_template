import ProcurementWorkflow from "@/components/procurement-workflow"
import { useI18n } from "@/contexts/i18n-context"

const MaterialsManagement = () => {
  const { t } = useI18n()

  return (
    <div>
      <h1>{t("materials.title")}</h1>
      <ProcurementWorkflow />
    </div>
  )
}

export default MaterialsManagement
