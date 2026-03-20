import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { fetchSiteData } from './services/api';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProductsSection from './components/ProductsSection';
import StrengthsSection from './components/StrengthsSection';
import CertificationsSection from './components/CertificationsSection';
import GlobalReachSection from './components/GlobalReachSection';
import GallerySection from './components/GallerySection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import SectionWrapper from './components/SectionWrapper';

import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminStats from './admin/AdminStats';
import AdminProducts from './admin/AdminProducts';
import AdminStrengths from './admin/AdminStrengths';
import AdminInquiries from './admin/AdminInquiries';
import AdminSettings from './admin/AdminSettings';
import AdminUsers from './admin/AdminUsers';
import AdminGallery from './admin/AdminGallery';

// ─── Fallback data (used if API is unreachable during dev) ─────
const FALLBACK = {
  stats: [
    { id: 1, label: 'Trades Completed', value: 150, suffix: '+', displayOrder: 1 },
    { id: 2, label: 'Happy Buyers', value: 45, suffix: '+', displayOrder: 2 },
    { id: 3, label: 'Countries Served', value: 12, suffix: '', displayOrder: 3 },
    { id: 4, label: 'Products Exported', value: 11, suffix: '', displayOrder: 4 },
  ],
  products: [
    { id: 1, name: 'Fresh Onions', hsCode: '07031019', category: 'Fresh Vegetables', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80', description: 'Export grade red & white onions', price: 280, currency: 'USD', priceUnit: '/MT', displayOrder: 1 },
    { id: 2, name: 'Alphonso Mangoes', hsCode: '08045021', category: 'Fresh Fruits', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&q=80', description: 'Premium Ratnagiri Alphonso', price: 1200, currency: 'USD', priceUnit: '/MT', displayOrder: 2 },
    { id: 3, name: 'Pomegranates', hsCode: '08109010', category: 'Fresh Fruits', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80', description: 'Premium Bhagwa variety', price: 1500, currency: 'USD', priceUnit: '/MT', displayOrder: 3 },
    { id: 4, name: 'Fresh Grapes', hsCode: '08061000', category: 'Fresh Fruits', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&q=80', description: 'Thompson seedless, Sharad seedless', price: 600, currency: 'USD', priceUnit: '/MT', displayOrder: 4 },
    { id: 5, name: 'Fresh Bananas', hsCode: '08039010', category: 'Fresh Fruits', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&q=80', description: 'Cavendish G9 variety', price: 350, currency: 'USD', priceUnit: '/MT', displayOrder: 5 },
    { id: 6, name: 'Green Chilly', hsCode: '07096010', category: 'Fresh Vegetables', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=600&q=80', description: 'Fresh green chillies', price: 400, currency: 'USD', priceUnit: '/MT', displayOrder: 6 },
    { id: 7, name: 'Basmati Rice', hsCode: '10063020', category: 'Cereals', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80', description: '1121 & Pusa varieties', price: 950, currency: 'USD', priceUnit: '/MT', displayOrder: 7 },
    { id: 8, name: 'Chilly Powder', hsCode: '09042211', category: 'Spices', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&q=80', description: 'Guntur, Kashmiri, Byadgi', price: 850, currency: 'USD', priceUnit: '/MT', displayOrder: 8 },
    { id: 9, name: 'Ladoos', hsCode: '21069099', category: 'Processed Foods', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1666190403330-01e5e45b4e57?w=600&q=80', description: 'Traditional Indian sweets', price: 500, currency: 'USD', priceUnit: '/MT', displayOrder: 9 },
    { id: 10, name: 'Sweet Corn Frozen', hsCode: '07104000', category: 'Frozen', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80', description: 'IQF frozen, bulk packing', price: 450, currency: 'USD', priceUnit: '/MT', displayOrder: 10 },
    { id: 11, name: 'Mix Vegetables Frozen', hsCode: '07109000', category: 'Frozen', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80', description: 'IQF mixed vegetables', price: 480, currency: 'USD', priceUnit: '/MT', displayOrder: 11 },
  ],
  strengths: [
    { id: 1, title: 'Established Supplier', description: 'Proven track record in fresh onion exports with consistent domestic and international supply chain.', displayOrder: 1 },
    { id: 2, title: 'Pan-India Sourcing', description: 'Strong procurement network across major agricultural belts — Maharashtra, Gujarat, Karnataka, and more.', displayOrder: 2 },
    { id: 3, title: 'Quality & Safety', description: 'FSSAI licensed, APEDA registered, with lab testing and inspections per destination country standards.', displayOrder: 3 },
    { id: 4, title: 'Logistics Excellence', description: 'End-to-end export documentation, FOB/CIF/CFR support, and a reliable freight partner network.', displayOrder: 4 },
    { id: 5, title: 'Custom Packaging', description: 'Bulk packing in 10kg, 25kg, 50kg bags with custom labeling options for buyer specifications.', displayOrder: 5 },
    { id: 6, title: 'Long-term Partners', description: 'We build relationships, not transactions. Flexible planning, repeat supply, and after-sales coordination.', displayOrder: 6 },
  ],
  gallery: [],
  settings: {
    phone: '+91 96531 56090',
    email: 'ecofeastnutrients@gmail.com',
    address: 'B 504, Navbhagyashree, Mahatma Phule Road, Mulund(E), Mumbai - 81',
    contactPerson: 'Kaustubh Chavan',
    contactTitle: 'Director',
    contactPerson2: 'Chaitanya Asarkar',
    contactTitle2: 'Director',
    phone2: '+91 83692 95601',
  },
};

// ─── Public website ──────────────────────────────────────────
function Website() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const siteData = await fetchSiteData();
        setData(siteData);
      } catch (err) {
        console.warn('API unavailable, using fallback data:', err.message);
        setData(FALLBACK);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="bg-eco-dark text-eco-cream font-body min-h-screen overflow-hidden">
      <Navbar />
      <HeroSection stats={data.stats} />
      <SectionWrapper index={0}><AboutSection /></SectionWrapper>
      <SectionWrapper index={1}><ProductsSection products={data.products} /></SectionWrapper>
      <SectionWrapper index={2}><StrengthsSection strengths={data.strengths} /></SectionWrapper>
      <SectionWrapper index={3}><CertificationsSection /></SectionWrapper>
      <SectionWrapper index={4}><GallerySection gallery={data.gallery || []} /></SectionWrapper>
      <SectionWrapper index={5}><GlobalReachSection /></SectionWrapper>
      <SectionWrapper index={6}><ContactSection settings={data.settings} /></SectionWrapper>
      <Footer settings={data.settings} />
    </div>
  );
}

// ─── App with routing ────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public website */}
        <Route path="/" element={<Website />} />

        {/* Admin login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin panel (protected) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="stats" element={<AdminStats />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="strengths" element={<AdminStrengths />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
