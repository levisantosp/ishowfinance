'use client'

import { Prisma } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import Loading from '../../global/Loading.tsx'

type Org = Prisma.OrganizationGetPayload<{}>

type Props = {
  id: string
}

export function EditOrg(props: Props) {
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
            where: { id: props.id }
          })
        }
      })).json()
      
      setOrg(organization)
    }

    findOrg()
  }, [])

  const t = useTranslations()

  return (
    <>
      {org === undefined && (
        <Loading width={10} height={10} />
      )}
      {org && (
        <div>
          <h1>
            {t.rich('pages.org.edit.title', {
              org: org.name
            })}
          </h1>
        </div>
      )}
    </>
  )
}