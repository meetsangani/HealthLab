import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard, Calendar, FileText, Users, 
  Settings, LogOut, Menu, ChevronRight,
  FlaskConical, BarChart
} from "lucide-react";

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();

  const routes = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/manage-bookings",
      label: "Manage Bookings", 
      icon: Calendar,
    },
    {
      href: "/admin/manage-tests",
      label: "Manage Tests",
      icon: FlaskConical,
    },
    {
      href: "/admin/manage-customers",
      label: "Manage Customers",
      icon: Users,
    },
    {
      href: "/admin/manage-reports",
      label: "Manage Reports",
      icon: FileText,
    },
    {
      href: "/admin/analytics",
      label: "Analytics",
      icon: BarChart,
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden flex items-center h-16 px-4 border-b bg-card">
        <button 
          onClick={() => setOpen(!open)} 
          className="p-2 rounded-md hover:bg-muted"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="ml-3 text-lg font-semibold">Admin Panel</div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {open && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar Panel */}
      <div className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full py-4">
          <div className="px-4 py-2 border-b mb-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Admin Panel</h2>
              <button 
                onClick={() => setOpen(false)}
                className="p-1 rounded-full hover:bg-muted"
                aria-label="Close menu"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="grid gap-1 px-2">
              {routes.map((route, index) => (
                <Link
                  key={index}
                  to={route.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive(route.href) 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto px-2 pb-2 border-t pt-2">
            <button 
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-10">
        <div className="flex flex-col h-full py-4 border-r bg-card">
          <div className="px-4 py-2 border-b mb-2">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="grid gap-1 px-2 mt-2">
              {routes.map((route, index) => (
                <Link
                  key={index}
                  to={route.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive(route.href) 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto px-2 pb-2 border-t pt-2">
            <button 
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content Offset for Desktop */}
      <div className="hidden md:block md:pl-64 w-full"></div>
    </>
  );
}