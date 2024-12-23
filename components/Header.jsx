import React from 'react'
import { SignedIn,SignedOut,SignInButton,UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { LayoutDashboard } from 'lucide-react'

const Header = () => {
  return (
    <div className='fixed top-0 w-full  backdrop-blur-md z-50  bg-white/80 '>
    <nav className='flex justify-between items-center outline outline-1 px-2 py-2'>
      <Link href="/">
        <Image src={"/management_logo.webp"} alt='logo' height={80} width={200} className='rounded-full h-12 w-auto object-contain'></Image>
      </Link>
    <div className='flex items-center justify-center gap-4'>
          <SignedIn>
            <Link href='/dashboard'>
            <span>
                <LayoutDashboard className='inline'></LayoutDashboard>
              <span className='sm:hidden md:inline'>dashboard</span></span>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl='/dashboard'>
            <Button variant="outline" className='text-black'>login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          </div>
          </nav>
    </div>
  )
}

export default Header