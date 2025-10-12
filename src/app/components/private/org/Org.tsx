'use client'

import { $Enums } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { RiErrorWarningLine } from 'react-icons/ri'
import Link from 'next/link'

type Member = {
  id: string
  userId: string
  createdAt: Date
  updatedAt: Date
  role: $Enums.Role
  organizationId: string
}

type Org = {
  id: string
  email: string
  createdAt: Date
  updatedAt: Date
  userId: string
  name: string
  members: Member[]
  balance: string
  currency: $Enums.Currency
}

type Props = {
  userId: string
  locale: string
}

export default function Org({ userId, locale }: Props) {
  const t = useTranslations()

  const [organizations, setOrganizations] = useState<Org[] | null>([])

  useEffect(() => {
    const findOrganizations = async() => {
      const res: {
        organizations: Org[]
      } = await (await fetch('/api/org', {
        headers: {
          auth: process.env.NEXT_PUBLIC_AUTH,
          find: 'many',
          queryOptions: JSON.stringify({
            include: {
              members: {
                where: { userId }
              }
            }
          })
        }
      })).json()

      if(res.organizations.length) {
        setOrganizations(res.organizations)
      }

      else {
        setOrganizations(null)
      }
    }

    findOrganizations()
  }, [])

  return (
    <>
      {organizations?.length === 0 && (
        <div
          className='flex justify-center py-10 md:px-80'
        >
          <div
            className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'
          />
        </div>
      )}
      <div
        className='grid grid-cols-1 md:grid-cols-2 gap-x-30 gap-y-3 pt-3 place-items-center'
      >
        {organizations && organizations.length > 0 && organizations.map(org => (
          <div
            key={org.id}
            className='border border-gray-500 py-3 px-7 rounded-2xl w-84 min-h-14 flex flex-col gap-2'
          >
            <div
              className='flex justify-between items-center'
            >
              <Link
                href={`/org/${org.id}/overview`}
              >
                <h3
                  className='text-xl font-semibold text-blue-400 underline'
                >
                  {org.name}
                </h3>
              </Link>

              <span
                className='text-gray-400 font-medium'
              >
                {t(`pages.dash.profile.role.${org.members[0].role}`)}
              </span>
            </div>

            {['OWNER', 'ADMIN'].includes(org.members[0].role) && (
              <div>
                <h3
                  className='font-medium'
                >
                  {t('pages.dash.profile.total_balance')}
                </h3>

                <span
                  className='text-gray-400'
                >
                  {(Number(org.balance) / 100).toLocaleString(locale, {
                    currency: org.currency,
                    style: 'currency'
                  })}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        {!organizations && (
          <div
            className='flex justify-center gap-1'
          >
            <RiErrorWarningLine
              color='#f87171'
            />

            <span
              className='text-xs text-center text-red-400'
            >
              {t('pages.dash.profile.you_dont_have_orgs')}
            </span>
          </div>
        )}
      </div>
    </>
  )
}