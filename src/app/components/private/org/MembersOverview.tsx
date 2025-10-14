'use client'

import { Prisma } from '@prisma/client'
import { Undo2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from '@i18n/navigation'

type Props = {
  id: string
}

type Org = Prisma.OrganizationGetPayload<{
  include: {
    members: {
      include: {
        user: true
      }
    }
  }
}>

export default function MembersOverview(props: Props) {
  const [org, setOrg] = useState<Org | null>()

  useEffect(() => {
    const findOrg = async() => {
      const { organization }: {
        organization: Omit<Org, 'balance'> & {
          balance: string
        } | null
      } = await (await fetch('/api/org', {
        headers: {
          auth: process.env.NEXT_PUBLIC_AUTH,
          find: 'unique',
          queryOptions: JSON.stringify({
            where: {
              id: props.id
            },
            include: {
              members: {
                include: {
                  user: true
                }
              }
            }
          })
        }
      })).json()

      setOrg(organization)
    }

    findOrg()
  }, [])

  if(org === null) {
    notFound()
  }

  const t = useTranslations()

  const router = useRouter()

  return (
    <>
      {org === undefined && (
        <div
          className='flex justify-center p-10'
        >
          <div
            className='flex items-center rounded-2xl p-5 gap-2'
          >
            <div
              className='w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin'
            />
          </div>
        </div>
      )}

      {org && (
        <>
          <div
            className='flex justify-center items-center p-10'
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

            <h2
              className='text-center text-3xl md:text-4xl font-bold'
            >
              {t('pages.org.members.title')}
            </h2>
          </div>
          <div
            className='flex flex-col gap-5 items-center'
          >
            {org.members.map(member => (
              <div
                key={member.user.id}
                className='border border-gray-500 rounded-2xl'
              >
                <div
                  className='px-5 py-2'
                >
                  <span
                    className='md:text-lg text-gray-400'
                  >
                    {t(`pages.dash.profile.role.${member.role}`)}
                  </span>
                </div>
                <div
                  className='flex items-center gap-3 mb-5 px-5'
                >
                  <Image
                    src={member.user.image as string}
                    width={70}
                    height={70}
                    alt='profile icon'
                    className='rounded-full'
                  />
                  <h3
                    className='text-xl md:text-2xl font-semibold'
                  >
                    {member.user.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}