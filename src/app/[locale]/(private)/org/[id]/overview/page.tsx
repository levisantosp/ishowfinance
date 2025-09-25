import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function Overview({ params }: Props) {
  const { id } = await params

  const org = await prisma.organization.findUnique({
    where: { id }
  })

  if(!org) {
    notFound()
  }

  return (
    <>
      id da org: {org?.id}
    </>
  )
}