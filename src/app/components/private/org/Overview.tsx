'use client'

import { Prisma } from '@generated'
import { useTranslations } from 'next-intl'
import { useEffect, useState, useMemo } from 'react'
import { notFound } from 'next/navigation'
import * as Lucide from 'lucide-react'
import { Transition } from '@headlessui/react'
import Link from 'next/link'
import Loading from '@components/global/Loading'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell, Legend
} from 'recharts'

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
          auth: process.env.NEXT_PUBLIC_AUTH!,
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
  }, [id])

  if(org === null) {
    notFound()
  }

  const t = useTranslations()

  const allTransactions = useMemo(() => {
    if(!org) return []
    return org.categories.flatMap(cat =>
      cat.transactions.map(tr => ({
        ...tr,
        amount: Number(tr.amount) / 100,
        date: new Date(tr.createdAt),
        categoryName: cat.name
      }))
    )
  }, [org])

  const lineData = useMemo(() => {
    if(!org) return []
    const days = []
    const today = new Date()

    for(let i = 6;i >= 0;i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const dayStr = d.getDate().toString().padStart(2, '0')

      const dailyTotal = allTransactions
        .filter(t =>
          t.date.getDate() === d.getDate() &&
          t.date.getMonth() === d.getMonth() &&
          t.date.getFullYear() === d.getFullYear()
        )
        .reduce((acc, curr) => {
          return curr.type === 'INCOME' ? acc + curr.amount : acc - curr.amount
        }, 0)

      days.push({ day: dayStr, balance: dailyTotal })
    }
    return days
  }, [allTransactions, org])

  const { monthlyProfit, revenueExpenseData } = useMemo(() => {
    const profitData = []
    const comparisonData = []
    const today = new Date()

    for(let i = 5;i >= 0;i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthName = d.toLocaleString(locale, { month: 'short' })

      const transactionsInMonth = allTransactions.filter(t =>
        t.date.getMonth() === d.getMonth() &&
        t.date.getFullYear() === d.getFullYear()
      )

      const income = transactionsInMonth
        .filter(t => t.type === 'INCOME')
        .reduce((acc, t) => acc + t.amount, 0)

      const expense = transactionsInMonth
        .filter(t => t.type === 'EXPENSE')
        .reduce((acc, t) => acc + t.amount, 0)

      profitData.push({ name: monthName, value: income - expense })
      comparisonData.push({ month: monthName, revenue: income, expense: expense })
    }

    return { monthlyProfit: profitData, revenueExpenseData: comparisonData }
  }, [allTransactions, locale])

  const pieData = useMemo(() => {
    const expensesByCategory: Record<string, number> = {}

    allTransactions
      .filter(t => t.type === 'EXPENSE')
      .forEach(t => {
        if(!expensesByCategory[t.categoryName]) {
          expensesByCategory[t.categoryName] = 0
        }
        expensesByCategory[t.categoryName] += t.amount
      })

    return Object.entries(expensesByCategory).map(([name, value]) => {
      const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
      return {
        name,
        value,
        fill: randomColor
      }
    })
  }, [allTransactions])

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
                <Lucide.Ellipsis
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
                        <Lucide.CircleDollarSign color='#99a1af' />

                        <span>
                          {t('pages.org.menu.create_transaction')}
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
                  {t('pages.org.overview.daily_income')}
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
                            transactionDate.getFullYear() === today.getFullYear() &&
                            t.type === 'INCOME'
                        })
                      }))
                      .reduce((sum, category) => {
                        const total = category.transactions.reduce((csum, transaction) =>
                          csum + Number(transaction.amount), 0
                        )

                        return sum + (total / 100)
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

                          return new Date(t.createdAt) >= startOfWeek && t.type === 'INCOME'
                        })
                      }))
                      .reduce((sum, category) => {
                        const total = category.transactions.reduce((csum, transaction) =>
                          csum + Number(transaction.amount), 0
                        )

                        return sum + (total / 100)
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

                          return new Date(t.createdAt) >= startOfMonth && t.type === 'INCOME'
                        })
                      }))
                      .reduce((sum, category) => {
                        const total = category.transactions.reduce((csum, transaction) =>
                          csum + Number(transaction.amount), 0
                        )

                        return sum + (total / 100)
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

          <div className='flex flex-col gap-5 px-5 md:px-0 md:max-w-7xl md:mx-auto pb-10 pt-10'>

            <div
              className='w-full md:mt-0 mt-5 rounded-2xl border border-gray-500 p-5'
            >
              <h2 className='text-xl md:text-2xl font-semibold mb-4'>
                {t('pages.org.overview.evolution')}
              </h2>

              <ResponsiveContainer width='100%' height={300}>
                <LineChart
                  data={lineData}
                >
                  <CartesianGrid strokeDasharray='3 3' stroke='#444' />
                  <XAxis dataKey='day' stroke='#aaa' />
                  <YAxis stroke='#aaa' />
                  <Tooltip
                    formatter={(value: number) => value.toLocaleString(locale, { style: 'currency', currency: org.currency })}
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                  />
                  <Line
                    type='monotone'
                    dataKey='balance'
                    stroke='#10b981'
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div
              className='w-full rounded-2xl border border-gray-500 p-5'
            >
              <h2 className='text-xl md:text-2xl font-semibold mb-4'>
                {t('pages.org.overview.monthly_net_profit')}
              </h2>

              <ResponsiveContainer width='100%' height={300}>
                <BarChart
                  data={monthlyProfit}
                >
                  <CartesianGrid strokeDasharray='3 3' stroke='#444' />
                  <XAxis dataKey='name' stroke='#aaa' />
                  <YAxis stroke='#aaa' />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                    formatter={(value: number) => value.toLocaleString(locale, { style: 'currency', currency: org.currency })}
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                  />
                  <Bar
                    dataKey='value'
                    fill='#c084fc'
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div
              className='w-full rounded-2xl border border-gray-500 p-5'
            >
              <h2 className='text-xl md:text-2xl font-semibold mb-4'>
                {t('pages.org.overview.expenses_by_category')}
              </h2>
              {pieData.length > 0 ? (
                <ResponsiveContainer width='100%' height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx='50%'
                      cy='50%'
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey='value'
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => value.toLocaleString(locale, { style: 'currency', currency: org.currency })} />
                    <Legend verticalAlign='middle' align='right' layout='vertical' />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className='h-[300px] flex items-center justify-center text-gray-500'>
                  {t('pages.org.overview.no_data')}
                </div>
              )}
            </div>

            <div
              className='w-full rounded-2xl border border-gray-500 p-5'
            >
              <h2 className='text-xl md:text-2xl font-semibold mb-4'>
                {t('pages.org.overview.comparative')}
              </h2>

              <ResponsiveContainer width='100%' height={350}>
                <BarChart
                  data={revenueExpenseData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' stroke='#444' />
                  <XAxis dataKey='month' stroke='#aaa' />
                  <YAxis stroke='#aaa' />
                  <Tooltip
                    formatter={(value: number) => value.toLocaleString(locale, { style: 'currency', currency: org.currency })}
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                  />
                  <Legend />
                  <Bar dataKey='revenue' name={t('pages.org.overview.revenue')} fill='#34d399' radius={[4, 4, 0, 0]} />
                  <Bar dataKey='expense' name={t('pages.org.overview.expense')} fill='#f87171' radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </>
  )
}