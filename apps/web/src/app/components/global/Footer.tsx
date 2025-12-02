import { Copyright } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  return (
    <>
      <footer
        className='bg-[#0F0F0F] md:px-30 h-25 md:h-20 flex flex-col md:flex-row md:justify-between px-4 p-1 md:items-center mt-30'
      >
        <div
          className='flex px-4 p-1 md:px-0 justify-center items-center text-base md:text-xl font-extrabold'
        >
          <Image
            src='/header/logo.png'
            width={50}
            height={50}
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
            ishowfinance 2025 - All rights reserved.
          </span>
        </div>
      </footer>
    </>
  )
}