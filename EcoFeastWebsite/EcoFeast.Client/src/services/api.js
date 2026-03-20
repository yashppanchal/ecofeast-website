import axios from 'axios';

// In dev, Vite proxies /api → localhost:5000
// In prod, same origin (served from .NET wwwroot)
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── PUBLIC ENDPOINTS (no auth) ────────────────────────────────

export async function fetchSiteData() {
  const { data } = await api.get('/public/sitedata');
  return data;
}

export async function submitContact(formData) {
  const { data } = await api.post('/public/contact', formData);
  return data;
}

// ─── AUTH ───────────────────────────────────────────────────────

export async function login(username, password) {
  const { data } = await api.post('/auth/login', { username, password });
  return data;
}

// ─── ADMIN ENDPOINTS (need JWT) ────────────────────────────────

function authHeaders() {
  const token = localStorage.getItem('ecofeast_token');
  return { Authorization: `Bearer ${token}` };
}

export async function getAdminStats() {
  const { data } = await api.get('/admin/stats', { headers: authHeaders() });
  return data;
}

export async function updateStat(id, statData) {
  const { data } = await api.put(`/admin/stats/${id}`, statData, { headers: authHeaders() });
  return data;
}

export async function getAdminProducts() {
  const { data } = await api.get('/admin/products', { headers: authHeaders() });
  return data;
}

export async function createProduct(productData) {
  const { data } = await api.post('/admin/products', productData, { headers: authHeaders() });
  return data;
}

export async function updateProduct(id, productData) {
  const { data } = await api.put(`/admin/products/${id}`, productData, { headers: authHeaders() });
  return data;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/admin/products/${id}`, { headers: authHeaders() });
  return data;
}

export async function uploadImage(file, folder = 'products') {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post(`/admin/upload?folder=${folder}`, formData, {
    headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' },
  });
  return data.url;
}

export async function getInquiries() {
  const { data } = await api.get('/admin/inquiries', { headers: authHeaders() });
  return data;
}

export async function markInquiryRead(id) {
  const { data } = await api.put(`/admin/inquiries/${id}/read`, {}, { headers: authHeaders() });
  return data;
}

// ─── STRENGTHS (Admin) ──────────────────────────────────────

export async function getAdminStrengths() {
  const { data } = await api.get('/admin/strengths', { headers: authHeaders() });
  return data;
}

export async function createStrength(strengthData) {
  const { data } = await api.post('/admin/strengths', strengthData, { headers: authHeaders() });
  return data;
}

export async function updateStrength(id, strengthData) {
  const { data } = await api.put(`/admin/strengths/${id}`, strengthData, { headers: authHeaders() });
  return data;
}

export async function deleteStrength(id) {
  const { data } = await api.delete(`/admin/strengths/${id}`, { headers: authHeaders() });
  return data;
}

// ─── SETTINGS (Admin) ───────────────────────────────────────

export async function getSettings() {
  const { data } = await api.get('/admin/settings', { headers: authHeaders() });
  return data;
}

export async function updateSetting(key, value) {
  const { data } = await api.put('/admin/settings', { key, value }, { headers: authHeaders() });
  return data;
}

// ─── ADMIN USERS (Admin) ────────────────────────────────────

export async function getAdminUsers() {
  const { data } = await api.get('/admin/users', { headers: authHeaders() });
  return data;
}

export async function createAdminUser(userData) {
  const { data } = await api.post('/admin/users', userData, { headers: authHeaders() });
  return data;
}

export async function changePassword(currentPassword, newPassword) {
  const { data } = await api.put('/admin/users/change-password', { currentPassword, newPassword }, { headers: authHeaders() });
  return data;
}

export async function deleteAdminUser(id) {
  const { data } = await api.delete(`/admin/users/${id}`, { headers: authHeaders() });
  return data;
}

export default api;
