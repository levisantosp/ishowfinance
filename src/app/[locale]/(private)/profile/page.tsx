import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Image from "next/image"
import { authClient } from "@/lib/auth-client"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import Org from "@/app/components/private/Org"

export default async function Profile() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if(!session) {
    authClient.signOut({
      fetchOptions: {
        headers: {
          auth: process.env.AUTH
        },
        onSuccess() {
          redirect("/login")
        }
      }
    })

    return null
  }

  const t = await getTranslations()

  return (
    <>
      <div>
        <h1
          className="text-center p-10 font-bold text-3xl md:text-4xl"
        >
          {t("pages.profile.title")}
        </h1>
      </div>

      <div
        className="flex justify-center"
      >
        <div
          className="border border-gray-500 rounded-2xl p-10"
        >
          <div
            className="flex items-center gap-5"
          >
            <Image
              src={session.user.image as string}
              height={100}
              width={100}
              alt="user profile icon"
              className="rounded-full border-2 border-[#eed492]"
            />

            <div
              className="flex flex-col"
            >
              <span
                className="font-medium text-xl"
              >
                {session.user.name}
              </span>

              <span
                className="text-gray-400 font-medium"
              >
                {t("pages.profile.welcome")}
              </span>
            </div>
          </div>

          <h2
            className="font-semibold text-2xl pt-10 text-center"
          >
            {t("pages.profile.organizations")}
          </h2>

          <Org
            userId={session.user.id}
          />
        </div>
      </div>
    </>
  )
}