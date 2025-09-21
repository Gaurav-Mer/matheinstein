import { WithAuth } from '@/components/WithAuth'
import React from 'react'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <WithAuth allowedRoles={["admin"]}>
            {children}
        </WithAuth>
    )
}

export default AdminLayout