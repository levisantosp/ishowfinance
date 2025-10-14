'use client'

import { Prisma } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { RiErrorWarningLine } from 'react-icons/ri'
import Link from 'next/link'
import Loading from '@components/global/Loading'

type Org = Prisma.OrganizationGetPayload<{
  include: {
    members: {
      where: {
        userId: string
      }
    },
    categories: {
      include: {
        transactions: true
      }
    }
  }
}>

type Props = {
  userId: string
  locale: string
}

export default function Org({ userId, locale }: Props) {
  const t = useTranslations()

  const [organizations, setOrganizations] = useState<Org[] | null>([])

  useEffect(() => {
    const startOfDay = new Date()
      .setHours(0, 0, 0, 0)

    const startOfNextDay = new Date()
    
    startOfNextDay.setDate(startOfNextDay.getDate() + 1)
    startOfNextDay.setHours(0, 0, 0, 0)
    
    const findOrganizations = async() => {
      const res: {
        organizations: Org[]
      } = await (await fetch('/api/org', {
        headers: {
          auth: process.env.NEXT_PUBLIC_AUTH,
          find: 'many',
          queryOptions: JSON.stringify({
            where: {
              members: {
                some: { userId }
              }
            },
            include: {
              members: {
                where: { userId }
              },
              categories: {
                include: {
                  transactions: {
                    where: {
                      createdAt: {
                        gte: new Date(startOfDay),
                        lt: startOfNextDay
                      }
                    }
                  }
                }
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
          <Loading height={5} width={5} />
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
                  {t('pages.dash.profile.today_income')}
                </h3>

                <span
                  className='text-gray-400'
                >
                  {(org.categories.reduce((sum, category) => {
                    const total = category.transactions.reduce((csum, transaction) =>
                      csum + Number(transaction.amount), 0
                    )

                    return sum + total
                  }, 0)).toLocaleString(locale, {
                    style: 'currency',
                    currency: org.currency
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