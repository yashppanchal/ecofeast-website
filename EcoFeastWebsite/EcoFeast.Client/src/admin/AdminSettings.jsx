import { useState, useEffect } from 'react';
import { getSettings, updateSetting, deleteSetting } from '../services/api';

const SETTING_LABELS = {
  tagline: 'Tagline',
  phone: 'Phone (Director 1)',
  email: 'Email',
  address: 'Address',
  contactPerson: 'Director 1 Name',
  contactTitle: 'Director 1 Title',
  contactPerson2: 'Director 2 Name',
  contactTitle2: 'Director 2 Title',
  phone2: 'Phone (Director 2)',
};

const SETTING_ORDER = [
  'tagline', 'contactPerson', 'contactTitle', 'phone',
  'contactPerson2', 'contactTitle2', 'phone2',
  'email', 'address',
];

export default function AdminSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    try { setSettings(await getSettings()); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500); };

  const handleSave = async (key) => {
    setSaving(true);
    try {
      await updateSetting(key, editValue);
      setEditing(null);
      flash('Setting updated');
      await load();
    } catch { flash('Failed to update'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, key) => {
    if (!window.confirm(`Delete setting "${key}"?`)) return;
    try {
      await deleteSetting(id);
      flash('Setting deleted');
      await load();
    } catch { flash('Failed to delete'); }
  };

  const handleAddNew = async () => {
    if (!newKey.trim() || !newValue.trim()) return;
    setSaving(true);
    try {
      await updateSetting(newKey.trim(), newValue.trim());
      setNewKey('');
      setNewValue('');
      flash('Setting added');
      await load();
    } catch { flash('Failed to add'); }
    finally { setSaving(false); }
  };

  // Sort settings by the predefined order, unknown keys go to the end
  const sortedSettings = [...settings].sort((a, b) => {
    const ai = SETTING_ORDER.indexOf(a.key);
    const bi = SETTING_ORDER.indexOf(b.key);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  const inputClass = `w-full bg-white/[0.05] border border-eco-gold/15 rounded-lg px-3 py-2
                      text-eco-cream text-sm outline-none focus:border-eco-gold/40`;

  if (loading) return <div className="text-eco-cream/40 text-sm">Loading...</div>;

  return (
    <div>
      <h1 className="font-display text-2xl text-eco-cream font-bold mb-1">Site Settings</h1>
      <p className="text-eco-cream/40 text-sm mb-6">Manage contact details, tagline, and other site-wide settings.</p>

      {msg && <div className="text-eco-gold text-sm mb-4 bg-eco-gold/10 rounded-lg px-4 py-2">{msg}</div>}

      <div className="grid gap-3 mb-8">
        {sortedSettings.map(s => (
          <div key={s.id} className="bg-white/[0.03] border border-eco-gold/[0.08] rounded-xl p-4">
            {editing === s.key ? (
              <div>
                <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1.5">
                  {SETTING_LABELS[s.key] || s.key}
                </label>
                {s.value.length > 80 ? (
                  <textarea value={editValue} onChange={e => setEditValue(e.target.value)}
                            rows={3} className={inputClass + ' resize-y'} />
                ) : (
                  <input value={editValue} onChange={e => setEditValue(e.target.value)} className={inputClass} />
                )}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleSave(s.key)} disabled={saving}
                          className="bg-eco-gold text-eco-dark px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setEditing(null)}
                          className="text-eco-cream/40 px-4 py-1.5 rounded-lg text-sm hover:text-eco-cream/70">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[0.65rem] text-eco-gold uppercase tracking-wider mb-0.5">
                    {SETTING_LABELS[s.key] || s.key}
                  </div>
                  <div className="text-sm text-eco-cream/70 truncate">{s.value}</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => { setEditing(s.key); setEditValue(s.value); }}
                    className="text-eco-gold/50 hover:text-eco-gold text-sm px-3 py-1.5 rounded-lg
                               hover:bg-eco-gold/10 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id, s.key)}
                    className="text-red-400/50 hover:text-red-400 text-sm px-3 py-1.5 rounded-lg
                               hover:bg-red-400/10 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add new setting */}
      <div className="bg-white/[0.03] border border-eco-gold/[0.08] rounded-xl p-5">
        <div className="text-sm text-eco-gold font-medium mb-3">Add New Setting</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Key</label>
            <input value={newKey} onChange={e => setNewKey(e.target.value)} className={inputClass} placeholder="e.g. facebook" />
          </div>
          <div>
            <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Value</label>
            <input value={newValue} onChange={e => setNewValue(e.target.value)} className={inputClass} placeholder="e.g. https://facebook.com/ecofeast" />
          </div>
        </div>
        <button onClick={handleAddNew} disabled={saving || !newKey.trim()}
                className="bg-eco-gold/10 text-eco-gold px-4 py-1.5 rounded-lg text-sm font-medium mt-3
                           hover:bg-eco-gold/20 transition-colors disabled:opacity-30">
          Add Setting
        </button>
      </div>
    </div>
  );
}
