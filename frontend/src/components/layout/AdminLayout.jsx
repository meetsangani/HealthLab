import { Outlet } from 'react-router-dom';

const AdminLayout = () => (
  <div>
    {/* Admin sidebar/nav */}
    <Outlet />
  </div>
);

export default AdminLayout;
