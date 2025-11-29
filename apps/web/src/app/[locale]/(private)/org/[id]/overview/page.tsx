import OrgOverview from '@components/private/org/Overview'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default async function Overview({ params }: Props) {
  const { id, locale } = await params

  const session = await auth.api.getSession({ headers: await headers() })

  const member = await prisma.member.findFirst({
    where: {
      userId: session?.user.id,
      organizationId: id
    }
  })

  if(!member) {
    notFound()
  }

  return (
    <>
      <OrgOverview 
        id={id}
        locale={locale}
        isAdmin={['OWNER', 'ADMIN'].includes(member.role)}
        isOwner={member.role === 'OWNER'}
      />
    </>
  )
}