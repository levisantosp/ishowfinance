'use client'

import { Prisma } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import Loading from '@components/global/Loading'
import { RiErrorWarningLine } from 'react-icons/ri'
import { notFound } from 'next/navigation'

type Props = {
  id: string
  name: string
}

type Org = Prisma.OrganizationGetPayload<{
  include: {
    categories: true
  }
}>

export default function CategoriesOverview(props: Props) {
  const [org, setOrg] = useState<Org | null>()

  useEffect(() => {
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
              categories: true
            }
          })
        }
      })).json()

      setOrg(organization)
    }

    findOrg()
  }, [])

  const t = useTranslations()

  if(org === null) {
    notFound()
  }

  return (
    <>
      <div
        className='flex justify-center p-10'
      >
        <h1
          className='text-3xl md:text-4xl font-bold'
        >
          {t('pages.org.categories.title')}
        </h1>
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
                className='border border-gray-500 rounded-2xl w-[40vh] md:w-[110vh] h-20'
              >
                <h2
                  className='font-semibold text-2xl p-5'
                >
                  {c.name}
                </h2>
              </div>
            </div>
          )) :
          null
        }
      </div>
    </>
  )
}