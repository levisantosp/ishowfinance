'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Prisma, type Transaction } from '@generated'
import { notFound } from 'next/navigation'
import { useRouter } from '@i18n/navigation'
import { Pencil, Trash, Undo2 } from 'lucide-react'
import Loading from '@components/global/Loading'
import { RiErrorWarningLine } from 'react-icons/ri'
import { toast } from 'sonner'

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

const transactionTypes = ['REVENUE', 'EXPENSE'] as const

export default function TransactionsComponent(props: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [org, setOrg] = useState<Org | null>()
  const [transactions, setTransactions] = useState<Transaction[]>()

  const findOrg = async() => {
    const res = await fetch('/api/org', {
      headers: {
        auth: process.env.NEXT_PUBLIC_AUTH,
        find: 'unique',
        queryOptions: JSON.stringify({
          where: {
            id: props.id
          },
          include: {
            categories: {
              include: {
                transactions: true
              }
            }
          }
        })
      }
    })

    if(!res.ok) {
      notFound()
    }

    const { organization }: {
      organization: Org | null
    } = await res.json()

    setOrg(organization)
    
    if(!organization?.categories.length) return

    const transactions: Transaction[] = []

    for(const category of organization.categories) {
      transactions.push(...category.transactions)
    }

    setTransactions(
      transactions.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    )
  }

  useEffect(() => {
    findOrg()
  }, [])

  if(org === null) {
    notFound()
  }

  const t = useTranslations()
  const router = useRouter()

  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false)
  const [isDeleteMenuOpen, setIsDeleteMenuOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [type, setType] = useState('')

  const isDisabled = isLoading || (
    !title.length
    && !description.length
    && !date.length
    && !amount.length
    && !categoryId.length
    && !type.length
  )

  const handlePencilClick = async(id: string) => {
    setIsEditMenuOpen(true)
    setTransactionId(id)
  }

  const handleTrashClick = async(id: string) => {
    setIsDeleteMenuOpen(true)
    setTransactionId(id)
  }

  const handleTransactionCancel = async() => {
    setIsDeleteMenuOpen(false)
    setIsEditMenuOpen(false)
    setTitle('')
    setDescription('')
    setAmount('')
    setDate('')
    setIsLoading(false)
    setTransactionId('')
  }

  const formatCurrency = (value: string | undefined) => {
    if(!value?.length || value === '0') return ''

    const amount = (Number(value) / 100).toFixed(2)

    return new Intl.NumberFormat(props.locale, {
      style: 'currency',
      currency: org?.currency
    }).format(Number(amount))
  }

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = event.target.value.replace(/\D/g, '')
    const amount = parseInt(numericValue || '0', 10)

    setAmount(amount.toString())
  }

  const handleTransactionSubmit = async() => {
    setIsLoading(true)

    const res = await fetch('/api/transaction', {
      method: 'PUT',
      headers: {
        auth: process.env.NEXT_PUBLIC_AUTH
      },
      body: JSON.stringify({
        title: !title.length
          ? undefined
          : title,
        description: !description.length
          ? undefined
          : description,
        date: !date
          ? undefined
          : new Date(date).toISOString(),
        amount: !amount.length
          ? undefined
          : amount,
        categoryId: !categoryId.length
          ? undefined
          : categoryId,
        type: !type.length
          ? undefined
          : type,
        transaction: transactionId
      })
    })

    if(!res.ok) {
      setIsLoading(false)
      
      return toast.error(t('utils.error'), {
        description: res.statusText
      })
    }

    setIsEditMenuOpen(false)
    setTitle('')
    setDescription('')
    setAmount('')
    setDate('')
    setIsLoading(false)
    setTransactionId('')

    toast.success(t('pages.org.category.transaction.edited'))

    findOrg()
  }

  const handleTransactionDelete = async() => {
    setIsLoading(true)

    const res = await fetch('/api/transaction', {
      method: 'DELETE',
      headers: {
        auth: process.env.NEXT_PUBLIC_AUTH
      },
      body: JSON.stringify({ transactionId })
    })

    if(!res.ok) {
      setIsLoading(false)
      
      return toast.error(t('utils.error'), {
        description: res.statusText
      })
    }

    setIsDeleteMenuOpen(false)
    setTitle('')
    setDescription('')
    setAmount('')
    setDate('')
    setIsLoading(false)
    setTransactionId('')

    toast.success(t('pages.org.category.transaction.deleted'))

    findOrg()
  }

  return (
    <>
      <div
        className='flex flex-col gap-10 justify-center items-center pt-10 pb-5'
      >
        <div
          className='absolute left-10 cursor-pointer transition'
          onClick={() => router.push(`/org/${props.id}/overview`)}
        >
          <Undo2
            className='rounded-lg border border-gray-500 p-1 transition duration-300 hover:bg-[#444444]'
            size={30}
          />
        </div>

        <h1
          className='text-center text-3xl md:text-4xl font-bold p-10'
        >
          {t('pages.org.transactions.title')}
        </h1>
      </div>

      {org === undefined && (
        <Loading width={10} height={10} />
      )}

      {
        (
          org
          && (
            !org?.categories.length
            || !org.categories.some(c => c.transactions.length)
          )
        )
        && (
          <div
            className='flex justify-center items-center gap-1'
          >
            <RiErrorWarningLine color='#f87171' size={20} />

            <span
              className='text-[#f87171]'
            >
              {t.rich('pages.org.transactions.no_transaction', {
                org: org.name
              })}
            </span>
          </div>
        )
      }

      {isDeleteMenuOpen && (
        <>
          <div
            className='fixed inset-0 z-40 bg-black/60 flex items-center justify-center'
          >
            <div
              className='
                flex flex-col items-center
                rounded-2xl border border-gray-500
              bg-[#171717]
            '
            >
              <div
                className='flex flex-col justify-center items-center gap-5 py-10 px-20'
              >
                <h3
                  style={
                    {
                      whiteSpace: 'pre-line'
                    }
                  }
                  className='text-center text-xl md:text-2xl font-bold'
                >
                  {t('pages.org.category.transaction.delete_transaction')}
                </h3>

                <button
                  type='submit'
                  className='
                  flex w-full rounded-2xl bg-green-700 py-2
                  justify-center items-center text-center mt-5
                  transition duration-300 hover:bg-green-600
                  cursor-pointer
                '
                  disabled={isLoading}
                  onClick={handleTransactionCancel}
                >
                  {t('pages.org.category.transaction.cancel')}
                </button>

                <button
                  type='button'
                  className='
                  flex w-full rounded-2xl bg-red-500 py-2
                  justify-center items-center text-center mt-5
                  transition duration-300 hover:bg-red-400
                  disabled:bg-red-900 disabled:cursor-not-allowed disabled:text-gray-300
                  cursor-pointer
                '
                  onClick={handleTransactionDelete}
                >
                  {
                    isLoading
                      ? (
                        <Loading width={5} height={5} />
                      )
                      : t('pages.org.category.transaction.delete')
                  }
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {isEditMenuOpen && (
        <>
          <div
            className='fixed inset-0 z-40 bg-black/60 flex items-center justify-center'
          >
            <div
              className='
              flex flex-col items-center
              rounded-2xl border border-gray-500
              bg-[#171717]
            '
            >
              <div
                className='flex flex-col justify-center items-center gap-5 py-10 px-20'
              >
                <h3
                  style={
                    {
                      whiteSpace: 'pre-line'
                    }
                  }
                  className='text-center text-xl md:text-2xl font-bold'
                >
                  {t('pages.org.transaction.create.title')}
                </h3>

                <form
                  className='flex flex-col gap-5 relative max-w-md md:w-full'
                  onSubmit={handleTransactionSubmit}
                >
                  <input
                    type='text'
                    placeholder={t('pages.org.transaction.create.transaction_title')}
                    className='w-full rounded-2xl border border-gray-500 pl-4 py-2'
                    name='title'
                    value={title}
                    onChange={(input) => setTitle(input.target.value)}
                    autoComplete='off'
                  />

                  <textarea
                    placeholder={t('pages.org.transaction.create.transaction_description')}
                    className='
                    w-full rounded-2xl border border-gray-500 pl-4 py-4
                    h-40
                  '
                    name='description'
                    value={description}
                    onChange={(input) => setDescription(input.target.value)}
                    autoComplete='off'
                  />

                  <input
                    type='text'
                    placeholder={t('pages.org.transaction.create.transaction_amount')}
                    className='w-full rounded-2xl border border-gray-500 pl-4 py-2 px-30'
                    name='value'
                    value={formatCurrency(amount || '0')}
                    onChange={handleAmountChange}
                    autoComplete='off'
                  />

                  <select
                    name='category'
                    value={categoryId}
                    onChange={(input) => setCategoryId(input.target.value)}
                    className='w-full rounded-2xl border border-gray-500 pl-4 py-2'
                  >
                    {
                      org?.categories.map(c => (
                        <option
                          key={c.id}
                          value={c.id}
                          className='rounded-2xl bg-[#171717]'
                        >
                          {c.name}
                        </option>
                      ))
                    }
                  </select>

                  <select
                    name='type'
                    value={type}
                    onChange={(input) => setType(input.target.value)}
                    className='w-full rounded-2xl border border-gray-500 pl-4 py-2'
                  >
                    {
                      transactionTypes.map(c => (
                        <option
                          key={c}
                          value={c}
                          className='rounded-2xl bg-[#171717]'
                        >
                          {t(`pages.org.transaction.create.type.${c}`)}
                        </option>
                      ))
                    }
                  </select>

                  <input
                    type='datetime-local'
                    placeholder={t('pages.org.transaction.create.transaction_date')}
                    className='w-full rounded-2xl border border-gray-500 pl-4 py-2'
                    name='date'
                    value={date}
                    onChange={(input) => setDate(input.target.value)}
                    autoComplete='off'
                  />
                </form>

                <button
                  type='submit'
                  className='
                  flex w-full rounded-2xl bg-green-700 py-2
                  justify-center items-center text-center mt-5
                  transition duration-300 hover:bg-green-600
                disabled:bg-green-900 disabled:cursor-not-allowed disabled:text-gray-300
                  cursor-pointer
                '
                  disabled={isDisabled}
                  onClick={handleTransactionSubmit}
                >
                  {
                    isLoading ? (
                      <Loading width={5} height={5} />
                    )
                      : t('pages.org.category.transaction.submit')
                  }
                </button>

                <button
                  type='button'
                  className='
                  flex w-full rounded-2xl bg-red-500 py-2
                  justify-center items-center text-center mt-5
                  transition duration-300 hover:bg-red-400
                  cursor-pointer
                '
                  onClick={handleTransactionCancel}
                >
                  {t('pages.org.category.transaction.cancel')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {(transactions && transactions.length > 0) && (
        <div
          className='flex flex-col items-center gap-10'
        >
          {transactions.map(transaction => (
            <div
              className='w-full max-w-xl md:max-w-2xl'
              key={transaction.id}
            >
              <div
                className='
                flex justify-between items-start
                border border-gray-500 rounded-2xl w-full max-w-4xl p-4 md:p-6
              '
              >
                <div
                  className='flex flex-col gap-4 justify-center w-full'
                >
                  <div>
                    <h3
                      className='font-semibold text-lg md:text-2xl'
                    >
                      {transaction.title}
                    </h3>

                    {
                      transaction.description
                        ? (
                          <span
                            className='text-gray-400 text-xs md:text-lg'
                            style={
                              {
                                whiteSpace: 'pre-line'
                              }
                            }
                          >
                            {transaction.description}
                          </span>
                        )
                        : null
                    }
                  </div>

                  <span
                    className='text-gray-400 font-semibold text-xs md:text-lg'
                  >
                    {t.rich('pages.org.category.transaction.amount', {
                      amount: (Number(transaction.amount) / 100).toLocaleString(props.locale, {
                        style: 'currency',
                        currency: org?.currency
                      })
                    })}
                  </span>
                </div>

                <div
                  className='flex gap-2 items-center shrink-0 ml-4'
                >
                  <Pencil
                    size={15}
                    className='cursor-pointer'
                    onClick={() => handlePencilClick(transaction.id)}
                  />

                  <Trash
                    size={15}
                    className='text-red-400 cursor-pointer'
                    onClick={() => handleTrashClick(transaction.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}