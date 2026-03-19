import { useState, useEffect } from 'react';
import { getAdminProducts, createProduct, updateProduct, deleteProduct } from '../services/api';

const CATEGORIES = ['Fresh Vegetables', 'Fresh Fruits', 'Cereals', 'Spices', 'Processed Foods', 'Frozen'];

const emptyProduct = { name: '', hsCode: '', category: 'Fresh Vegetables', emoji: '', displayOrder: 0, isActive: true };

const inputClass = `w-full bg-white/[0.05] border border-eco-gold/15 rounded-lg px-3 py-2
                    text-eco-cream text-sm outline-none focus:border-eco-gold/40`;

function ProductFormFields({ data, setData, idPrefix }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Name</label>
        <input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} className={inputClass} placeholder="Fresh Onions" />
      </div>
      <div>
        <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">HS Code</label>
        <input value={data.hsCode} onChange={e => setData({ ...data, hsCode: e.target.value })} className={inputClass} placeholder="07031019" />
      </div>
      <div>
        <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Category</label>
        <select value={data.category} onChange={e => setData({ ...data, category: e.target.value })}
                className={inputClass + ' appearance-none'}>
          {CATEGORIES.map(c => <option key={c} value={c} className="bg-eco-dark">{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Display Order</label>
        <input type="number" value={data.displayOrder} onChange={e => setData({ ...data, displayOrder: parseInt(e.target.value) || 0 })} className={inputClass} />
      </div>
      {data.isActive !== undefined && (
        <div className="flex items-center gap-2 md:col-span-2">
          <input type="checkbox" checked={data.isActive} onChange={e => setData({ ...data, isActive: e.target.checked })}
                 className="accent-eco-gold" id={`${idPrefix}-active`} />
          <label htmlFor={`${idPrefix}-active`} className="text-sm text-eco-cream/60">Active (visible on website)</label>
        </div>
      )}
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyProduct);

  const nextOrder = products.length > 0 ? Math.max(...products.map(p => p.displayOrder)) + 1 : 1;
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    try { setProducts(await getAdminProducts()); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500); };

  const handleCreate = async () => {
    setSaving(true);
    try {
      await createProduct(form);
      setCreating(false);
      setForm(emptyProduct);
      flash('Product created');
      await load();
    } catch { flash('Failed to create'); }
    finally { setSaving(false); }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await updateProduct(editing.id, editing);
      setEditing(null);
      flash('Product updated');
      await load();
    } catch { flash('Failed to update'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      flash('Product deleted');
      await load();
    } catch { flash('Failed to delete'); }
  };

  if (loading) return <div className="text-eco-cream/40 text-sm">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-eco-cream font-bold">Products</h1>
          <p className="text-eco-cream/40 text-sm">Manage your product catalog.</p>
        </div>
        {!creating && (
          <button
            onClick={() => { setForm({ ...emptyProduct, displayOrder: nextOrder }); setCreating(true); }}
            className="bg-eco-gold text-eco-dark px-4 py-2 rounded-lg text-sm font-semibold
                       hover:bg-eco-gold-dark transition-colors"
          >
            + Add Product
          </button>
        )}
      </div>

      {msg && <div className="text-eco-gold text-sm mb-4 bg-eco-gold/10 rounded-lg px-4 py-2">{msg}</div>}

      {creating && (
        <div className="bg-white/[0.03] border border-eco-gold/15 rounded-xl p-5 mb-4">
          <div className="text-sm text-eco-gold font-medium mb-3">New Product</div>
          <ProductFormFields data={form} setData={setForm} idPrefix="create" />
          <div className="flex gap-2 mt-4">
            <button onClick={handleCreate} disabled={saving}
                    className="bg-eco-gold text-eco-dark px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50">
              {saving ? 'Creating...' : 'Create'}
            </button>
            <button onClick={() => { setCreating(false); setForm(emptyProduct); }}
                    className="text-eco-cream/40 px-4 py-1.5 rounded-lg text-sm hover:text-eco-cream/70">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {products.map(p => (
          <div key={p.id} className="bg-white/[0.03] border border-eco-gold/[0.08] rounded-xl p-5">
            {editing?.id === p.id ? (
              <div>
                <ProductFormFields data={editing} setData={setEditing} idPrefix={`edit-${p.id}`} />
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
                  <div className={`w-2 h-2 rounded-full ${p.isActive ? 'bg-green-400' : 'bg-red-400/50'}`} />
                  <div>
                    <div className="text-eco-cream font-medium">{p.name}</div>
                    <div className="text-eco-cream/40 text-xs">
                      {p.category} &middot; HS: {p.hsCode} &middot; Order: {p.displayOrder}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing({ ...p })}
                          className="text-eco-gold/50 hover:text-eco-gold text-sm px-3 py-1.5 rounded-lg hover:bg-eco-gold/10 transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.id, p.name)}
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
