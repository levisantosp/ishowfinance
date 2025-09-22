import { getTranslations } from "next-intl/server"
import LoginMethods from "../../../components/login/LoginMethods.tsx"

export default async function Login() {
  const t = await getTranslations()
  return (
    <>
      <div
        className="flex flex-col items-center justify-center gap-5 p-10"
      >
        <h1
          className="text-3xl md:text-3xl font-bold text-center"
        >
          {t("pages.login.title")}
        </h1>
        <LoginMethods
          google={t("pages.login.google")}
          microsoft={t("pages.login.microsoft")}
        />
      </div>
    </>
  )
}