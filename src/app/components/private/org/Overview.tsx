'use client'

import { Prisma } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import * as Lucide from 'lucide-react'
import { Transition } from '@headlessui/react'
import Link from 'next/link'
import Loading from '@components/global/Loading'

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
  isAdmin: boolean
}

export default function Overview({ id, locale, isAdmin }: Props) {
  const [org, setOrg] = useState<Org | null>()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const findOrg = async() => {
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
                  transactions: true
                }
              }
            }
          })
        }
      })).json()

      setOrg(organization)
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
            <Loading height={10} width={10} />
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
                className='relative inline-block cursor-pointer'
              >
                <Lucide.Logs
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
                    {isAdmin && (
                      <div
                        className='
                        cursor-pointer
                        transition duration-300 hover:bg-[#444444]
                        rounded-2xl px-4 py-2
                        '
                        onClick={() => isOpen ? setIsOpen(false) : setIsOpen(true)}
                      >
                        <Link
                          href={`/${locale}/org/${id}/edit`}
                          className='flex gap-2'
                        >
                          <Lucide.Pencil color='#99a1af' />

                          <span>
                            {t('pages.org.menu.edit')}
                          </span>
                        </Link>
                      </div>
                    )}

                    <div
                      className='
                      cursor-pointer
                      transition duration-300 hover:bg-[#444444]
                      rounded-2xl px-4 py-2
                      '
                      onClick={() => isOpen ? setIsOpen(false) : setIsOpen(true)}
                    >
                      <Link
                        href={`/${locale}/org/${id}/categories`}
                        className='flex gap-2'
                      >
                        <Lucide.ChartBarStacked color='#99a1af' />

                        <span>
                          {t('pages.org.menu.categories')}
                        </span>
                      </Link>
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
                        href={`/${locale}/org/${id}/members`}
                        className='flex gap-2'
                      >
                        <Lucide.User color='#99a1af' />

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
              className='flex justify-between items-center rounded-2xl border border-gray-500 p-7 gap-5'
            >
              <div>
                <h2
                  className='text-xl md:text-2xl font-semibold'
                >
                  {t('pages.org.overview.today_income')}
                </h2>

                <span
                  className='md:text-lg text-gray-400'
                >
                  {
                    (org.categories
                      .map(category => ({
                        ...category,
                        transactions: category.transactions.filter(t => {
                          const today = new Date()
                          const transactionDate = new Date(t.createdAt)

                          return transactionDate.getDate() === today.getDate() &&
                            transactionDate.getMonth() === today.getMonth() &&
                            transactionDate.getFullYear() === today.getFullYear()
                        })
                      }))
                      .reduce((sum, category) => {
                        const total = category.transactions.reduce((csum, transaction) =>
                          csum + Number(transaction.amount), 0
                        )

                        return sum + total
                      }, 0))
                      .toLocaleString(locale, {
                        style: 'currency',
                        currency: org.currency
                      })
                  }
                </span>
              </div>

              <Lucide.BanknoteArrowDown
                className='text-green-400 bg-green-600/30 rounded-xl p-2'
                size={60}
              />
            </div>

            <div
              className='flex justify-between items-center rounded-2xl border border-gray-500 p-7 gap-5'
            >
              <div>
                <h2
                  className='text-xl md:text-2xl font-semibold'
                >
                  {t('pages.org.overview.week_income')}
                </h2>

                <span
                  className='md:text-lg text-gray-400'
                >
                  {
                    (org.categories
                      .map(category => ({
                        ...category,
                        transactions: category.transactions.filter(t => {
                          const today = new Date()
                          const startOfWeek = new Date()

                          startOfWeek.setDate(today.getDate() - today.getDay())
                          startOfWeek.setHours(0, 0, 0, 0)

                          return new Date(t.createdAt) >= startOfWeek
                        })
                      }))
                      .reduce((sum, category) => {
                        const total = category.transactions.reduce((csum, transaction) =>
                          csum + Number(transaction.amount), 0
                        )

                        return sum + total
                      }, 0))
                      .toLocaleString(locale, {
                        style: 'currency',
                        currency: org.currency
                      })
                  }
                </span>
              </div>

              <Lucide.BanknoteArrowDown
                className='text-blue-400 bg-blue-600/30 rounded-xl p-2'
                size={60}
              />
            </div>

            <div
              className='flex justify-between items-center rounded-2xl border border-gray-500 p-7 gap-5'
            >
              <div>
                <h2
                  className='text-xl md:text-2xl font-semibold'
                >
                  {t('pages.org.overview.month_income')}
                </h2>

                <span
                  className='md:text-lg text-gray-400'
                >
                  {
                    (org.categories
                      .map(category => ({
                        ...category,
                        transactions: category.transactions.filter(t => {
                          const today = new Date()
                          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

                          return new Date(t.createdAt) >= startOfMonth
                        })
                      }))
                      .reduce((sum, category) => {
                        const total = category.transactions.reduce((csum, transaction) =>
                          csum + Number(transaction.amount), 0
                        )

                        return sum + total
                      }, 0))
                      .toLocaleString(locale, {
                        style: 'currency',
                        currency: org.currency
                      })
                  }
                </span>
              </div>

              <Lucide.BanknoteArrowDown
                className='text-purple-400 bg-purple-600/30 rounded-xl p-2'
                size={60}
              />
            </div>
          </div>
        </>
      )
      }
    </>
  )
}