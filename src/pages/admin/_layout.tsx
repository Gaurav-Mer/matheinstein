import Sidebar from '@/components/Sidebar'
import { WithAuth } from '@/components/WithAuth'
import React from 'react'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <WithAuth allowedRoles={["admin"]}>
            <div className=' flex-1 overflow-auto flex items-start h-dvh'>
                <Sidebar />
                <div className='flex flex-col overflow-hidden flex-1'>
                    {children}
                </div>
            </div >
        </WithAuth>
    )
}

export default AdminLayout