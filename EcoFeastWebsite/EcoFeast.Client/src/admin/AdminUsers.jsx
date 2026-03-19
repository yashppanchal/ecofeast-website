import { useState, useEffect } from 'react';
import { getAdminUsers, createAdminUser, deleteAdminUser, changePassword } from '../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success');
  const [saving, setSaving] = useState(false);

  // New user form
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', email: '' });

  // Change password form
  const [showChangePw, setShowChangePw] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => { load(); }, []);

  async function load() {
    try { setUsers(await getAdminUsers()); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const flash = (m, type = 'success') => { setMsg(m); setMsgType(type); setTimeout(() => setMsg(''), 3000); };

  const handleCreateUser = async () => {
    if (!newUser.username.trim() || !newUser.password.trim() || !newUser.email.trim()) {
      flash('All fields are required', 'error'); return;
    }
    if (newUser.password.length < 6) {
      flash('Password must be at least 6 characters', 'error'); return;
    }
    setSaving(true);
    try {
      await createAdminUser(newUser);
      setShowCreate(false);
      setNewUser({ username: '', password: '', email: '' });
      flash('Admin user created');
      await load();
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to create user', 'error');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword) {
      flash('Both password fields are required', 'error'); return;
    }
    if (pwForm.newPassword.length < 6) {
      flash('New password must be at least 6 characters', 'error'); return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      flash('New passwords do not match', 'error'); return;
    }
    setSaving(true);
    try {
      await changePassword(pwForm.currentPassword, pwForm.newPassword);
      setShowChangePw(false);
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      flash('Password changed successfully');
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to change password', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, username) => {
    if (!confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    try {
      await deleteAdminUser(id);
      flash('User deleted');
      await load();
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  const inputClass = `w-full bg-white/[0.05] border border-eco-gold/15 rounded-lg px-3 py-2
                      text-eco-cream text-sm outline-none focus:border-eco-gold/40`;

  const currentUser = localStorage.getItem('ecofeast_user');

  if (loading) return <div className="text-eco-cream/40 text-sm">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-eco-cream font-bold">User Management</h1>
          <p className="text-eco-cream/40 text-sm">Manage admin accounts and passwords.</p>
        </div>
        <div className="flex gap-2">
          {!showChangePw && (
            <button onClick={() => setShowChangePw(true)}
                    className="bg-white/[0.05] text-eco-cream/70 px-4 py-2 rounded-lg text-sm font-medium
                               hover:bg-white/[0.08] transition-colors">
              Change Password
            </button>
          )}
          {!showCreate && (
            <button onClick={() => setShowCreate(true)}
                    className="bg-eco-gold text-eco-dark px-4 py-2 rounded-lg text-sm font-semibold
                               hover:bg-eco-gold-dark transition-colors">
              + Add User
            </button>
          )}
        </div>
      </div>

      {msg && (
        <div className={`text-sm mb-4 rounded-lg px-4 py-2 ${
          msgType === 'error'
            ? 'text-red-400 bg-red-500/10 border border-red-500/20'
            : 'text-eco-gold bg-eco-gold/10'
        }`}>
          {msg}
        </div>
      )}

      {/* Change Password Form */}
      {showChangePw && (
        <div className="bg-white/[0.03] border border-eco-gold/15 rounded-xl p-5 mb-4">
          <div className="text-sm text-eco-gold font-medium mb-3">Change Your Password</div>
          <div className="flex flex-col gap-3 max-w-sm">
            <div>
              <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Current Password</label>
              <input type="password" value={pwForm.currentPassword}
                     onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                     className={inputClass} placeholder="Enter current password" />
            </div>
            <div>
              <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">New Password</label>
              <input type="password" value={pwForm.newPassword}
                     onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                     className={inputClass} placeholder="Enter new password (min 6 chars)" />
            </div>
            <div>
              <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Confirm New Password</label>
              <input type="password" value={pwForm.confirmPassword}
                     onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                     className={inputClass} placeholder="Confirm new password" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleChangePassword} disabled={saving}
                    className="bg-eco-gold text-eco-dark px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50">
              {saving ? 'Changing...' : 'Change Password'}
            </button>
            <button onClick={() => { setShowChangePw(false); setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}
                    className="text-eco-cream/40 px-4 py-1.5 rounded-lg text-sm hover:text-eco-cream/70">Cancel</button>
          </div>
        </div>
      )}

      {/* Create User Form */}
      {showCreate && (
        <div className="bg-white/[0.03] border border-eco-gold/15 rounded-xl p-5 mb-4">
          <div className="text-sm text-eco-gold font-medium mb-3">New Admin User</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Username</label>
              <input value={newUser.username}
                     onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                     className={inputClass} placeholder="e.g. kaustubh" />
            </div>
            <div>
              <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Email</label>
              <input type="email" value={newUser.email}
                     onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                     className={inputClass} placeholder="e.g. kaustubh@ecofeast.com" />
            </div>
            <div>
              <label className="block text-[0.65rem] text-eco-gold uppercase tracking-wider mb-1">Password</label>
              <input type="password" value={newUser.password}
                     onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                     className={inputClass} placeholder="Min 6 characters" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleCreateUser} disabled={saving}
                    className="bg-eco-gold text-eco-dark px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50">
              {saving ? 'Creating...' : 'Create User'}
            </button>
            <button onClick={() => { setShowCreate(false); setNewUser({ username: '', password: '', email: '' }); }}
                    className="text-eco-cream/40 px-4 py-1.5 rounded-lg text-sm hover:text-eco-cream/70">Cancel</button>
          </div>
        </div>
      )}

      {/* User List */}
      <div className="grid gap-3">
        {users.map(u => (
          <div key={u.id} className="bg-white/[0.03] border border-eco-gold/[0.08] rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-eco-gold/10 flex items-center justify-center text-eco-gold font-semibold text-sm">
                  {u.username[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-eco-cream font-medium flex items-center gap-2">
                    {u.username}
                    {u.username === currentUser && (
                      <span className="text-[0.6rem] bg-eco-gold/15 text-eco-gold px-2 py-0.5 rounded">You</span>
                    )}
                  </div>
                  <div className="text-eco-cream/40 text-xs">{u.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[0.65rem] text-eco-cream/25">
                  Created {new Date(u.createdAt).toLocaleDateString()}
                </div>
                {u.username !== currentUser && (
                  <button onClick={() => handleDelete(u.id, u.username)}
                          className="text-red-400/50 hover:text-red-400 text-sm px-3 py-1.5 rounded-lg
                                     hover:bg-red-400/10 transition-colors">
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
