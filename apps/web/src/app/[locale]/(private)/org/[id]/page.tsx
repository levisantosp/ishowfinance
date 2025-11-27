import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{
    locale: string
    id: string
  }>
}

export default async function OrgHome(props: Props) {
  const { locale, id } = await props.params

  redirect(`/${locale}/org/${id}/overview`)
}