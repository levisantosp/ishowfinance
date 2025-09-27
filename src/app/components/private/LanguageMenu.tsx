"use client"

import { usePathname, useRouter } from "next/navigation"
import { locales } from "../../../config.ts"
import { Transition } from "@headlessui/react"

type Props = {
  isOpen: boolean
}

export default function LanguageMenu({ isOpen }: Props) {
  const router = useRouter()
  const path = usePathname()

  const changeLanguage = (lang: typeof locales[number]) => {
    const reg = new RegExp(`^/(${locales.join("|")})`)
    
    router.push(`/${lang}${path.replace(reg, "")}`)
  }

  return (
    <>
      <div
        className="relative inline-block"
      >
        <Transition
          show={isOpen}
          enter="transition-opacity duration-500 ease-out"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition-opacity duration-250 ease-in"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <div
            className="flex flex-col gap-1 absolute top-0 right-49 rounded-2xl border border-gray-500 w-40 z-20 bg-[#171717]"
          >
            <div
              className="cursor-pointer hover:bg-[#444444] rounded-2xl transition px-4 py-2"
              onClick={() => changeLanguage("pt-BR")}
            >
              <span>Português</span>
            </div>
            <div
              className="cursor-pointer  hover:bg-[#444444] rounded-2xl transition px-4 py-2"
              onClick={() => changeLanguage("en-US")}
            >
              <span>English</span>
            </div>
          </div>
        </Transition>
      </div>
    </>
  )
}