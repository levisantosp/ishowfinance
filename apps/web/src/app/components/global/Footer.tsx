import { Copyright } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  return (
    <>
      <footer
        className='bg-[#0F0F0F] md:px-30 h-40 md:h-50 flex flex-col gap-13 md:gap-0 md:flex-row md:justify-between px-4 p-1 md:items-center mt-30'
      >
        <div
          className='flex px-4 p-1 md:px-0 items-center text-xl md:text-3xl font-extrabold'
        >
          <Image
            src='/header/logo.png'
            width={70}
            height={70}
            alt='logo'
          />

          <span>
            ishowfinance.com
          </span>
        </div>

        <div
          className='flex px-4 p-1 md:px-0 items-center gap-2 justify-center md:justify-start'
        >
          <Copyright
            className='hidden md:block'
            size={20}
          />
          <Copyright
            className='md:hidden'
            size={15}
          />
          <span
            className='md:text-sm text-xs text-center'
          >
            IShowFinance 2025 - All rights reserved.
          </span>
        </div>
      </footer>
    </>
  )
}