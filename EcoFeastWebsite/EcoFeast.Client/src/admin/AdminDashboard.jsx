import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats, getAdminProducts, getInquiries } from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, p, i] = await Promise.all([getAdminStats(), getAdminProducts(), getInquiries()]);
        setStats(s);
        setProductCount(p.length);
        setInquiries(i);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="text-eco-cream/40 text-sm">Loading dashboard...</div>;

  const unreadCount = inquiries.filter(i => !i.isRead).length;
  const recentInquiries = inquiries.slice(0, 5);

  const cards = [
    { label: 'Products', value: productCount, path: '/admin/products', color: '#4a8a4a' },
    { label: 'Inquiries', value: inquiries.length, path: '/admin/inquiries', color: '#c9a96e' },
    { label: 'Unread', value: unreadCount, path: '/admin/inquiries', color: unreadCount > 0 ? '#e87070' : '#6a9a6a' },
    ...stats.map(s => ({ label: s.label, value: `${s.value}${s.suffix}`, path: '/admin/stats', color: '#c9a96e' })),
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-eco-cream font-bold mb-6">Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => (
          <Link
            key={i}
            to={c.path}
            className="bg-white/[0.03] border border-eco-gold/[0.08] rounded-xl p-4 hover:border-eco-gold/20 transition-colors"
          >
            <div className="text-[0.7rem] text-eco-cream/40 tracking-wider uppercase mb-1">{c.label}</div>
            <div className="text-2xl font-display font-bold" style={{ color: c.color }}>{c.value}</div>
          </Link>
        ))}
      </div>

      {/* Recent inquiries */}
      <div className="bg-white/[0.03] border border-eco-gold/[0.08] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-eco-cream font-semibold">Recent Inquiries</h2>
          <Link to="/admin/inquiries" className="text-xs text-eco-gold hover:underline">View all</Link>
        </div>

        {recentInquiries.length === 0 ? (
          <div className="text-eco-cream/30 text-sm">No inquiries yet.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {recentInquiries.map(inq => (
              <div
                key={inq.id}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  inq.isRead ? 'bg-transparent' : 'bg-eco-gold/[0.04]'
                }`}
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${inq.isRead ? 'bg-eco-cream/20' : 'bg-eco-gold'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-eco-cream font-medium">{inq.name}</span>
                    {inq.company && <span className="text-xs text-eco-cream/30">{inq.company}</span>}
                  </div>
                  <div className="text-xs text-eco-cream/40 truncate">{inq.message}</div>
                </div>
                <div className="text-[0.65rem] text-eco-cream/25 shrink-0">
                  {new Date(inq.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
