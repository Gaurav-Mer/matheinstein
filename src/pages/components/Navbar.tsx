import { Bag } from '@/components/svgs/students'
import { Add } from '@/components/svgs/teachers'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Navbar = () => {
    const router = useRouter()
    const login = () => {
        router.push("https://tutorbird.com/login")
    }

    return (
        <nav className='border-b flex justify-between px-12 bg-white'>
            <Image src={"/matheinstein.png"} width={80} height={80} alt='Logo' />
            <div className='flex items-center gap-2'>
                <Button onClick={() => login()} size={"lg"} className='bg-secondary'>Tutor <Add /></Button>
                <Button onClick={login} size={"lg"}>Student <Bag /></Button>
            </div>
        </nav>
    )
}

export default Navbar