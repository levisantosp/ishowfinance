import { getTranslations } from "next-intl/server"

export default async function Login() {
  const t = await getTranslations()
  return (
    <>
      {t("hello")}
    </>
  )
}