import { getTranslations } from "next-intl/server"
import CreateOrgForm from "@/app/components/private/CreateOrgForm"

export default async function CreateOrg() {
  const t = await getTranslations()

  return (
    <>
      <div
        className="flex justify-center p-10"
      >
        <h1
          className="text-center text-3xl md:text-4xl font-bold"
        >
          {t("pages.org.create.title")}
        </h1>
      </div>

      <div
        className="flex justify-center"
      >
        <CreateOrgForm />
      </div>
    </>
  )
}