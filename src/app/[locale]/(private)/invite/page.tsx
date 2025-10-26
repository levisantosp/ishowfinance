import { redirect } from '@i18n/navigation'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function InvitePage(props: Props) {
  const params = await props.params

  redirect({
    href: `/`,
    locale: params.locale
  })
}