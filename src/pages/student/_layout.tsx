import { WithAuth } from '@/components/WithAuth'
import React from 'react'

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <WithAuth allowedRoles={["student"]}>
            {children}
        </WithAuth>
    )
}

export default StudentLayout