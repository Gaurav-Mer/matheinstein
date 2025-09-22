// components/layouts/StudentLayout.tsx
import Sidebar from '@/components/Sidebar'
import { WithAuth } from '@/components/WithAuth'
import React from 'react'

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <WithAuth allowedRoles={["student"]}>
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

export default StudentLayout
