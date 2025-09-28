import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function Members({ params }: Props) {
  const { id } = await params

  const org = await prisma.organization.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: true
        }
      }
    }
  })

  if(!org) {
    notFound()
  }

  return (
    <>
      {org.members.map(member => (
        <div>
          {member.user.name}
        </div>
      ))}
    </>
  )
}