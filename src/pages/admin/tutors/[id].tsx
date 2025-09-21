import TutorDetails from '@/components/Admin/TutorDetails'
import React from 'react'
import AdminLayout from '../_layout'

const Details = () => {
    return (
        <AdminLayout>
            <TutorDetails canEdit />
        </AdminLayout>
    )
}

export default Details