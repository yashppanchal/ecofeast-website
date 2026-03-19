import { useState, useEffect } from 'react';
import { fetchSiteData } from './services/api';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProductsSection from './components/ProductsSection';
import StrengthsSection from './components/StrengthsSection';
import CertificationsSection from './components/CertificationsSection';
import GlobalReachSection from './components/GlobalReachSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

// ─── Fallback data (used if API is unreachable during dev) ─────
const FALLBACK = {
  stats: [
    { id: 1, label: 'Trades Completed', value: 150, suffix: '+', displayOrder: 1 },
    { id: 2, label: 'Happy Buyers', value: 45, suffix: '+', displayOrder: 2 },
    { id: 3, label: 'Countries Served', value: 12, suffix: '', displayOrder: 3 },
    { id: 4, label: 'Products Exported', value: 11, suffix: '', displayOrder: 4 },
  ],
  products: [
    { id: 1, name: 'Fresh Onions', hsCode: '07031019', category: 'Fresh Vegetables', emoji: '🧅', displayOrder: 1 },
    { id: 2, name: 'Alphonso Mangoes', hsCode: '08045021', category: 'Fresh Fruits', emoji: '🥭', displayOrder: 2 },
    { id: 3, name: 'Pomegranates', hsCode: '08109010', category: 'Fresh Fruits', emoji: '🍎', displayOrder: 3 },
    { id: 4, name: 'Fresh Grapes', hsCode: '08061000', category: 'Fresh Fruits', emoji: '🍇', displayOrder: 4 },
    { id: 5, name: 'Fresh Bananas', hsCode: '08039010', category: 'Fresh Fruits', emoji: '🍌', displayOrder: 5 },
    { id: 6, name: 'Green Chilly', hsCode: '07096010', category: 'Fresh Vegetables', emoji: '🌶️', displayOrder: 6 },
    { id: 7, name: 'Basmati Rice', hsCode: '10063020', category: 'Cereals', emoji: '🍚', displayOrder: 7 },
    { id: 8, name: 'Chilly Powder', hsCode: '09042211', category: 'Spices', emoji: '🫙', displayOrder: 8 },
    { id: 9, name: 'Ladoos', hsCode: '21069099', category: 'Processed Foods', emoji: '🍬', displayOrder: 9 },
    { id: 10, name: 'Sweet Corn Frozen', hsCode: '07104000', category: 'Frozen', emoji: '🌽', displayOrder: 10 },
    { id: 11, name: 'Mix Vegetables Frozen', hsCode: '07109000', category: 'Frozen', emoji: '🥦', displayOrder: 11 },
  ],
  strengths: [
    { id: 1, title: 'Established Supplier', description: 'Proven track record in fresh onion exports with consistent domestic and international supply chain.', displayOrder: 1 },
    { id: 2, title: 'Pan-India Sourcing', description: 'Strong procurement network across major agricultural belts — Maharashtra, Gujarat, Karnataka, and more.', displayOrder: 2 },
    { id: 3, title: 'Quality & Safety', description: 'FSSAI licensed, APEDA registered, with lab testing and inspections per destination country standards.', displayOrder: 3 },
    { id: 4, title: 'Logistics Excellence', description: 'End-to-end export documentation, FOB/CIF/CFR support, and a reliable freight partner network.', displayOrder: 4 },
    { id: 5, title: 'Custom Packaging', description: 'Bulk packing in 10kg, 25kg, 50kg bags with custom labeling options for buyer specifications.', displayOrder: 5 },
    { id: 6, title: 'Long-term Partners', description: 'We build relationships, not transactions. Flexible planning, repeat supply, and after-sales coordination.', displayOrder: 6 },
  ],
  settings: {
    phone: '+91 96531 56090',
    email: 'ecofeastnutrients@gmail.com',
    address: 'B 504, Navbhagyashree, Mahatma Phule Road, Mulund(E), Mumbai - 81',
    contactPerson: 'Kaustubh Chavan',
    contactTitle: 'Director',
  },
};

export default function App() {
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
      <AboutSection />
      <ProductsSection products={data.products} />
      <StrengthsSection strengths={data.strengths} />
      <CertificationsSection />
      <GlobalReachSection />
      <ContactSection settings={data.settings} />
      <Footer />
    </div>
  );
}
