'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitStatus('idle');

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'info@neighborsos.org',
        subject: `Contact Form: ${formData.category.toUpperCase()} - ${formData.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>New Contact Form Submission</h2>
            <p><strong>Category:</strong> ${formData.category}</p>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Subject:</strong> ${formData.subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${formData.message}</p>
          </div>
        `,
        apiKey: process.env.NEXT_PUBLIC_EMAIL_API_KEY // Optional internal validation
      })
    });

    const result = await response.json();

    if (response.status === 429) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      alert(`Rate limit exceeded. Please try again after ${new Date(result.reset).toLocaleTimeString()}`);
      return;
    }

    if (response.ok) {
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        category: 'general',
        subject: '',
        message: ''
      });
    } else {
      setSubmitStatus('error');
    }
  } catch (error) {
    setSubmitStatus('error');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-[#f5f4f2]">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-serif text-[#2d3436] mb-6 text-center">
          Contact & Support
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Have questions or need assistance? We're here to help. Choose the topic that best fits your inquiry below.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* General Inquiries */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#000080]">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-3">General Inquiries</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Questions about NeighborSOS, our mission, or how to get involved? We'd love to hear from you.
            </p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#000080] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Platform questions
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#000080] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Partnership opportunities
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#000080] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Media inquiries
              </li>
            </ul>
          </div>

          {/* Charity Support */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#c97357]">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-3">Charity Support</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Questions about registering your charity, posting needs, or managing your account?
            </p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#c97357] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Registration & verification
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#c97357] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Posting urgent needs
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#c97357] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Managing family sponsorships
              </li>
            </ul>
          </div>

          {/* Donor Support */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#8B8589]">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-3">Donor Support</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Need help with a donation, delivery coordination, or have questions about your commitment?
            </p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#8B8589] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Donation questions
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#8B8589] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Delivery coordination
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#8B8589] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Tax receipt information
              </li>
            </ul>
          </div>

          {/* Technical Issues */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-gray-400">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-3">Technical Issues</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Experiencing technical problems with the website or need help navigating the platform?
            </p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Website bugs or errors
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Account access problems
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Browser compatibility
              </li>
            </ul>
          </div>

        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif text-[#2d3436] mb-6 text-center">Send Us a Message</h2>
          
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              <p className="font-semibold">Message sent successfully!</p>
              <p className="text-sm mt-1">We'll get back to you within 24-48 hours.</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <p className="font-semibold">Failed to send message.</p>
              <p className="text-sm mt-1">Please try again or email us directly at info@neighborsos.org</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000080] focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000080] focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000080] focus:border-transparent"
              >
                <option value="general">General Inquiry</option>
                <option value="charity">Charity Support</option>
                <option value="donor">Donor Support</option>
                <option value="technical">Technical Issue</option>
              </select>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000080] focus:border-transparent"
                placeholder="Brief description of your question"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000080] focus:border-transparent"
                placeholder="Please provide as much detail as possible..."
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#000080] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Contact Info */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-serif text-[#2d3436] mb-4 text-center">Other Ways to Reach Us</h3>
            <div className="grid md:grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <a href="mailto:info@neighborsos.org" className="text-[#000080] font-semibold hover:underline">
                  info@neighborsos.org
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Response Time</p>
                <p className="text-gray-700 font-semibold">Within 24-48 hours</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Before reaching out, check our <a href="/faq" className="text-[#000080] hover:underline">FAQ page</a> for quick answers to common questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}