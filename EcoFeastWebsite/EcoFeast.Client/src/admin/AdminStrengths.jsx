import { useState, useEffect } from 'react';
import { getAdminStrengths, createStrength, updateStrength, deleteStrength } from '../services/api';

const emptyItem = { title: '', description: '', displayOrder: 0, isActive: true };

const inputClass = `w-full bg-white/[0.05] border border-eco-gold/15 rounded-lg px-3 py-2
                    text-eco-cream text-sm outline-none focus:border-eco-gold/40`;

function StrengthFormFields({ data, setData, idPrefix }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Title</label>
        <input value={data.title} onChange={e => setData({ ...data, title: e.target.value })} className={inputClass} placeholder="Established Supplier" />
      </div>
      <div>
        <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Description</label>
        <textarea value={data.description} onChange={e => setData({ ...data, description: e.target.value })}
                  rows={3} className={inputClass + ' resize-y'} placeholder="Describe this strength..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Display Order</label>
          <input type="number" value={data.displayOrder} onChange={e => setData({ ...data, displayOrder: parseInt(e.target.value) || 0 })} className={inputClass} />
        </div>
        {data.isActive !== undefined && (
          <div className="flex items-center gap-2 self-end pb-2">
            <input type="checkbox" checked={data.isActive} onChange={e => setData({ ...data, isActive: e.target.checked })}
                   className="accent-eco-gold" id={`${idPrefix}-active`} />
            <label htmlFor={`${idPrefix}-active`} className="text-sm text-eco-cream/60">Active</label>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminStrengths() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyItem);

  const nextOrder = items.length > 0 ? Math.max(...items.map(s => s.displayOrder)) + 1 : 1;
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    try { setItems(await getAdminStrengths()); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500); };

  const handleCreate = async () => {
    setSaving(true);
    try {
      await createStrength(form);
      setCreating(false);
      setForm(emptyItem);
      flash('Strength created');
      await load();
    } catch { flash('Failed to create'); }
    finally { setSaving(false); }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await updateStrength(editing.id, editing);
      setEditing(null);
      flash('Strength updated');
      await load();
    } catch { flash('Failed to update'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteStrength(id);
      flash('Strength deleted');
      await load();
    } catch { flash('Failed to delete'); }
  };

  if (loading) return <div className="text-eco-cream/40 text-sm">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-eco-cream font-bold">Strengths</h1>
          <p className="text-eco-cream/40 text-sm">Manage your USP/competitive advantage cards.</p>
        </div>
        {!creating && (
          <button onClick={() => { setForm({ ...emptyItem, displayOrder: nextOrder }); setCreating(true); }}
                  className="bg-eco-gold text-eco-dark px-4 py-2 rounded-lg text-sm font-semibold hover:bg-eco-gold-dark transition-colors">
            + Add Strength
          </button>
        )}
      </div>

      {msg && <div className="text-eco-gold text-sm mb-4 bg-eco-gold/10 rounded-lg px-4 py-2">{msg}</div>}

      {creating && (
        <div className="bg-white/[0.03] border border-eco-gold/15 rounded-xl p-5 mb-4">
          <div className="text-sm text-eco-gold font-medium mb-3">New Strength</div>
          <StrengthFormFields data={form} setData={setForm} idPrefix="create" />
          <div className="flex gap-2 mt-4">
            <button onClick={handleCreate} disabled={saving}
                    className="bg-eco-gold text-eco-dark px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50">
              {saving ? 'Creating...' : 'Create'}
            </button>
            <button onClick={() => { setCreating(false); setForm(emptyItem); }}
                    className="text-eco-cream/40 px-4 py-1.5 rounded-lg text-sm hover:text-eco-cream/70">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {items.map(item => (
          <div key={item.id} className="bg-white/[0.03] border border-eco-gold/[0.08] rounded-xl p-5">
            {editing?.id === item.id ? (
              <div>
                <StrengthFormFields data={editing} setData={setEditing} idPrefix={`edit-${item.id}`} />
                <div className="flex gap-2 mt-4">
                  <button onClick={handleUpdate} disabled={saving}
                          className="bg-eco-gold text-eco-dark px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setEditing(null)}
                          className="text-eco-cream/40 px-4 py-1.5 rounded-lg text-sm hover:text-eco-cream/70">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.isActive ? 'bg-green-400' : 'bg-red-400/50'}`} />
                  <div>
                    <div className="text-eco-cream font-medium">{item.title}</div>
                    <div className="text-eco-cream/40 text-xs mt-0.5 max-w-md truncate">{item.description}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing({ ...item })}
                          className="text-eco-gold/50 hover:text-eco-gold text-sm px-3 py-1.5 rounded-lg hover:bg-eco-gold/10 transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id, item.title)}
                          className="text-red-400/50 hover:text-red-400 text-sm px-3 py-1.5 rounded-lg hover:bg-red-400/10 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
