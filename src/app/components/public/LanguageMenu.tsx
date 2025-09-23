"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { locales } from "../../../config.ts"
import { Transition } from "@headlessui/react"
import { Languages } from "lucide-react"

export default function LanguageMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter()
  const path = usePathname()

  const changeLanguage = (lang: typeof locales[number]) => {
    const reg = new RegExp(`^/(${locales.join("|")})`)
    
    router.push(`/${lang}${path.replace(reg, "")}`)
  }

  return (
    <>
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="relative inline-block"
      >
        <Languages
          size={40}
        />
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
            className="flex flex-col gap-1 absolute top-12 right-0 rounded-2xl border border-gray-500 w-40 z-20"
          >
            <div
              className="cursor-pointer hover:bg-[#444444] rounded-2xl transition px-4 py-2"
              onClick={() => changeLanguage("br")}
            >
              <span>Português</span>
            </div>
            <div
              className="cursor-pointer  hover:bg-[#444444] rounded-2xl transition px-4 py-2"
              onClick={() => changeLanguage("us")}
            >
              <span>English</span>
            </div>
          </div>
        </Transition>
      </div>
    </>
  )
}