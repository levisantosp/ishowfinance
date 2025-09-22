import { getTranslations } from "next-intl/server"

export default async function Login() {
  const t = await getTranslations()

  return (
    <>
     <div>
      <h1
        className="text-center text-3xl font-bold"
      >
        {t("pages.dash.title")}
      </h1>
     </div>
    </>
  )
}