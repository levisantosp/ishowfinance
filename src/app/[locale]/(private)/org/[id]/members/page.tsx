import { prisma } from '@/lib/prisma'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import MembersOverview from '../../../../../components/private/org/MembersOverview.tsx'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function Members({ params }: Props) {
  const { id } = await params

  const session = await auth.api.getSession({ headers: await headers() })

  const member = await prisma.member.findFirst({
    where: {
      userId: session?.user.id,
      organizationId: id
    }
  })

  if (!member) {
    notFound()
  }

  return (
    <>
      <MembersOverview id={id} />
    </>
  )
}