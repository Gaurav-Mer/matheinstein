// /pages/admin/dashboard.tsx

import AdminLayout from "./_layout";

export default function AdminDashboard() {
    return (
        <AdminLayout>
            <div className="p-4">
                <h1>Admin Dashboard</h1>
                <p>Only admins can see this.</p>
            </div>
        </AdminLayout>
    );
}
