import { useState, useEffect, useRef } from 'react';
import { getAdminProducts, createProduct, updateProduct, deleteProduct, uploadImage, getAdminCategories } from '../services/api';

const FALLBACK_CATEGORIES = ['Fresh Vegetables', 'Fresh Fruits', 'Cereals', 'Spices', 'Processed Foods', 'Frozen'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'AED'];

const emptyProduct = {
  name: '', hsCode: '', category: 'Fresh Vegetables', emoji: '',
  imageUrl: '', description: '', price: 0, currency: 'USD', priceUnit: '/MT',
  displayOrder: 0, isActive: true
};

const inputClass = `w-full bg-white/[0.05] border border-eco-gold/15 rounded-lg px-3 py-2
                    text-eco-cream text-sm outline-none focus:border-eco-gold/40`;

/* ─── Image Upload Component ───────────────────────────────── */
function ImageUploader({ imageUrl, onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      setError('Only JPG, PNG, WebP, GIF, SVG allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Max file size is 5MB');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onUploaded(url);
    } catch (err) {
      setError('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const onChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
    e.target.value = '';
  };

  return (
    <div>
      <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Product Image</label>
      <div
        className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all
          ${dragOver ? 'border-eco-gold bg-eco-gold/10' : 'border-eco-gold/20 hover:border-eco-gold/40'}
          ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />

        {imageUrl && imageUrl.trim() !== '' ? (
          <div className="flex items-center gap-4">
            <img
              src={imageUrl}
              alt="Product"
              className="w-20 h-20 object-cover rounded-lg border border-eco-gold/20"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="text-left flex-1">
              <div className="text-eco-cream/60 text-xs mb-1">Image uploaded</div>
              <div className="text-eco-cream/30 text-[0.65rem] break-all">{imageUrl}</div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onUploaded(''); }}
                className="text-red-400/60 text-xs mt-1 hover:text-red-400"
              >
                Remove image
              </button>
            </div>
          </div>
        ) : (
          <div>
            <svg className="w-8 h-8 mx-auto mb-2 text-eco-gold/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <div className="text-eco-cream/40 text-xs">
              {uploading ? 'Uploading...' : 'Click or drag & drop image here'}
            </div>
            <div className="text-eco-cream/20 text-[0.6rem] mt-1">JPG, PNG, WebP, GIF, SVG — max 5MB</div>
          </div>
        )}
      </div>
      {error && <div className="text-red-400 text-xs mt-1">{error}</div>}
    </div>
  );
}

/* ─── Product Form Fields ──────────────────────────────────── */
function ProductFormFields({ data, setData, idPrefix, categories }) {
  // Include the current product's category even if it's no longer in the list
  // (so renamed/deleted categories don't silently swap to the first option).
  const options = data.category && !categories.includes(data.category)
    ? [data.category, ...categories]
    : categories;

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
          {options.map(c => <option key={c} value={c} className="bg-eco-dark">{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Display Order</label>
        <input type="number" value={data.displayOrder} onChange={e => setData({ ...data, displayOrder: parseInt(e.target.value) || 0 })} className={inputClass} />
      </div>
      <div className="md:col-span-2">
        <ImageUploader
          imageUrl={data.imageUrl || ''}
          onUploaded={(url) => setData({ ...data, imageUrl: url })}
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Description</label>
        <input value={data.description || ''} onChange={e => setData({ ...data, description: e.target.value })} className={inputClass} placeholder="Export grade, premium quality..." />
      </div>
      <div>
        <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Price</label>
        <input type="number" step="0.01" value={data.price || 0} onChange={e => setData({ ...data, price: parseFloat(e.target.value) || 0 })} className={inputClass} placeholder="280" />
      </div>
      <div>
        <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Currency</label>
        <select value={data.currency || 'USD'} onChange={e => setData({ ...data, currency: e.target.value })}
                className={inputClass + ' appearance-none'}>
          {CURRENCIES.map(c => <option key={c} value={c} className="bg-eco-dark">{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Price Unit <span className="normal-case text-eco-cream/30">(leave empty to hide)</span></label>
        <input value={data.priceUnit || ''} onChange={e => setData({ ...data, priceUnit: e.target.value })} className={inputClass} placeholder="/MT, /KG, /Piece" />
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

/* ─── Main AdminProducts Page ──────────────────────────────── */
export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyProduct);

  const nextOrder = products.length > 0 ? Math.max(...products.map(p => p.displayOrder)) + 1 : 1;
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const [prods, cats] = await Promise.all([getAdminProducts(), getAdminCategories()]);
      setProducts(prods);
      const activeNames = cats.filter(c => c.isActive).map(c => c.name);
      if (activeNames.length > 0) setCategories(activeNames);
    } catch (err) { console.error(err); }
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
            onClick={() => { setForm({ ...emptyProduct, category: categories[0] || emptyProduct.category, displayOrder: nextOrder }); setCreating(true); }}
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
          <ProductFormFields data={form} setData={setForm} idPrefix="create" categories={categories} />
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
                <ProductFormFields data={editing} setData={setEditing} idPrefix={`edit-${p.id}`} categories={categories} />
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
                  {p.imageUrl && p.imageUrl.trim() !== '' ? (
                    <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-eco-gold/15" />
                  ) : (
                    <div className={`w-10 h-10 rounded-lg border border-eco-gold/10 flex items-center justify-center`}>
                      <div className={`w-2 h-2 rounded-full ${p.isActive ? 'bg-green-400' : 'bg-red-400/50'}`} />
                    </div>
                  )}
                  <div>
                    <div className="text-eco-cream font-medium flex items-center gap-2">
                      {p.name}
                      {p.price > 0 && (
                        <span className="text-eco-gold text-xs font-normal">
                          {p.currency === 'INR' ? '\u20B9' : p.currency === 'EUR' ? '\u20AC' : p.currency === 'GBP' ? '\u00A3' : p.currency === 'AED' ? 'AED ' : '$'}
                          {p.price.toLocaleString()}{p.priceUnit || ''}
                        </span>
                      )}
                    </div>
                    <div className="text-eco-cream/40 text-xs">
                      {p.category} &middot; HS: {p.hsCode} &middot; Order: {p.displayOrder}
                      {!p.isActive && <span className="text-red-400/60 ml-1">&middot; Inactive</span>}
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
