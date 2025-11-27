import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { EditOrg } from '@components/private/org/EditOrg'

type Props = {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default async function Edit(props: Props) {
  const { id, locale } = await props.params

  const session = await auth.api.getSession({ headers: await headers() })

  const member = await prisma.member.findFirst({
    where: {
      userId: session?.user.id,
      organizationId: id
    }
  })

  if(!member || !['OWNER', 'ADMIN'].includes(member.role)) {
    notFound()
  }

  return (
    <>
      <EditOrg id={id} locale={locale} />
    </>
  )
}