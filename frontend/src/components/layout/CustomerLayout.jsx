import { Outlet } from 'react-router-dom';

const CustomerLayout = () => (
  <div>
    {/* Customer sidebar/nav */}
    <Outlet />
  </div>
);

export default CustomerLayout;
