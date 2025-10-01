'use client'

import { Prisma } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import * as Lucide from 'lucide-react'
import { Transition } from '@headlessui/react'
import Link from 'next/link'

type Org = Prisma.OrganizationGetPayload<{
  include: {
    categories: {
      include: {
        transactions: true
      }
    }
  }
}>

type Props = {
  id: string
  locale: string
}

export default function Overview({ id, locale }: Props) {
  const [org, setOrg] = useState<Org | null>()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const findOrg = async() => {
      const date = new Date()

      date.setDate(date.getDate() - 30)

      const { organization }: {
        organization: Omit<Org, 'balance'> & {
          balance: string
        } | null
      } = await (await fetch('/api/org', {
        headers: {
          auth: process.env.NEXT_PUBLIC_AUTH,
          find: 'unique',
          queryOptions: JSON.stringify({
            where: { id },
            include: {
              categories: {
                include: {
                  transactions: {
                    where: {
                      createdAt: {
                        gte: date
                      }
                    }
                  }
                }
              }
            }
          })
        }
      })).json()

      setOrg(
        !organization ? null :
          {
            ...organization,
            balance: BigInt(organization.balance)
          }
      )
    }

    findOrg()
  }, [])

  if(org === null) {
    notFound()
  }

  const t = useTranslations()

  return (
    <>
      {org === undefined && (
        <div
          className='flex justify-center p-10'
        >
          <div
            className='flex items-center rounded-2xl p-5 gap-2'
          >
            <div
              className='w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin'
            />
          </div>
        </div>
      )}

      {org && (
        <>
          <div
            className='flex justify-center items-center p-10'
          >
            <h2
              className='text-center text-3xl md:text-4xl font-bold'
            >
              {org.name}
            </h2>
            <div
              className='absolute top-20 right-5 md:right-10 md:top-auto max-md:top-20'
            >
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
                    absolute top-12 right-0 w-50 z-20
                    rounded-2xl
                  bg-[#171717]
                    '
                  >
                    <div
                      className='
                      cursor-pointer
                      transition duration-300 hover:bg-[#444444]
                      rounded-2xl px-4 py-2
                      '
                      onClick={() => isOpen ? setIsOpen(false) : setIsOpen(true)}
                    >
                      <Link
                        href={`/${locale}/org/${id}/members`}
                        className='flex gap-2'
                      >
                        <Lucide.User />

                        <span>
                          {t('pages.org.menu.members')}
                        </span>
                      </Link>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>

          <div
            className='flex flex-col md:flex-row justify-center gap-5 px-5 md:px-0'
          >
            <div
              className='rounded-2xl border border-gray-500 p-10'
            >
              <h2
                className='text-xl md:text-2xl font-semibold'
              >
                {t('pages.org.overview.balance')}
              </h2>

              <span
                className='md:text-lg text-gray-400'
              >
                {
                  (Number(org.balance) / 100)
                    .toLocaleString(
                      locale,
                      {
                        style: 'currency',
                        currency: org.currency
                      }
                    )
                }
              </span>
            </div>

            <div
              className='rounded-2xl border border-gray-500 p-10'
            >
              <h2
                className='text-xl md:text-2xl font-semibold'
              >
                {t('pages.org.overview.summary.title')}
              </h2>

              <span
                className='md:text-lg text-gray-400'
              >
                {t.rich('pages.org.overview.summary.description', {
                  income: org.categories.reduce((total, category) => {
                    const ctotal = category.transactions.filter(t => t.type === 'INCOME')
                      .reduce((total, transaction) =>
                        total + Number(transaction.amount), 0
                      )

                    return ctotal + total
                  }, 0).toLocaleString(
                    locale,
                    {
                      style: 'currency',
                      currency: org.currency
                    }
                  ),
                  expense: org.categories.reduce((total, category) => {
                    const ctotal = category.transactions.filter(t => t.type === 'EXPENSE')
                      .reduce((total, transaction) =>
                        total + Number(transaction.amount), 0
                      )

                    return ctotal + total
                  }, 0).toLocaleString(
                    locale,
                    {
                      style: 'currency',
                      currency: org.currency
                    }
                  )
                })}
              </span>
            </div>
          </div>
        </>
      )
      }
    </>
  )
}