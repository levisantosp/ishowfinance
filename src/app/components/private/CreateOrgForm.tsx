'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const currencies = [
  'BRL',
  'USD',
  'EUR'
] as const

export default function CreateOrgForm() {
  const t = useTranslations()

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [currency, setCurrency] = useState('BRL')

  const router = useRouter()

  const isDisabled = !email.length || !name.length || loading || disabled

  const createOrg = async(formData: FormData) => {
    const nameData = formData.get('name')
    const emailData = formData.get('email')
    const currencyData = formData.get('currency')

    if(!nameData || !emailData || !currencyData) return

    const name = nameData.toString()
    const email = emailData.toString()
    const currency = currencyData.toString()

    const res: {
      redirectTo?: string
      error?: string
    } = await (await fetch('/api/org', {
      method: 'post',
      headers: {
        auth: process.env.NEXT_PUBLIC_AUTH
      },
      body: JSON.stringify({ name, email, currency })
    })).json()

    if(!res.redirectTo) return

    setLoading(false)
    setDisabled(true)

    router.push(res.redirectTo)
  }

  return (
    <>
      <form
        className='flex flex-col gap-5 relative max-w-md md:w-full'
        onSubmit={(form) => {
          form.preventDefault()

          setLoading(true)

          createOrg(new FormData(form.currentTarget))
        }}
      >
        <input
          type='text'
          placeholder={t('pages.org.create.name')}
          className='w-full rounded-2xl border border-gray-500 pl-4 py-2'
          name='name'
          value={name}
          onChange={(input) => setName(input.target.value)}
          autoComplete='off'
        />

        <input
          type='email'
          placeholder={t('pages.org.create.email')}
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
            '
          disabled={isDisabled}
        >
          {loading ? (
            <div
              className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'
            />
          ) : (
            <>
              {t('pages.org.create.submit')}
            </>
          )
          }
        </button>
      </form>
    </>
  )
}