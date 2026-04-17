import { useState, useEffect } from 'react';
import { getAdminTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../services/api';

const emptyItem = {
  name: '', title: '', company: '', country: '',
  quote: '', rating: 5, displayOrder: 0, isActive: true,
};

const inputClass = `w-full bg-white/[0.05] border border-eco-gold/15 rounded-lg px-3 py-2
                    text-eco-cream text-sm outline-none focus:border-eco-gold/40`;

// ─── Form fields extracted outside to prevent remount/focus loss ──
function TestimonialFormFields({ data, setData, idPrefix }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Name *</label>
        <input value={data.name} onChange={e => setData({ ...data, name: e.target.value })}
               className={inputClass} placeholder="Ahmed Al-Rashid" />
      </div>
      <div>
        <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Title</label>
        <input value={data.title} onChange={e => setData({ ...data, title: e.target.value })}
               className={inputClass} placeholder="Procurement Head" />
      </div>
      <div>
        <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Company</label>
        <input value={data.company} onChange={e => setData({ ...data, company: e.target.value })}
               className={inputClass} placeholder="Gulf Fresh Trading LLC" />
      </div>
      <div>
        <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Country</label>
        <input value={data.country} onChange={e => setData({ ...data, country: e.target.value })}
               className={inputClass} placeholder="UAE" />
      </div>
      <div className="md:col-span-2">
        <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Quote *</label>
        <textarea value={data.quote} onChange={e => setData({ ...data, quote: e.target.value })}
                  className={`${inputClass} resize-y min-h-[90px]`}
                  placeholder="Write the testimonial quote here..." />
      </div>
      <div>
        <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Rating (1–5)</label>
        <select value={data.rating} onChange={e => setData({ ...data, rating: parseInt(e.target.value) })}
                className={inputClass}>
          {[5, 4, 3, 2, 1].map(r => (
            <option key={r} value={r}>{r} star{r !== 1 ? 's' : ''}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Display Order</label>
        <input type="number" value={data.displayOrder}
               onChange={e => setData({ ...data, displayOrder: parseInt(e.target.value) || 0 })}
               className={inputClass} />
      </div>
      {data.isActive !== undefined && (
        <div className="flex items-center gap-2 md:col-span-2">
          <input type="checkbox" id={`${idPrefix}-active`} checked={data.isActive}
                 onChange={e => setData({ ...data, isActive: e.target.checked })}
                 className="accent-eco-gold" />
          <label htmlFor={`${idPrefix}-active`} className="text-sm text-eco-cream/60">Active (visible on site)</label>
        </div>
      )}
    </div>
  );
}

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyItem);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const nextOrder = items.length > 0 ? Math.max(...items.map(i => i.displayOrder)) + 1 : 1;

  useEffect(() => { load(); }, []);

  async function load() {
    try { setItems(await getAdminTestimonials()); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500); };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.quote.trim()) { flash('Name and quote are required'); return; }
    setSaving(true);
    try {
      await createTestimonial(form);
      setCreating(false);
      setForm(emptyItem);
      flash('Testimonial created');
      await load();
    } catch (err) {
      flash(err?.response?.data?.message || 'Failed to create');
    } finally { setSaving(false); }
  };

  const handleUpdate = async () => {
    if (!editing.name.trim() || !editing.quote.trim()) { flash('Name and quote are required'); return; }
    setSaving(true);
    try {
      await updateTestimonial(editing.id, editing);
      setEditing(null);
      flash('Testimonial updated');
      await load();
    } catch (err) {
      flash(err?.response?.data?.message || 'Failed to update');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete testimonial from "${name}"?`)) return;
    try {
      await deleteTestimonial(id);
      flash('Testimonial deleted');
      await load();
    } catch { flash('Failed to delete'); }
  };

  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  if (loading) return <div className="text-eco-cream/40 text-sm">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-eco-cream font-bold">Testimonials</h1>
          <p className="text-eco-cream/40 text-sm">
            Manage buyer quotes shown on the website.
            Layout: <span className="text-eco-gold font-medium">change TESTIMONIAL_LAYOUT in TestimonialsSection.jsx</span>
          </p>
        </div>
        {!creating && (
          <button onClick={() => { setForm({ ...emptyItem, displayOrder: nextOrder }); setCreating(true); }}
                  className="bg-eco-gold text-eco-dark px-4 py-2 rounded-lg text-sm font-semibold hover:bg-eco-gold-dark transition-colors">
            + Add Testimonial
          </button>
        )}
      </div>

      {msg && <div className="text-eco-gold text-sm mb-4 bg-eco-gold/10 rounded-lg px-4 py-2">{msg}</div>}

      {creating && (
        <div className="bg-white/[0.03] border border-eco-gold/15 rounded-xl p-5 mb-4">
          <div className="text-sm text-eco-gold font-medium mb-3">New Testimonial</div>
          <TestimonialFormFields data={form} setData={setForm} idPrefix="create" />
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
                <TestimonialFormFields data={editing} setData={setEditing} idPrefix={`edit-${item.id}`} />
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
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.isActive ? 'bg-green-400' : 'bg-red-400/50'}`} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-eco-cream font-medium">{item.name}</span>
                      {item.title && <span className="text-eco-cream/40 text-xs">{item.title}</span>}
                      {item.company && <span className="text-eco-cream/40 text-xs">· {item.company}</span>}
                      {item.country && (
                        <span className="text-eco-gold/60 text-[0.65rem] uppercase tracking-wider">{item.country}</span>
                      )}
                    </div>
                    <div className="text-eco-gold/70 text-xs mt-0.5">{stars(item.rating)}</div>
                    <p className="text-eco-cream/50 text-sm mt-1 line-clamp-2 leading-snug">&ldquo;{item.quote}&rdquo;</p>
                    <div className="text-eco-cream/25 text-[0.65rem] mt-1">
                      Order: {item.displayOrder}{!item.isActive && <span className="text-red-400/60 ml-1">· Inactive</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setEditing({ ...item })}
                          className="text-eco-gold/50 hover:text-eco-gold text-sm px-3 py-1.5 rounded-lg hover:bg-eco-gold/10 transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id, item.name)}
                          className="text-red-400/50 hover:text-red-400 text-sm px-3 py-1.5 rounded-lg hover:bg-red-400/10 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-eco-cream/30 text-sm text-center py-12">
            No testimonials yet. Add your first one above.
          </div>
        )}
      </div>
    </div>
  );
}
