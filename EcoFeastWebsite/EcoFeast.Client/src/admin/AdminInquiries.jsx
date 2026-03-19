import { useState, useEffect } from 'react';
import { getInquiries, markInquiryRead } from '../services/api';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all'); // all | unread | read

  useEffect(() => { load(); }, []);

  async function load() {
    try { setInquiries(await getInquiries()); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const handleMarkRead = async (id) => {
    try {
      await markInquiryRead(id);
      await load();
    } catch (err) { console.error(err); }
  };

  const filtered = inquiries.filter(i => {
    if (filter === 'unread') return !i.isRead;
    if (filter === 'read') return i.isRead;
    return true;
  });

  const unreadCount = inquiries.filter(i => !i.isRead).length;

  if (loading) return <div className="text-eco-cream/40 text-sm">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-eco-cream font-bold">Inquiries</h1>
          <p className="text-eco-cream/40 text-sm">
            {inquiries.length} total &middot; {unreadCount} unread
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5">
        {[
          { key: 'all', label: `All (${inquiries.length})` },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'read', label: 'Read' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filter === f.key
                ? 'bg-eco-gold/15 text-eco-gold font-medium'
                : 'text-eco-cream/40 hover:text-eco-cream/60'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-eco-cream/30 text-sm bg-white/[0.02] rounded-xl p-8 text-center">
          No inquiries {filter !== 'all' ? `(${filter})` : ''} yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(inq => (
            <div
              key={inq.id}
              className={`bg-white/[0.03] border rounded-xl overflow-hidden transition-colors cursor-pointer ${
                inq.isRead ? 'border-eco-gold/[0.06]' : 'border-eco-gold/20 bg-eco-gold/[0.02]'
              }`}
              onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}
            >
              <div className="p-4 flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${inq.isRead ? 'bg-eco-cream/15' : 'bg-eco-gold'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-eco-cream font-medium">{inq.name}</span>
                    {inq.company && (
                      <span className="text-xs text-eco-cream/30 bg-white/[0.04] px-2 py-0.5 rounded">{inq.company}</span>
                    )}
                  </div>
                  <div className="text-xs text-eco-cream/40">{inq.email}</div>
                </div>
                <div className="text-[0.65rem] text-eco-cream/25 shrink-0">
                  {new Date(inq.createdAt).toLocaleString()}
                </div>
              </div>

              {expanded === inq.id && (
                <div className="px-4 pb-4 border-t border-eco-gold/[0.06]">
                  <div className="mt-3 bg-white/[0.03] rounded-lg p-4 text-sm text-eco-cream/70 leading-relaxed whitespace-pre-wrap">
                    {inq.message}
                  </div>
                  <div className="flex gap-2 mt-3">
                    {!inq.isRead && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMarkRead(inq.id); }}
                        className="bg-eco-gold/10 text-eco-gold px-3 py-1.5 rounded-lg text-xs font-medium
                                   hover:bg-eco-gold/20 transition-colors"
                      >
                        Mark as read
                      </button>
                    )}
                    <a
                      href={`mailto:${inq.email}?subject=Re: Your inquiry to EcoFeast Nutrients`}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white/[0.05] text-eco-cream/60 px-3 py-1.5 rounded-lg text-xs
                                 hover:text-eco-cream/80 transition-colors"
                    >
                      Reply via email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
