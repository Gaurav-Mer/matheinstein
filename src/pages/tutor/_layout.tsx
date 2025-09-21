import { WithAuth } from '@/components/WithAuth'
import React from 'react'

const TutorLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <WithAuth allowedRoles={["tutor"]}>
            {children}
        </WithAuth>
    )
}

export default TutorLayout