'use client'

import { Transition } from '@headlessui/react'
import * as Lucide from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import LanguageMenu from './LanguageMenu.tsx'
import MobileLanguageMenu from './MobileLanguageMenu.tsx'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false)
  const [languageIsOpen, setLanguageIsOpen] = useState(false)

  const router = useRouter()

  const signOut = () => authClient.signOut({
    fetchOptions: {
      headers: {
        auth: process.env.NEXT_PUBLIC_AUTH
      },
      onSuccess() {
        router.push('/login')
      }
    }
  })

  const t = useTranslations()

  return (
    <>
      <div
        className='relative inline-block'
      >
        <Lucide.Menu
          className='rounded-lg border border-gray-500 p-1'
          size={30}
          onClick={() => isOpen ? setIsOpen(false) : setIsOpen(true)}
        />

        <Transition
          show={isOpen}
          enter='transition-opacity duration-500 ease-out'
          enterFrom='opacity-0 translate-y-2'
          enterTo='opacity-100 translate-y-0'
          leave='transition-opacity duration-250 ease-in'
          leaveFrom='opacity-100 translate-y-0'
          leaveTo='opacity-0 translate-y-2'
        >
          <div
            className='
            flex flex-col border border-gray-500
            absolute top-12 right-0 w-60 z-20
            rounded-2xl
            bg-[#171717]
            '
          >
            <div
              className='
              flex gap-2 cursor-pointer
              transition duration-300 hover:bg-[#444444]
              rounded-2xl px-4 py-2
              '
              onClick={() => languageIsOpen ? setLanguageIsOpen(false) : setLanguageIsOpen(true)}
            >
              <Lucide.Languages />

              <span>
                {t('header.menu.language')}
              </span>

              <div
                className='hidden md:block'
              >
                <LanguageMenu
                  isOpen={languageIsOpen}
                />
              </div>

              <div
                className='block md:hidden'
              >
                <MobileLanguageMenu
                  isOpen={languageIsOpen}
                />
              </div>
            </div>

            <div
              className='
              cursor-pointer
              transition duration-300 hover:bg-[#444444]
              rounded-2xl px-4 py-2
              '
              onClick={() => isOpen ? setIsOpen(false) : setIsOpen(true)}
            >
              <Link
                href='/org/create'
                className='flex gap-2'
              >
                <Lucide.Plus />
                <span>
                  {t('header.menu.create_org')}
                </span>
              </Link>
            </div>

            <div
              className='
              flex gap-2 cursor-pointer
              transition duration-300 hover:bg-[#444444]
              rounded-2xl px-4 py-2
              '
              onClick={() => signOut()}
            >
              <Lucide.LogOut />

              <span>
                {t('header.menu.signout')}
              </span>
            </div>
          </div>
        </Transition>
      </div>
    </>
  )
}