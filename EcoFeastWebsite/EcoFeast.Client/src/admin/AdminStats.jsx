import { useState, useEffect } from 'react';
import { getAdminStats, updateStat } from '../services/api';

export default function AdminStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setStats(await getAdminStats());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const startEdit = (stat) => setEditing({ ...stat });

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      await updateStat(editing.id, {
        label: editing.label,
        value: editing.value,
        suffix: editing.suffix,
        displayOrder: editing.displayOrder,
      });
      setEditing(null);
      setMsg('Saved successfully');
      await load();
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      setMsg('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-eco-cream/40 text-sm">Loading...</div>;

  return (
    <div>
      <h1 className="font-display text-2xl text-eco-cream font-bold mb-1">Stat Counters</h1>
      <p className="text-eco-cream/40 text-sm mb-6">Edit the hero section statistics displayed on the homepage.</p>

      {msg && <div className="text-eco-gold text-sm mb-4 bg-eco-gold/10 rounded-lg px-4 py-2">{msg}</div>}

      <div className="grid gap-4">
        {stats.map(stat => (
          <div key={stat.id} className="bg-white/[0.03] border border-eco-gold/[0.08] rounded-xl p-5">
            {editing?.id === stat.id ? (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Label</label>
                    <input
                      value={editing.label}
                      onChange={e => setEditing({ ...editing, label: e.target.value })}
                      className="w-full bg-white/[0.05] border border-eco-gold/15 rounded-lg px-3 py-2
                                 text-eco-cream text-sm outline-none focus:border-eco-gold/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Value</label>
                    <input
                      type="number"
                      value={editing.value}
                      onChange={e => setEditing({ ...editing, value: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white/[0.05] border border-eco-gold/15 rounded-lg px-3 py-2
                                 text-eco-cream text-sm outline-none focus:border-eco-gold/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Suffix</label>
                    <input
                      value={editing.suffix}
                      onChange={e => setEditing({ ...editing, suffix: e.target.value })}
                      className="w-full bg-white/[0.05] border border-eco-gold/15 rounded-lg px-3 py-2
                                 text-eco-cream text-sm outline-none focus:border-eco-gold/40"
                      placeholder="e.g. +"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Order</label>
                    <input
                      type="number"
                      value={editing.displayOrder}
                      onChange={e => setEditing({ ...editing, displayOrder: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white/[0.05] border border-eco-gold/15 rounded-lg px-3 py-2
                                 text-eco-cream text-sm outline-none focus:border-eco-gold/40"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-eco-gold text-eco-dark px-4 py-1.5 rounded-lg text-sm font-semibold
                               hover:bg-eco-gold-dark transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="text-eco-cream/40 px-4 py-1.5 rounded-lg text-sm hover:text-eco-cream/70 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-eco-cream font-medium">{stat.label}</div>
                  <div className="text-eco-gold text-2xl font-display font-bold mt-0.5">
                    {stat.value}{stat.suffix}
                  </div>
                </div>
                <button
                  onClick={() => startEdit(stat)}
                  className="text-eco-gold/50 hover:text-eco-gold text-sm transition-colors px-3 py-1.5 rounded-lg
                             hover:bg-eco-gold/10"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
