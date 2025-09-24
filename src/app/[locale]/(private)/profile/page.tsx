import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Image from "next/image"

export default async function Profile() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <>
      <Image
        src={session.user.image as string}
        width={80}
        height={80}
        alt="profile icon"
        className="rounded-full"
      />
      <span>
        {session.user.name}
      </span>
    </>
  )
}