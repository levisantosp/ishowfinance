'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from '@i18n/navigation'
import { useState } from 'react'
import Loading from '@components/global/Loading'

type Props = {
  id: string
}

export default function CreateCategoryForm(props: Props) {
  const t = useTranslations()

  const router = useRouter()

  const createCategory = async(formData: FormData, id: string) => {
    const nameData = formData.get('name')

    if(!nameData) return

    const name = nameData.toString()

    const res: { ok: boolean } = await (await fetch('/api/category', {
      method: 'post',
      headers: {
        auth: process.env.NEXT_PUBLIC_AUTH
      },
      body: JSON.stringify({ name, id })
    })).json()

    if(res.ok) {
      router.push(`/org/${id}/categories`)
    }
  }

  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const isDisabled = !name.length || loading

  return (
    <>
      <div
        className='flex justify-center'
      >
        <h1
          className='font-bold text-3xl md:text-4xl p-10'
        >
          {t('pages.org.categories.create.title')}
        </h1>
      </div>

      <div
        className='flex justify-center'
      >
        <form
          className='flex flex-col gap-5 relative max-w-md md:w-full'
          onSubmit={(form) => {
            form.preventDefault()

            setLoading(true)

            createCategory(new FormData(form.currentTarget), props.id)
          }}
        >
          <input
            type='text'
            placeholder={t('pages.org.categories.create.placeholder')}
            className='w-full rounded-2xl border border-gray-500 pl-4 py-2'
            name='name'
            value={name}
            onChange={(input) => setName(input.target.value)}
            autoComplete='off'
          />

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
            {loading ? (
              <Loading width={5} height={5} />
            ) : (
              <>
                {t('pages.org.create.submit')}
              </>
            )
            }
          </button>
        </form>
      </div>
    </>
  )
}