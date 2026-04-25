import React from 'react'
import Image from 'next/image'
import { Share_Tech } from 'next/font/google'

const shareTech = Share_Tech({ 
  weight: '400', 
  subsets: ['latin'],
  variable: '--font-share-tech',
})

const AppHeader = () => {
  return (
    <header className="h-14 shrink-0 border-b bg-background">
      <div className="flex h-full items-center gap-2 px-4">
        <Image src='/logo.png' alt = 'Logo error' width = {35} height = {35}/>
        <p className = {`text-2xl ${shareTech.className}`}>tickflow</p>
      </div>
    </header>
  )
}

export default AppHeader
