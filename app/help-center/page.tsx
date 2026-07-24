'use client';

import { Phone, Mail, MessageCircle, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    question: "How do I place an order?",
    answer: "Browse our parts, add items to your cart, and checkout. You can pay via M-Pesa using Till Number 213528. We'll deliver to your location in Nairobi."
  },
  {
    question: "What areas do you deliver to?",
    answer: "We deliver across Nairobi and its environs. Delivery fees vary by location. Contact us on WhatsApp for exact delivery charges to your area."
  },
  {
    question: "How long does delivery take?",
    answer: "Most orders are delivered within 2-4 hours within Nairobi CBD. For other areas, delivery typically takes 1-2 business days."
  },
  {
    question: "Do you sell genuine auto parts?",
    answer: "Yes! We stock quality genuine and OEM parts for all vehicle makes. All our products come with a quality guarantee."
  },
  {
    question: "Can I return a part if it doesn't fit?",
    answer: "Yes, you can return unused parts in their original packaging within 7 days of delivery. Please contact us first to arrange a return."
  },
  {
    question: "How do I track my order?",
    answer: "Once your order is dispatched, you'll receive a tracking link via SMS or WhatsApp. You can also check your order status in the 'My Orders' section of your account."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept M-Pesa payments to Till Number 213528. We also accept cash on delivery for select locations."
  },
  {
    question: "Do you offer bulk discounts?",
    answer: "Yes! We offer special pricing for bulk orders. Contact us on WhatsApp or call us directly to discuss your requirements."
  }
];

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HelpCircle size={48} className="mx-auto mb-4 text-blue-200" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">How Can We Help?</h1>
          <p className="text-blue-100 text-lg mb-8">Find answers to common questions or get in touch with us directly.</p>
          
          {/* Quick Contact Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="tel:+254712345678" className="flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition">
              <Phone size={18} /> Call Us
            </a>
            <a href="https://wa.me/254712345678" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-bold hover:bg-green-500 transition">
              <MessageCircle size={18} /> WhatsApp
            </a>
            <a href="mailto:pattywapat@gmail.com" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-500 transition">
              <Mail size={18} /> Email Us
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            </div>
          ))}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="bg-blue-700 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-blue-100 mb-6">Can't find what you're looking for? Our team is here to help you.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="https://wa.me/254712345678" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-500 transition flex items-center gap-2">
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
            <a href="tel:+254712345678" className="px-6 py-3 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition flex items-center gap-2">
              <Phone size={18} /> Call +254 712 345 678
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
