'use client'

import { Prisma } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import Loading from '@components/global/Loading'
import { RiErrorWarningLine } from 'react-icons/ri'
import { notFound } from 'next/navigation'
import { useRouter } from '@i18n/navigation'
import { PackagePlus, Pencil, Trash, Undo2 } from 'lucide-react'
import Link from 'next/link'

type Props = {
  id: string
  name: string
  locale: string
}

type Org = Prisma.OrganizationGetPayload<{
  include: {
    categories: {
      include: {
        transactions: true
      }
    }
  }
}>

export default function CategoriesOverview(props: Props) {
  const [org, setOrg] = useState<Org | null>()
  const [isOpen, setIsOpen] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [category, setCategory] = useState<string>()

  useEffect(() => {
    findOrg()
  }, [])

  const findOrg = async() => {
    const { organization }: {
      organization: Org | null
    } = await (await fetch('/api/org', {
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
    })).json()

    setOrg(organization)
  }

  if(org === null) {
    notFound()
  }

  const t = useTranslations()

  const router = useRouter()

  const handleDeleteCategory = async() => {
    if(!category) return

    setIsDisabled(true)
    setIsLoading(true)

    const res = await fetch('/api/category', {
      method: 'DELETE',
      headers: {
        auth: process.env.NEXT_PUBLIC_AUTH
      },
      body: JSON.stringify({ id: category })
    })

    if(!res.ok) return

    setOrg(currentOrg => {
      if(!currentOrg) return null

      const categories = currentOrg.categories.filter(c =>
        c.id !== category
      )

      return { ...currentOrg, categories }
    })

    setIsOpen(false)
    setCategory(undefined)
    setIsLoading(false)
    setIsDisabled(false)
  }

  return (
    <>
      {isOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/60'
        >
          <div
            className='
            w-90 md:w-120
            h-65 md:h-55
            flex items-center
            absolute left-1/2 -translate-x-1/2 translate-y-1/2 rounded-2xl border border-gray-500
            bg-[#171717]
            '
          >
            <div
              className='flex flex-col justify-center items-center gap-5 p-5'
            >
              <span
                style={
                  {
                    whiteSpace: 'pre-line'
                  }
                }
              >
                {t('pages.org.categories.confirm')}
              </span>

              <button
                type='submit'
                className='
              flex w-full rounded-2xl bg-red-500 py-2
              justify-center items-center text-center
              transition duration-300 hover:bg-red-400
              disabled:bg-red-500 disabled:cursor-not-allowed disabled:text-gray-300
              cursor-pointer
              '
                disabled={isDisabled}
                onClick={handleDeleteCategory}
              >
                {loading ? (
                  <Loading width={5} height={5} />
                ) : (
                  <>
                    {t('pages.org.categories.delete')}
                  </>
                )
                }
              </button>

              <button
                type='submit'
                className='
              flex w-full rounded-2xl bg-green-500 py-2
              justify-center items-center text-center
              transition duration-300 hover:bg-green-400
              disabled:bg-green-500 disabled:cursor-not-allowed disabled:text-gray-300
              cursor-pointer
              '
                disabled={isDisabled}
                onClick={() => {
                  setIsOpen(false)
                  setCategory(undefined)
                }}
              >
                {t('pages.org.categories.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
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
          className='text-3xl md:text-4xl font-bold'
        >
          {t('pages.org.categories.title')}
        </h1>

        <div
          className='md:top-35 max-md:top-38'
        >
          <Link
            href={`/org/${props.id}/categories/create`}
            className='flex gap-1 bg-green-600 p-1 rounded-xl transition hover:bg-green-500 duration-300'
          >
            <PackagePlus className='hidden md:block' />
            <PackagePlus className='block md:hidden' size={20} />
            
            <span
              className='text-sm md:text-base'
            >
              {t('pages.org.categories.create_button')}
            </span>
          </Link>
        </div>
      </div>

      {org === undefined && (
        <Loading width={10} height={10}/>
      )}

      {org?.categories.length === 0 && (
        <div
          className='flex justify-center items-center gap-1'
        >
          <RiErrorWarningLine color='#f87171' size={20} />

          <span
            className='text-[#f87171]'
          >
            {t.rich('pages.org.categories.no_category', {
              org: props.name
            })}
          </span>
        </div>
      )}
      
      <div
        className='flex flex-col items-center gap-10'
      >
        {org?.categories.length ?
          org.categories.map((c, i) => (
            <div
              className='flex justify-center gap-10'
              key={i}
            >
              <div
                className='flex justify-between border border-gray-500 rounded-2xl w-[45vh] md:w-[110vh] h-25'
              >
                <div>
                  <h2
                    className='font-semibold text-lg md:text-2xl pt-5 px-5'
                  >
                    <Link
                      href={`/${props.locale}/org/${props.id}/categories/${c.id}`}
                      className='text-blue-400 underline'
                    >
                      {c.name}
                    </Link>
                  </h2>

                  <span
                    className='text-gray-400 text-xs md:text-lg px-5'
                  >
                    {t.rich('pages.org.categories.total', {
                      total: (c.transactions.reduce((sum, t) => sum + Number(t.amount), 0))
                        .toLocaleString(props.locale, {
                          style: 'currency',
                          currency: org.currency
                        })
                    })}
                  </span>
                </div>

                <div
                  className='flex gap-2 p-5 items-center'
                >
                  <Link
                    href={`/${props.locale}/org/${props.id}/categories/${c.id}/edit`}
                  >
                    <Pencil
                      size={15}
                      className='cursor-pointer'
                    />
                  </Link>

                  <Trash
                    size={15}
                    className='text-red-400 cursor-pointer'
                    onClick={() => {
                      if(isOpen) {
                        setIsOpen(false)
                      }

                      else {
                        setIsOpen(true)
                      }
                      setCategory(c.id)
                    }}
                  />
                </div>
              </div>
            </div>
          )) :
          null
        }
      </div>
    </>
  )
}