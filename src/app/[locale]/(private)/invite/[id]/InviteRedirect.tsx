'use client'

import { CirclePlus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import Loading from '@components/global/Loading'
import { redirect } from '@i18n/navigation'

type Props = {
  invite: string
  organizationName: string
  organizationId: string
  user: string
  locale: string
}

export default function InviteRedirect(props: Props) {
  const [isDisabled, setIsDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleJoin = async() => {
    setIsDisabled(true)
    setIsLoading(true)

    const res = await fetch('/api/org', {
      method: 'PUT',
      headers: {
        auth: process.env.NEXT_PUBLIC_AUTH
      },
      body: JSON.stringify({
        id: props.organizationId,
        user: props.user,
        invite: props.invite
      })
    })

    if(res.ok) {
      const json: { id: string } = await res.json()

      redirect({
        href: `/org/${json.id}`,
        locale: props.locale
      })
    }
  }
  
  const t = useTranslations()

  return (
    <div
      className='flex flex-col justify-center items-center p-10 gap-10'
    >
      <h2
        className='text-center text-3xl md:text-4xl font-bold'
      >
        {props.organizationName}
      </h2>

      <div>
        <button
          type='button'
          className='
            flex gap-2 w-full rounded-xl bg-green-500 px-5 py-2
            justify-center items-center text-center
            transition duration-300 hover:bg-green-400
          disabled:bg-green-700 disabled:cursor-not-allowed disabled:text-gray-300
            cursor-pointer
          '
          disabled={isDisabled}
          onClick={handleJoin}
        >
          {isLoading ? (
            <Loading width={5} height={5} />
          ) : (
            <>
              <CirclePlus />
              <p>{t('pages.invite.join')}</p>
            </>
          )
          }
        </button>
      </div>
    </div>
  )
}