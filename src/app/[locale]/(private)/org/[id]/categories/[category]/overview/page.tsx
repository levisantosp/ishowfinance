import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Overview from './category-overview.tsx'

type Props = {
  params: Promise<{
    id: string
    category: string
    locale: string
  }>
}

export default async function CategoryOverview(props: Props) {
  const params = await props.params

  const session = await auth.api.getSession({ headers: await headers() })

  const category = await prisma.category.findFirst({
    where: {
      id: params.category,
      organizationId: params.id
    }
  })

  if(!category || !session) {
    notFound()
  }

  return (
    <>
      <Overview
        categoryId={params.category}
        organizationId={params.id}
        locale={params.locale}
      />
    </>
  )
}