import Sidebar from '@/components/Sidebar'
import { WithAuth } from '@/components/WithAuth'
import React from 'react'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <WithAuth allowedRoles={["admin"]}>
            {/* Full viewport container */}
            <div className="flex h-full w-full">
                {/* Sidebar fixed width */}
                <Sidebar />
                {/* Main content scrollable */}
                <div className="flex-1 flex flex-col overflow-auto">
                    {children}
                </div>
            </div>
        </WithAuth>
    )
}

export default AdminLayout