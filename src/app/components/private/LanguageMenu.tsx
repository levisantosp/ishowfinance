"use client"

import { Languages, User } from "lucide-react"
import { useTranslations } from "next-intl"

export default function LanguageMenu() {
  const t = useTranslations()

  return (
    <>
      <div
        className="
        flex gap-2 cursor-pointer
        transition duration-300 hover:bg-[#444444]
        rounded-2xl px-4 py-2
        "
      >
        <User />

        <span>
          {t("header.menu.profile")}
        </span>
      </div>
      <div
        className="
        flex gap-2 cursor-pointer
        transition duration-300 hover:bg-[#444444]
        rounded-2xl px-4 py-2
        "
      >
        <Languages />

        <span>
          {t("header.menu.language")}
        </span>
      </div>
    </>
  )
}