import React from 'react'
import StudentLayout from './_layout'
import StudentBookingsPage from '@/components/Student/StudentBookingPage'

const Bookings = () => {
    return (
        <StudentLayout>
            <StudentBookingsPage />
        </StudentLayout>
    )
}

export default Bookings