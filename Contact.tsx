import React, { useState } from 'react';
import { useWeb } from '../context/WebContext';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function Contact({ theme }: { theme: 'light' | 'dark' }) {
  const { data, addEnquiry } = useWeb();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General Query', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert("Please fill in all required fields.");
      return;
    }

    addEnquiry({
      name: form.name,
      email: form.email,
      phone: form.phone || "N/A",
      subject: form.subject,
      message: form.message
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', phone: '', subject: 'General Query', message: '' });
    }, 2500);
  };

  const handleWhatsAppRedirect = () => {
    const message = encodeURIComponent(`Hello Mind Map, I visited your website and would like to inquire about your STEM, Robotics, and Arduino learning workshops.`);
    const link = `https://wa.me/${data.contact.whatsappNumber || '919901993468'}?text=${message}`;
    window.open(link, '_blank');
  };

  return (
    <section
      id="contact"
      className={`py-24 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            id="contact-section-heading"
            className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-2"
          >
            Get In Touch
          </h2>
          <p
            id="contact-section-sub"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent"
          >
            Establish Contact with Our Advisors
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-sky-500 to-indigo-600 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details Panel */}
          <div className="lg:col-span-5 space-y-8">
            <h3 className="text-2xl font-black tracking-tight">Contact Information</h3>
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Want to establish an Innovation Lab at your school, or enroll in our weekly robotics & electronics camps? Send us a query or reach out directly!
            </p>

            <div className="space-y-6">
              {/* Phone */}
              <div id="contact-info-phone" className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-sky-500/10 text-sky-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400">Call/Mobile</h4>
                  <a href={`tel:${data.contact.phone}`} className="text-base font-bold tracking-wide hover:text-sky-400 transition-colors">
                    {data.contact.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div id="contact-info-email" className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400">Email Address</h4>
                  <a href={`mailto:${data.contact.email}`} className="text-base font-bold tracking-wide hover:text-indigo-400 transition-colors break-all">
                    {data.contact.email}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div id="contact-info-address" className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400">Head Office Location</h4>
                  <p className="text-sm font-bold tracking-wide">
                    {data.contact.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action WhatsApp Trigger */}
            <div className={`p-6 rounded-3xl border text-center relative overflow-hidden group ${
              theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200 shadow-md'
            }`}>
              <h4 className="text-sm font-bold tracking-tight mb-3">Want instant communication?</h4>
              <button
                id="whatsapp-chat-btn"
                onClick={handleWhatsAppRedirect}
                className="w-full py-3.5 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden ${
              theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200 shadow-xl'
            }`}>
              <h3 className="text-xl font-bold tracking-tight mb-6">Send an Online Inquiry</h3>

              {submitted ? (
                <div id="contact-form-success" className="py-16 text-center flex flex-col items-center animate-fade-in">
                  <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 animate-bounce">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-500">Inquiry Received Successfully!</h4>
                  <p className="text-sm text-neutral-400 mt-1">Mentor Bijit Kumar Prasad and team will reply back soon.</p>
                </div>
              ) : (
                <form id="contact-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                          theme === 'dark'
                            ? 'bg-neutral-950 border-neutral-800 text-white focus:border-sky-500'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-sky-500'
                        }`}
                        placeholder="e.g. Rahul Patil"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Contact Phone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                          theme === 'dark'
                            ? 'bg-neutral-950 border-neutral-800 text-white focus:border-sky-500'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-sky-500'
                        }`}
                        placeholder="e.g. +91 99000 88888"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                        theme === 'dark'
                          ? 'bg-neutral-950 border-neutral-800 text-white focus:border-sky-500'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-sky-500'
                      }`}
                      placeholder="e.g. rahul@patil.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Inquiry Focus</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                        theme === 'dark'
                          ? 'bg-neutral-950 border-neutral-800 text-white focus:border-sky-500'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-sky-500'
                      }`}
                    >
                      <option>General Query</option>
                      <option>Innovation Lab Setup</option>
                      <option>School/College STEM Program</option>
                      <option>Robotics Workshops</option>
                      <option>Personal Arduino Mentorship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Detailed Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                        theme === 'dark'
                          ? 'bg-neutral-950 border-neutral-800 text-white focus:border-sky-500'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-sky-500'
                      }`}
                      placeholder="Describe what we can help you with..."
                    />
                  </div>

                  <button
                    type="submit"
                    id="submit-contact-form-btn"
                    className="w-full py-4 rounded-xl font-bold tracking-wide text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
