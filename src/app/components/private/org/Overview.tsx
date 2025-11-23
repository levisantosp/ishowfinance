// Aqui está o seu componente completo, com o novo gráfico Comparativo Receita x Despesa adicionado e correções para evitar erros de parsing e tipos.
// Mantive a formatação e estilo gerais do seu arquivo.

'use client'

import { Prisma } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import * as Lucide from 'lucide-react'
import { Transition } from '@headlessui/react'
import Link from 'next/link'
import Loading from '@components/global/Loading'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell, Legend // Adicionado aqui
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

  // Cores para o gráfico de Pizza
  const PIE_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6']

  // Dados estáticos de exemplo para os gráficos (substitua pelos reais se quiser)
  const lineData = [
    { day: '01', balance: 1200 },
    { day: '02', balance: 1500 },
    { day: '03', balance: 980 },
    { day: '04', balance: 2100 },
    { day: '05', balance: 1800 },
    { day: '06', balance: 2500 },
    { day: '07', balance: 3000 }
  ]

  const monthlyProfit = [
    { name: 'Jan', value: 4500 },
    { name: 'Fev', value: 3200 },
    { name: 'Mar', value: 5800 },
    { name: 'Abr', value: 4100 },
    { name: 'Mai', value: 6400 },
    { name: 'Jun', value: 7200 }
  ]

  const pieData = [
    { name: 'Salários', value: 12500 },
    { name: 'Fornecedores', value: 8400 },
    { name: 'Vendas', value: 4100 },
    { name: 'Outros', value: 2000 }
  ]

  // Novo conjunto de dados para o gráfico Comparativo Receita x Despesa (barras duplas)
  const revenueExpenseData = [
    { month: 'Jan', revenue: 8000, expense: 4200 },
    { month: 'Fev', revenue: 7200, expense: 4000 },
    { month: 'Mar', revenue: 9600, expense: 3800 },
    { month: 'Abr', revenue: 8500, expense: 4400 },
    { month: 'Mai', revenue: 10200, expense: 4800 },
    { month: 'Jun', revenue: 11500, expense: 4300 }
  ]

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

                          return new Date(t.createdAt) >= startOfWeek && t.type === 'INCOME'
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

                          return new Date(t.createdAt) >= startOfMonth && t.type === 'INCOME'
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

          {/* Conteúdo dos Gráficos */}
          <div className='flex flex-col gap-5 px-5 md:px-0 md:max-w-7xl md:mx-auto pb-10'>

            <div
              className='w-full md:mt-0 mt-5 rounded-2xl border border-gray-500 p-5'
            >
              <h2 className='text-xl md:text-2xl font-semibold mb-4'>
                Evolução do Saldo Diário
              </h2>

              <ResponsiveContainer width='100%' height={300}>
                <LineChart
                  data={lineData}
                >
                  <CartesianGrid strokeDasharray='3 3' stroke='#444' />
                  <XAxis dataKey='day' stroke='#aaa' />
                  <YAxis stroke='#aaa' />
                  <Tooltip />
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
                Lucro Líquido Mensal
              </h2>

              <ResponsiveContainer width='100%' height={300}>
                <BarChart
                  data={monthlyProfit}
                >
                  <CartesianGrid strokeDasharray='3 3' stroke='#444' />
                  <XAxis dataKey='name' stroke='#aaa' />
                  <YAxis stroke='#aaa' />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }} 
                  />
                  <Bar
                    dataKey='value'
                    fill='#c084fc'
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Novo Gráfico: Despesas por Categoria (Pizza) */}
            <div
              className='w-full rounded-2xl border border-gray-500 p-5'
            >
              <h2 className='text-xl md:text-2xl font-semibold mb-4'>
                Despesas por Categoria
              </h2>

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
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="middle" align="right" layout="vertical" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico Adicionado: Comparativo Receita x Despesa (Barras Duplas) */}
            <div
              className='w-full rounded-2xl border border-gray-500 p-5'
            >
              <h2 className='text-xl md:text-2xl font-semibold mb-4'>
                Comparativo Receita x Despesa
              </h2>

              <ResponsiveContainer width='100%' height={350}>
                <BarChart
                  data={revenueExpenseData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' stroke='#444' />
                  <XAxis dataKey='month' stroke='#aaa' />
                  <YAxis stroke='#aaa' />
                  <Tooltip formatter={(value: number) => value.toLocaleString(locale, { style: 'currency', currency: org.currency })} />
                  <Legend />
                  <Bar dataKey='revenue' name={t('pages.org.charts.revenue') || 'Receita'} fill='#34d399' radius={[4, 4, 0, 0]} />
                  <Bar dataKey='expense' name={t('pages.org.charts.expense') || 'Despesa'} fill='#f87171' radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </>
      )}
    </>
  )
}
