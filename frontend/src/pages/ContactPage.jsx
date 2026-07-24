import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Building2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Enterprise Inquiry',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
            <Mail size={18} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Contact & Support</h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Get in touch with DashNova sales, technical engineering, or executive support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Office Info */}
        <div className="space-y-4 bg-white p-5 border border-gray-200 rounded-lg shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">DashNova HQ</h3>

          <div className="space-y-3 text-xs text-gray-700">
            <div className="flex items-start gap-2.5">
              <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
              <span>100 Financial Center Blvd, Suite 400<br />San Francisco, CA 94105</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail size={16} className="text-gray-400 shrink-0" />
              <span>support@dashnova.app</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone size={16} className="text-gray-400 shrink-0" />
              <span>+1 (800) 555-NOVA</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
          {submitted ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Message Received!</h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Thank you for contacting DashNova. An executive support engineer will respond within 2 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 bg-black text-white rounded text-xs font-bold hover:bg-gray-800 transition cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-gray-900">Send us a message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Inquiry Type</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-black bg-white"
                >
                  <option>Enterprise Inquiry</option>
                  <option>Technical Support</option>
                  <option>API & Integration</option>
                  <option>Billing & Accounts</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help your business?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-black"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-black text-white rounded-md text-xs font-bold hover:bg-gray-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Send size={13} />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
