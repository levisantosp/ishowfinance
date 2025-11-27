'use client'

import { FaMicrosoft } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { authClient } from '../../../lib/auth-client.ts'

type Props = {
  google: string
  microsoft: string
}

export default function LoginMethods({ google, microsoft }: Props) {
  const login = (provider: 'google' | 'microsoft') => {
    authClient.signIn.social({
      provider,
      callbackURL: '/dash',
      fetchOptions: {
        headers: {
          auth: process.env.NEXT_PUBLIC_AUTH
        }
      }
    })
  }

  return (
    <>
      <button
        onClick={() => login('google')}
        className='
          flex gap-2 border border-gray-500 rounded-2xl p-3 cursor-pointer
          hover:bg-[#444444] duration-300
          w-80 md:w-100
          items-center justify-center
          '
      >
        <FcGoogle
          size={30}
        />
        <span
          className='text-lg md:text-xl'
        >
          {google}
        </span>
      </button>
      <button
        onClick={() => login('microsoft')}
        className='
          flex gap-2 border border-gray-500 rounded-2xl p-3 cursor-pointer
          hover:bg-[#444444] duration-300
          w-80 md:w-100
          items-center justify-center
          '
      >
        <FaMicrosoft
          size={30}
        />
        <span
          className='text-lg md:text-xl'
        >
          {microsoft}
        </span>
      </button>
    </>
  )
}