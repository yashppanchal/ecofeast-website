import { useState, useEffect, useRef } from 'react';
import { getAdminGallery, createGalleryImage, updateGalleryImage, deleteGalleryImage, uploadImage } from '../services/api';

const CATEGORIES = ['Fresh Vegetables', 'Fresh Fruits', 'Cereals', 'Spices', 'Processed Foods', 'Frozen'];

const emptyImage = { title: '', imageUrl: '', category: 'Fresh Vegetables', displayOrder: 0, isActive: true };

const inputClass = `w-full bg-white/[0.05] border border-eco-gold/15 rounded-lg px-3 py-2
                    text-eco-cream text-sm outline-none focus:border-eco-gold/40`;

/* ─── Image Upload Component ───────────────────────────────── */
function GalleryUploader({ imageUrl, onUploaded }) {
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
    if (file.size > 3 * 1024 * 1024) {
      setError('Max file size is 3MB');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const url = await uploadImage(file, 'gallery');
      onUploaded(url);
    } catch {
      setError('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Image</label>
      <div
        className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all
          ${dragOver ? 'border-eco-gold bg-eco-gold/10' : 'border-eco-gold/20 hover:border-eco-gold/40'}
          ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
               onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }} />
        {imageUrl && imageUrl.trim() !== '' ? (
          <div className="flex items-center gap-4">
            <img src={imageUrl} alt="" className="w-20 h-20 object-cover rounded-lg border border-eco-gold/20"
                 onError={(e) => { e.target.style.display = 'none'; }} />
            <div className="text-left flex-1">
              <div className="text-eco-cream/60 text-xs mb-1">Image uploaded</div>
              <button type="button" onClick={(e) => { e.stopPropagation(); onUploaded(''); }}
                      className="text-red-400/60 text-xs hover:text-red-400">Remove</button>
            </div>
          </div>
        ) : (
          <div>
            <svg className="w-8 h-8 mx-auto mb-2 text-eco-gold/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <div className="text-eco-cream/40 text-xs">{uploading ? 'Uploading...' : 'Click or drag image here'}</div>
            <div className="text-eco-cream/20 text-[0.6rem] mt-1">JPG, PNG, WebP, GIF, SVG — max 3MB</div>
          </div>
        )}
      </div>
      {error && <div className="text-red-400 text-xs mt-1">{error}</div>}
    </div>
  );
}

/* ─── Form Fields ──────────────────────────────────────────── */
function GalleryFormFields({ data, setData, idPrefix }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Title</label>
        <input value={data.title} onChange={e => setData({ ...data, title: e.target.value })} className={inputClass} placeholder="Fresh Red Onions" />
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
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={data.isActive} onChange={e => setData({ ...data, isActive: e.target.checked })}
                 className="accent-eco-gold" id={`${idPrefix}-active`} />
          <label htmlFor={`${idPrefix}-active`} className="text-sm text-eco-cream/60">Active</label>
        </div>
      )}
      <div className="md:col-span-2">
        <GalleryUploader imageUrl={data.imageUrl || ''} onUploaded={(url) => setData({ ...data, imageUrl: url })} />
      </div>
    </div>
  );
}

/* ─── Main Admin Gallery Page ──────────────────────────────── */
export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyImage);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [filterCat, setFilterCat] = useState('All');

  const nextOrder = images.length > 0 ? Math.max(...images.map(i => i.displayOrder)) + 1 : 1;

  useEffect(() => { load(); }, []);

  async function load() {
    try { setImages(await getAdminGallery()); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500); };

  const handleCreate = async () => {
    if (!form.imageUrl) { flash('Please upload an image'); return; }
    setSaving(true);
    try {
      await createGalleryImage(form);
      setCreating(false);
      setForm(emptyImage);
      flash('Image added');
      await load();
    } catch { flash('Failed to create'); }
    finally { setSaving(false); }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await updateGalleryImage(editing.id, editing);
      setEditing(null);
      flash('Image updated');
      await load();
    } catch { flash('Failed to update'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteGalleryImage(id);
      flash('Image deleted');
      await load();
    } catch { flash('Failed to delete'); }
  };

  const filtered = filterCat === 'All' ? images : images.filter(i => i.category === filterCat);
  const allCategories = ['All', ...new Set(images.map(i => i.category))];

  if (loading) return <div className="text-eco-cream/40 text-sm">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-eco-cream font-bold">Gallery</h1>
          <p className="text-eco-cream/40 text-sm">Manage gallery images. Max 3MB per image.</p>
        </div>
        {!creating && (
          <button
            onClick={() => { setForm({ ...emptyImage, displayOrder: nextOrder }); setCreating(true); }}
            className="bg-eco-gold text-eco-dark px-4 py-2 rounded-lg text-sm font-semibold hover:bg-eco-gold-dark transition-colors"
          >
            + Add Image
          </button>
        )}
      </div>

      {msg && <div className="text-eco-gold text-sm mb-4 bg-eco-gold/10 rounded-lg px-4 py-2">{msg}</div>}

      {creating && (
        <div className="bg-white/[0.03] border border-eco-gold/15 rounded-xl p-5 mb-4">
          <div className="text-sm text-eco-gold font-medium mb-3">New Gallery Image</div>
          <GalleryFormFields data={form} setData={setForm} idPrefix="create" />
          <div className="flex gap-2 mt-4">
            <button onClick={handleCreate} disabled={saving}
                    className="bg-eco-gold text-eco-dark px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50">
              {saving ? 'Adding...' : 'Add Image'}
            </button>
            <button onClick={() => { setCreating(false); setForm(emptyImage); }}
                    className="text-eco-cream/40 px-4 py-1.5 rounded-lg text-sm hover:text-eco-cream/70">Cancel</button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {allCategories.map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)}
                  className={`px-3 py-1 rounded-full text-xs border whitespace-nowrap transition-all ${
                    filterCat === cat
                      ? 'bg-eco-gold/15 text-eco-gold border-eco-gold/40'
                      : 'text-eco-cream/40 border-eco-gold/10 hover:border-eco-gold/25'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map(img => (
          <div key={img.id} className="bg-white/[0.03] border border-eco-gold/[0.08] rounded-xl overflow-hidden">
            {editing?.id === img.id ? (
              <div className="p-4">
                <GalleryFormFields data={editing} setData={setEditing} idPrefix={`edit-${img.id}`} />
                <div className="flex gap-2 mt-3">
                  <button onClick={handleUpdate} disabled={saving}
                          className="bg-eco-gold text-eco-dark px-3 py-1 rounded-lg text-xs font-semibold disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setEditing(null)}
                          className="text-eco-cream/40 px-3 py-1 rounded-lg text-xs hover:text-eco-cream/70">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="aspect-[4/3] relative">
                  <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
                  {!img.isActive && (
                    <div className="absolute top-2 left-2 bg-red-500/80 text-white text-[0.55rem] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Inactive
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-eco-cream text-sm font-medium truncate">{img.title}</div>
                  <div className="text-eco-cream/40 text-xs">{img.category}</div>
                  <div className="flex gap-1 mt-2">
                    <button onClick={() => setEditing({ ...img })}
                            className="text-eco-gold/50 hover:text-eco-gold text-xs px-2 py-1 rounded hover:bg-eco-gold/10">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(img.id, img.title)}
                            className="text-red-400/50 hover:text-red-400 text-xs px-2 py-1 rounded hover:bg-red-400/10">
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-eco-cream/30 text-sm py-12">
          No gallery images yet. Click "+ Add Image" to upload your first.
        </div>
      )}
    </div>
  );
}
