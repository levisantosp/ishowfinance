import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { authClient } from '@/lib/auth-client'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { RiErrorWarningLine } from 'react-icons/ri'
import { getTranslations } from 'next-intl/server'
import InviteRedirect from './InviteRedirect.tsx'

type Props = {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default async function InviteHome(props: Props) {
  const session = await auth.api.getSession({ headers: await headers() })

  if(!session) {
    authClient.signOut({
      fetchOptions: {
        headers: {
          auth: process.env.AUTH
        },
        onSuccess() {
          redirect('/login')
        }
      }
    })

    return null
  }

  const params = await props.params

  const invite = await prisma.invite.findUnique({
    where: {
      id: params.id
    },
    include: {
      organization: {
        include: {
          members: {
            where: {
              userId: session.user.id
            }
          }
        }
      }
    }
  })

  if(invite && invite.expiresAt < new Date()) {
    await prisma.invite.delete({
      where: { id: params.id }
    })
  }

  const t = await getTranslations()

  return (
    <>
      {(
        !invite
        || invite.expiresAt < new Date()
        || invite.organization.members[0]?.userId === session.user.id
      ) && (
        <div
          className='flex justify-center items-center gap-1 pt-30'
        >
          <RiErrorWarningLine
            color='#f87171'
            size={25}
          />

          <span
            className='text-xl text-center text-red-400'
          >
            {t('pages.invite.unknown_invite')}
          </span>
        </div>
      )}

      {(
        invite
        && invite.expiresAt >= new Date()
        && invite.organization.members[0]?.userId !== session.user.id
      ) && (
        <InviteRedirect
          organizationName={invite.organization.name}
          organizationId={invite.organization.id}
          invite={invite.id}
          user={session.user.id}
          locale={params.locale}
        />
      )}
    </>
  )
}