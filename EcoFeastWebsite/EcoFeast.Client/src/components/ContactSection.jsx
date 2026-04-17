import { useState } from 'react';
import { useInView } from '../hooks/useAnimations';
import { submitContact } from '../services/api';
import SocialLinks from './SocialLinks';

export default function ContactSection({ settings }) {
  const [contactRef, contactInView] = useInView(0.2);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in name, email, and message.');
      return;
    }
    setError('');
    setSending(true);
    try {
      await submitContact(formData);
      setFormSent(true);
      setFormData({ name: '', email: '', company: '', message: '' });
      setTimeout(() => setFormSent(false), 4000);
    } catch (err) {
      setError('Failed to send. Please try again or email us directly.');
    } finally {
      setSending(false);
    }
  };

  const email = settings?.email || 'ecofeastnutrients@gmail.com';
  const address = settings?.address || 'B 504, Navbhagyashree, Mahatma Phule Road, Mulund(E), Mumbai - 81';

  const directors = [
    {
      name: settings?.contactPerson || 'Kaustubh Chavan',
      title: settings?.contactTitle || 'Director',
      phone: settings?.phone || '+91 96531 56090',
    },
    {
      name: settings?.contactPerson2 || 'Chaitanya Asarkar',
      title: settings?.contactTitle2 || 'Director',
      phone: settings?.phone2 || '+91 83692 95601',
    },
  ];

  const contactInfo = [
    { label: 'Email', value: email, icon: 'Em' },
    { label: 'Address', value: address, icon: 'Ad' },
  ];

  const inputClass = `w-full bg-white/[0.04] border border-eco-gold/15 rounded-lg
    px-4 py-3 text-eco-cream text-[0.9rem] outline-none transition-colors duration-300
    focus:border-eco-gold/40 placeholder:text-eco-cream/25`;

  return (
    <section id="contact" ref={contactRef} style={{ padding: '100px clamp(20px, 5vw, 60px)' }}>
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-14">
          <div className="text-[0.9rem] tracking-[0.3em] uppercase text-eco-gold mb-4 font-medium">
            Let's Connect
          </div>
          <h2
            className="font-display font-semibold text-eco-cream leading-tight"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          >
            Ready to Partner{' '}
            <span className="text-eco-gold">With Us?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div
            style={{
              animation: contactInView ? 'fadeSlideUp 0.6s both' : 'none',
              opacity: 0,
            }}
          >
            <div className="mb-8">
              <div className="text-[0.75rem] text-eco-gold tracking-[0.15em] uppercase mb-3 font-medium">
                Directors
              </div>
              <div className="flex flex-col gap-4">
                {directors.map((d, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-eco-gold/[0.08] border border-eco-gold/15
                                    flex items-center justify-center text-[0.75rem] text-eco-gold shrink-0 font-semibold">
                      {d.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-[1rem] font-display text-eco-cream font-semibold leading-tight">
                        {d.name}
                      </div>
                      <div className="text-[0.78rem] text-eco-cream/50">{d.title}</div>
                      <div className="text-[0.8rem] text-eco-cream/60 mt-0.5">{d.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {contactInfo.map(c => (
                <div key={c.label} className="flex gap-3.5">
                  <div className="w-10 h-10 rounded-[10px] bg-eco-gold/[0.08] border border-eco-gold/15
                                  flex items-center justify-center text-[0.85rem] text-eco-gold shrink-0">
                    {c.icon}
                  </div>
                  <div>
                    <div className="text-[0.72rem] text-eco-gold tracking-[0.15em] uppercase mb-0.5 font-medium">
                      {c.label}
                    </div>
                    <div className="text-[0.9rem] text-eco-cream/70 leading-relaxed">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <SocialLinks settings={settings} size="md" />

            <div className="mt-8 bg-eco-gold/[0.06] border border-eco-gold/10 rounded-xl p-5">
              <div className="text-[0.75rem] text-eco-gold tracking-[0.15em] uppercase mb-2.5 font-medium">
                Packaging & Logistics
              </div>
              <div className="text-[0.85rem] text-eco-cream/55 leading-relaxed">
                Bulk packing: 10 kg, 25 kg, 50 kg bags. Custom packing and export-ready labeling. FOB / CIF / CFR shipment support.
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className="bg-white/[0.03] border border-eco-gold/10 rounded-2xl p-8"
            style={{
              animation: contactInView ? 'fadeSlideUp 0.6s 0.2s both' : 'none',
              opacity: 0,
            }}
          >
            {formSent ? (
              <div className="text-center py-10">
                <div className="text-3xl mb-3">&#10003;</div>
                <div className="font-display text-[1.3rem] text-eco-gold mb-2">Message Sent!</div>
                <div className="text-[0.9rem] text-eco-cream/50">We'll get back to you within 24 hours.</div>
              </div>
            ) : (
              <div>
                <div className="font-display text-[1.2rem] text-eco-cream mb-6">Send us an Inquiry</div>

                {error && (
                  <div className="text-red-400 text-[0.85rem] mb-4 p-3 bg-red-400/10 rounded-lg">
                    {error}
                  </div>
                )}

                {[
                  { key: 'name', label: 'Full Name', type: 'text', ph: 'Your name' },
                  { key: 'email', label: 'Email', type: 'email', ph: 'you@company.com' },
                  { key: 'company', label: 'Company', type: 'text', ph: 'Company name' },
                ].map(f => (
                  <div key={f.key} className="mb-4">
                    <label className="block text-[0.75rem] text-eco-gold tracking-[0.1em] uppercase mb-1.5 font-medium">
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      value={formData[f.key]}
                      onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                      placeholder={f.ph}
                      className={inputClass}
                    />
                  </div>
                ))}

                <div className="mb-5">
                  <label className="block text-[0.75rem] text-eco-gold tracking-[0.1em] uppercase mb-1.5 font-medium">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    placeholder="Tell us about your requirements..."
                    className={`${inputClass} resize-y`}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  className="w-full bg-gradient-to-br from-eco-gold to-eco-gold-dark text-eco-dark
                             border-none rounded-[10px] py-3.5 text-[0.9rem] font-semibold
                             cursor-pointer tracking-wide transition-all duration-200
                             hover:scale-[1.02] hover:shadow-[0_6px_30px_rgba(201,169,110,0.35)]
                             disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : 'Send Inquiry'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
