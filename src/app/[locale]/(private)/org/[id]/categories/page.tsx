import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import CategoriesOverview from '@components/private/org/CategoriesOverview'

type Props = {
  params: Promise<{ id: string }>
}

export default async function Categories(props: Props) {
  const { id } = await props.params

  const session = await auth.api.getSession({ headers: await headers() })

  const member = await prisma.member.findFirst({
    where: {
      userId: session?.user.id,
      organizationId: id
    },
    include: {
      organization: true
    }
  })

  if(!member || !['OWNER', 'ADMIN'].includes(member.role)) {
    notFound()
  }

  return (
    <>
      <CategoriesOverview
        id={id}
        name={member.organization.name}
      />
    </>
  )
}