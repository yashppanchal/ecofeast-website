import { useState, useEffect, useRef, useMemo } from 'react';
import { getAdminMapCountries, createMapCountry, updateMapCountry, deleteMapCountry } from '../services/api';
import COUNTRY_LIST from '../data/countries.json';

const emptyItem = { name: '', latitude: 0, longitude: 0, isHome: false, isActive: true, displayOrder: 0 };

const inputClass = `w-full bg-white/[0.05] border border-eco-gold/15 rounded-lg px-3 py-2
                    text-eco-cream text-sm outline-none focus:border-eco-gold/40`;

/* ─── Searchable country picker ────────────────────────────── */
function CountryPicker({ value, onPick }) {
  const [query, setQuery] = useState(value || '');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => { setQuery(value || ''); }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRY_LIST.slice(0, 50);
    return COUNTRY_LIST.filter(c => c.name.toLowerCase().includes(q)).slice(0, 50);
  }, [query]);

  return (
    <div ref={wrapRef} className="relative">
      <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Country / Region</label>
      <input
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        className={inputClass}
        placeholder="Start typing to search..."
      />
      {open && matches.length > 0 && (
        <div className="absolute z-20 left-0 right-0 mt-1 bg-eco-dark border border-eco-gold/25 rounded-lg max-h-56 overflow-y-auto shadow-xl">
          {matches.map(c => (
            <button
              key={c.name}
              type="button"
              onClick={() => { onPick(c); setQuery(c.name); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm text-eco-cream/80 hover:bg-eco-gold/10 hover:text-eco-gold transition-colors border-b border-eco-gold/[0.05] last:border-0"
            >
              <div className="flex items-center justify-between gap-2">
                <span>{c.name}</span>
                <span className="text-[0.65rem] text-eco-cream/30 font-mono">{c.lat.toFixed(2)}, {c.lon.toFixed(2)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
      <div className="text-[0.6rem] text-eco-cream/30 mt-1">
        Pick from the list to auto-fill coordinates, or type a custom region name and set coordinates manually below.
      </div>
    </div>
  );
}

/* ─── Form fields ──────────────────────────────────────────── */
function CountryFormFields({ data, setData, idPrefix }) {
  return (
    <div className="flex flex-col gap-3">
      <CountryPicker
        value={data.name}
        onPick={(c) => setData({ ...data, name: c.name, latitude: c.lat, longitude: c.lon })}
      />
      {/* Allow manual override of name without using picker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Name (override)</label>
          <input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} className={inputClass} placeholder="India" />
        </div>
        <div>
          <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Latitude</label>
          <input type="number" step="0.0001" value={data.latitude}
                 onChange={e => setData({ ...data, latitude: parseFloat(e.target.value) || 0 })}
                 className={inputClass} placeholder="22" />
        </div>
        <div>
          <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Longitude</label>
          <input type="number" step="0.0001" value={data.longitude}
                 onChange={e => setData({ ...data, longitude: parseFloat(e.target.value) || 0 })}
                 className={inputClass} placeholder="78" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Display Order</label>
          <input type="number" value={data.displayOrder}
                 onChange={e => setData({ ...data, displayOrder: parseInt(e.target.value) || 0 })}
                 className={inputClass} />
        </div>
        <div className="flex items-center gap-4 self-end pb-2">
          <label className="flex items-center gap-2 text-sm text-eco-cream/60">
            <input type="checkbox" checked={data.isHome}
                   onChange={e => setData({ ...data, isHome: e.target.checked })}
                   className="accent-eco-gold" id={`${idPrefix}-home`} />
            Home (origin for trade lines)
          </label>
          {data.isActive !== undefined && (
            <label className="flex items-center gap-2 text-sm text-eco-cream/60">
              <input type="checkbox" checked={data.isActive}
                     onChange={e => setData({ ...data, isActive: e.target.checked })}
                     className="accent-eco-gold" id={`${idPrefix}-active`} />
              Active
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ────────────────────────────────────────────── */
export default function AdminMapCountries() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyItem);

  const nextOrder = items.length > 0 ? Math.max(...items.map(c => c.displayOrder)) + 1 : 1;
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    try { setItems(await getAdminMapCountries()); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500); };

  const handleCreate = async () => {
    setSaving(true);
    try {
      await createMapCountry(form);
      setCreating(false);
      setForm(emptyItem);
      flash('Country added');
      await load();
    } catch (err) {
      flash(err?.response?.data?.message || 'Failed to add');
    } finally { setSaving(false); }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await updateMapCountry(editing.id, editing);
      setEditing(null);
      flash('Country updated');
      await load();
    } catch (err) {
      flash(err?.response?.data?.message || 'Failed to update');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}" from the map?`)) return;
    try {
      await deleteMapCountry(id);
      flash('Country deleted');
      await load();
    } catch { flash('Failed to delete'); }
  };

  if (loading) return <div className="text-eco-cream/40 text-sm">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-eco-cream font-bold">Map Countries</h1>
          <p className="text-eco-cream/40 text-sm">Markers on the Global Reach map. Dashed lines are drawn from the "home" country to each other marker.</p>
        </div>
        {!creating && (
          <button onClick={() => { setForm({ ...emptyItem, displayOrder: nextOrder }); setCreating(true); }}
                  className="bg-eco-gold text-eco-dark px-4 py-2 rounded-lg text-sm font-semibold hover:bg-eco-gold-dark transition-colors">
            + Add Country
          </button>
        )}
      </div>

      {msg && <div className="text-eco-gold text-sm mb-4 bg-eco-gold/10 rounded-lg px-4 py-2">{msg}</div>}

      {creating && (
        <div className="bg-white/[0.03] border border-eco-gold/15 rounded-xl p-5 mb-4">
          <div className="text-sm text-eco-gold font-medium mb-3">New Country</div>
          <CountryFormFields data={form} setData={setForm} idPrefix="create" />
          <div className="flex gap-2 mt-4">
            <button onClick={handleCreate} disabled={saving || !form.name}
                    className="bg-eco-gold text-eco-dark px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50">
              {saving ? 'Adding...' : 'Add'}
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
                <CountryFormFields data={editing} setData={setEditing} idPrefix={`edit-${item.id}`} />
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
                    <div className="text-eco-cream font-medium flex items-center gap-2">
                      {item.name}
                      {item.isHome && <span className="text-[0.6rem] text-eco-gold bg-eco-gold/15 px-2 py-0.5 rounded uppercase tracking-wider">Home</span>}
                    </div>
                    <div className="text-eco-cream/40 text-xs mt-0.5 font-mono">
                      {item.latitude.toFixed(2)}, {item.longitude.toFixed(2)} &middot; Order: {item.displayOrder}
                      {!item.isActive && <span className="text-red-400/60 ml-1">&middot; Inactive</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
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
      </div>
    </div>
  );
}
