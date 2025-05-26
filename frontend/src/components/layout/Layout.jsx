import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <Link to="/" className="text-2xl font-bold text-blue-800">HealthLab</Link>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link to="/" className="btn btn-sm btn-outline">Home</Link>
            <Link to="/tests" className="btn btn-sm btn-outline">Tests</Link>
            <Link to="/booking" className="btn btn-sm btn-outline">Book</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-sm btn-primary">Dashboard</Link>
                <button onClick={logout} className="btn btn-sm btn-outline">Logout</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-sm btn-primary">Login</Link>
            )}
          </div>
        </div>
      </nav> */}
      <main className="flex-1 container-custom">
        <Outlet />
      </main>
      <footer className="bg-slate-100 text-center py-4 mt-8 text-slate-600">
        &copy; {new Date().getFullYear()} HealthLab. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
