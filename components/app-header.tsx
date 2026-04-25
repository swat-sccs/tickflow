import React from 'react'
import Image from 'next/image'
import { Share_Tech } from 'next/font/google'
import {
  Command,
  CommandInput,
} from "@/components/ui/command"

const shareTech = Share_Tech({ 
  weight: '400', 
  subsets: ['latin'],
  variable: '--font-share-tech',
})

const AppHeader = () => {
  return (
    <header className="h-14 shrink-0 border-b bg-background">
      <div className="grid h-full grid-cols-[auto_1fr_auto] items-center gap-4 px-4">
        <div className="flex items-center gap-2">
          <Image src='/logo.png' alt='Logo error' width={35} height={35} />
          <p className={`text-2xl ${shareTech.className}`}>tickflow</p>
        </div>
        <div className="flex justify-center">
          <Command className="h-10 w-full max-w-sm rounded-lg border">
            <CommandInput placeholder="Search..." />
          </Command>
        </div>
        <div />
      </div>
    </header>
  )
}

export default AppHeader
