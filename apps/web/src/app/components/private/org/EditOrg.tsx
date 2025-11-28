'use client'

import { Prisma } from '@generated'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import Loading from '../../global/Loading.tsx'
import { notFound } from 'next/navigation'
import { useRouter } from '@i18n/navigation'
import { Copy, KeySquare, RefreshCw } from 'lucide-react'
import { randomBytes } from 'node:crypto'
import { toast } from 'sonner'

type Org = Prisma.OrganizationGetPayload<{}>

type Props = {
  id: string
  locale: string
}

const currencies = [
  'BRL',
  'USD',
  'EUR'
] as const

export function EditOrg(props: Props) {
  const [org, setOrg] = useState<Org | null>()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currency, setCurrency] = useState('')

  const findOrg = async() => {
    const { organization }: {
      organization: Org | null
    } = await (await fetch('/api/org', {
      headers: {
        auth: process.env.NEXT_PUBLIC_AUTH,
        find: 'unique',
        queryOptions: JSON.stringify({
          where: { id: props.id }
        })
      }
    })).json()

    setOrg(organization)

    if(organization) {
      setCurrency(organization.currency)
    }
  }

  useEffect(() => {
    findOrg()
  }, [])

  if(org === null) {
    notFound()
  }

  const t = useTranslations()
  
  const router = useRouter()

  const handleEdit = async(event: React.FormEvent) => {
    event.preventDefault()

    setIsLoading(true)

    const res = await fetch('/api/org', {
      method: 'PATCH',
      headers: {
        auth: process.env.NEXT_PUBLIC_AUTH
      },
      body: JSON.stringify({
        id: props.id,
        name: !name.length ? undefined : name,
        email: !email.length ? undefined : email,
        currency: currency === org?.currency ? undefined : currency
      })
    })

    if(res.ok) {
      const json: { id: string } = await res.json()

      router.push(`/org/${json.id}/overview`)
    }
  }

  const isDisabled = isLoading
    || (
      !email.length 
      && !name.length
      && currency === org?.currency
    )

  const handleGenerateAuthToken = async() => {
    if(!org) {
      return toast.error(t('utils.error'))
    }

    const token = randomBytes(32).toString('hex')

    const res = await fetch('/api/org', {
      method: 'PATCH',
      headers: {
        auth: process.env.NEXT_PUBLIC_AUTH
      },
      body: JSON.stringify({ token, id: org.id })
    })

    if(!res.ok) {
      return toast.error(t('utils.error'), {
        description: res.statusText
      })
    }

    toast.success(t('pages.org.edit.token_generated'))

    findOrg()
  }

  const handleCopyAuthToken = async() => {
    if(!org || !org.token) {
      return toast.error(t('utils.error'))
    }

    await navigator.clipboard.writeText(org.token)

    toast.success(t('pages.org.edit.copied'))
  }

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
            className='flex justify-center p-10'
          >
            <h1
              className='text-center textl-3xl md:text-4xl font-bold'
            >
              {t.rich('pages.org.edit.title', {
                org: org.name
              })}
            </h1>
          </div>

          <div
            className='flex flex-col gap-10'
          >
            <div
              className='flex justify-center'
            >
              <div
                className='flex flex-col gap-2'
              >
                {
                  !org.token
                    ? (
                      <>
                        <div
                          onClick={handleGenerateAuthToken}
                          className='
                            flex gap-1
                            bg-indigo-600 p-2 rounded-xl transition hover:bg-indigo-500 duration-300 cursor-pointer
                            items-center
                          '
                        >
                          <KeySquare className='hidden md:block' />
                          <KeySquare className='block md:hidden' size={20} />

                          <span>
                            {t('pages.org.edit.generate_token')}
                          </span>
                        </div>
                      </>
                    )
                    : (
                      <>
                        <div
                          onClick={handleGenerateAuthToken}
                          className='
                            flex gap-1
                            bg-indigo-600 p-2 rounded-xl transition hover:bg-indigo-500 duration-300 cursor-pointer
                            items-center
                          '
                        >
                          <RefreshCw className='hidden md:block' />
                          <RefreshCw className='block md:hidden' size={20} />

                          <span>
                            {t('pages.org.edit.refresh_token')}
                          </span>
                        </div>

                        <div
                          onClick={handleCopyAuthToken}
                          className='
                            flex gap-1
                            bg-indigo-600 p-2 rounded-xl transition hover:bg-indigo-500 duration-300 cursor-pointer
                            items-center
                          '
                        >
                          <Copy className='hidden md:block' />
                          <Copy className='block md:hidden' size={20} />

                          <span>
                            {t('pages.org.edit.copy_token')}
                          </span>
                        </div>

                        <span
                          style={
                            {
                              whiteSpace: 'pre-line'
                            }
                          }
                        >
                          {t.rich('pages.org.edit.token_info', {
                            a: (chunks) => (
                              <a
                                className='font-bold text-blue-400 underline'
                                href='https://api.ishowfinance.com/openapi'
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                {chunks}
                              </a>
                            )
                          })}
                        </span>
                      </>
                    )
                }
              </div>
            </div>

            <div
              className='flex justify-center'
            >
              <form
                className='flex flex-col gap-5 relative max-w-md md:w-full'
                onSubmit={handleEdit}
              >
                <input
                  type='text'
                  placeholder={t('pages.org.edit.name')}
                  className='w-full rounded-2xl border border-gray-500 pl-4 py-2'
                  name='name'
                  value={name}
                  onChange={(input) => setName(input.target.value)}
                  autoComplete='off'
                />

                <input
                  type='email'
                  placeholder={t('pages.org.edit.email')}
                  className='w-full rounded-2xl border border-gray-500 pl-4 py-2'
                  name='email'
                  value={email}
                  onChange={(input) => setEmail(input.target.value)}
                />

                <select
                  name='currency'
                  value={currency}
                  onChange={(input) => setCurrency(input.target.value)}
                  className='w-full rounded-2xl border border-gray-500 pl-4 py-2'
                >
                  {
                    currencies.map((c) => (
                      <option
                        key={c}
                        value={c}
                        className='rounded-2xl bg-[#171717]'
                      >
                        {t(`pages.org.create.currency.${c}`)}
                      </option>
                    ))
                  }
                </select>

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
                >
                  {isLoading ? (
                    <Loading width={5} height={5} />
                  ) : (
                    <>
                      {t('pages.org.edit.save')}
                    </>
                  )
                  }
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}