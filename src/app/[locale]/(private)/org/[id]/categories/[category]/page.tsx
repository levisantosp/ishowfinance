import { redirect } from '@i18n/navigation'

type Props = {
  params: Promise<{
    locale: string
    id: string
    category: string
  }>
}

export default async function CategoryHome(props: Props) {
  const params = await props.params

  redirect({
    href: `/org/${params.id}/categories/${params.category}/overview`,
    locale: params.locale
  })
}