import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin', icon: 'D' },
  { label: 'Stats', path: '/admin/stats', icon: 'S' },
  { label: 'Products', path: '/admin/products', icon: 'P' },
  { label: 'Strengths', path: '/admin/strengths', icon: 'W' },
  { label: 'Inquiries', path: '/admin/inquiries', icon: 'I' },
  { label: 'Settings', path: '/admin/settings', icon: 'G' },
  { label: 'Users', path: '/admin/users', icon: 'U' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = localStorage.getItem('ecofeast_user') || 'Admin';

  useEffect(() => {
    const token = localStorage.getItem('ecofeast_token');
    if (!token) navigate('/admin/login');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('ecofeast_token');
    localStorage.removeItem('ecofeast_user');
    navigate('/admin/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-eco-gold/15 text-eco-gold'
        : 'text-eco-cream/50 hover:text-eco-cream/80 hover:bg-white/[0.04]'
    }`;

  return (
    <div className="min-h-screen bg-eco-dark flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-[#0a140a] border-r border-eco-gold/[0.08]
                    flex flex-col transition-transform duration-300 md:relative md:translate-x-0
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-5 border-b border-eco-gold/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-eco-gold/10 border border-eco-gold/20
                            flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round">
                <path d="M12 22c-5-2.5-9-7.5-9-14C7 5 10 3 12 2c2 1 5 3 9 6 0 6.5-4 11.5-9 14z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-eco-cream font-display">EcoFeast</div>
              <div className="text-[0.6rem] text-eco-gold/50 tracking-wider uppercase">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={linkClass}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="w-6 h-6 rounded bg-eco-gold/[0.08] flex items-center justify-center
                               text-[0.65rem] text-eco-gold font-bold shrink-0">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-eco-gold/[0.08]">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-full bg-eco-gold/10 flex items-center justify-center
                            text-[0.65rem] text-eco-gold font-bold">
              {user[0]?.toUpperCase()}
            </div>
            <span className="text-sm text-eco-cream/60">{user}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left text-xs text-eco-cream/30 hover:text-red-400 transition-colors px-1"
          >
            Sign out
          </button>
          <a href="/" className="block text-xs text-eco-cream/20 hover:text-eco-gold transition-colors px-1 mt-2">
            View website
          </a>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-eco-dark/95 backdrop-blur border-b border-eco-gold/[0.06] px-6 py-3 flex items-center">
          <button
            className="md:hidden mr-4 text-eco-gold"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <h2 className="text-sm font-medium text-eco-cream/60">Administration</h2>
        </div>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
