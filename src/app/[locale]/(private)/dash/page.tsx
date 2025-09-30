import { getTranslations } from 'next-intl/server'

export default async function Login() {
  const t = await getTranslations()

  return (
    <>
      <div>
        <h1
          className='text-center text-3xl md:text-4xl font-bold p-10'
        >
          {t('pages.dash.title')}
        </h1>
      </div>
    </>
  )
}