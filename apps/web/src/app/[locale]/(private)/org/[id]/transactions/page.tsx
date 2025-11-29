import { auth } from '@/lib/auth'
import TransactionsComponent from './transactions.tsx'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default async function TransactionsPage(props: Props) {
  const session = await auth.api.getSession({ headers: await headers() })

  if(!session) {
    redirect('/login')
  }

  const params = await props.params

  return (
    <TransactionsComponent id={params.id} locale={params.locale} />
  )
}