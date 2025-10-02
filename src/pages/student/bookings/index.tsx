import React from 'react'
import StudentBookingsPage from '@/components/Student/StudentBookingPage'
import StudentLayout from '../_layout'
import { useAuth } from '@/hooks/useAuth'
import { PendingRequestStatus } from '@/components/Student/PendingRequestStatus'

const Bookings = () => {
    const { status, user } = useAuth()
    return (
        <StudentLayout>
            {status === "pending_demo" ? <PendingRequestStatus studentName={user?.displayName ?? ""} subjectName='' /> : <StudentBookingsPage />}
        </StudentLayout>
    )
}

export default Bookings