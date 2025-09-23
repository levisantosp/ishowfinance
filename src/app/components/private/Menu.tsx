"use client"

import { Transition } from "@headlessui/react"
import * as Lucide from "lucide-react"
import { useState } from "react"
import LanguageMenu from "./LanguageMenu.tsx"

type Props = {
  // messages: {}
}

export default function Menu({}: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div
        onClick={() => isOpen ? setIsOpen(false) : setIsOpen(true)}
        className="relative inline-block"
      >
        <Lucide.Menu
          className="rounded-lg border border-gray-500 p-1"
          size={30}
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
            className="
            flex flex-col border border-gray-500
            absolute top-12 right-0 w-90 z-20
            rounded-2xl
            bg-[#171717]
            "
          >
            <div>
              <LanguageMenu />
            </div>
          </div>
        </Transition>
      </div>
    </>
  )
}