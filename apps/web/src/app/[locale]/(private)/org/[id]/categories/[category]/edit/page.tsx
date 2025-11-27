import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import Edit from './edit.tsx'

type Props = {
  params: Promise<{
    id: string
    category: string
  }>
}

export default async function EditCategory(props: Props) {
  const { id, category } = await props.params

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
      <Edit id={id} category={category} />
    </>
  )
}