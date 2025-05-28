import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin-sidebar'; // Import the admin sidebar

const AdminLayout = () => (
  <div className="flex min-h-screen">
    <AdminSidebar />
    <main className="flex-1 ml-0 md:ml-[260px] p-4 bg-background">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
