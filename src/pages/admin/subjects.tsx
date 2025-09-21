import SubjectsSection from '@/components/Admin/subjects/SubjectsSection'
import React from 'react'
import AdminLayout from './_layout'

const Subjects = () => {
    return (
        <AdminLayout>
            <div className=' p-6 '>
                <SubjectsSection />
            </div>
        </AdminLayout>
    )
}

export default Subjects