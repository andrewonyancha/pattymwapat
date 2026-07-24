'use client';

import { Phone, Mail, MessageSquare, ArrowUpRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';

const customEase: [number, number, number, number] = [0.19, 1, 0.22, 1];

export default function ContactUs() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: customEase } },
  };

  return (
    <section className="bg-[#FDFDFD] py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
       
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left: Contact Methods */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-12"
          >
            <div className="space-y-8">
              <ContactLink 
                icon={<Phone size={18} strokeWidth={1} />}
                label="Direct Line"
                value="+254 703 699703"
                href="tel:+254 703 699703"
              />
              <ContactLink 
                icon={<Mail size={18} strokeWidth={1} />}
                label="Email Correspondence"
                value="pattywapat@gmail.com"
                href="mailto:pattywapat@gmail.com"
              />
              <ContactLink 
                icon={<MessageSquare size={18} strokeWidth={1} />}
                label="WhatsApp Concierge"
                value="+254 703 699703"
                href="https://wa.me/+254 703 699703"
              />
            </div>

            {/* Premium Call to Action */}
            <motion.div variants={itemVariants} className="pt-12 border-t border-stone-100">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-400 mb-6">Immediate Support</p>
              <a
                href="https://wa.me/+254 703 699703"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-6 group"
              >
                <div className="w-16 h-16  border bg-blue-700  border-stone-200 flex items-center justify-center group-hover:bg-white group-hover:border-stone-400 transition-all duration-500">
                  <ArrowUpRight className="text-white group-hover:text-stone-400 transition-colors" size={24} strokeWidth={1} />
                </div>
                <div>
                  <span className="block text-sm font-medium text-stone-900 uppercase tracking-widest">Start a conversation</span>
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest">Response time: &lt; 15 mins</span>
                </div>
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Immersive Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="lg:col-span-7 relative"
          >
            <div className="relative aspect-[3/2] md:aspect-[16/10] overflow-hidden ">
              <Image
                src="/images/Contact-us.svg"
                alt="Pattywapat Autospares"
                fill
                className="object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-stone-900/10" />
            </div>
            {/* Floating Info Tag */}
            <div className="absolute -bottom-8 -left-8 bg-white p-10 hidden md:block shadow-xl">
              <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-2">Our Location</p>
              <p className="text-sm font-medium text-stone-900 uppercase tracking-widest">Nairobi, Kenya</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactLink({ icon, label, value, href }: { icon: any, label: string, value: string, href: string }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
      }}
      className="group"
    >
      <a href={href} className="flex items-start gap-6">
        <div className="mt-1 text-stone-400 group-hover:text-stone-900 transition-colors">
          {icon}
        </div>
        <div>
          <span className="block text-[9px] uppercase tracking-[0.3em] text-stone-400 mb-1">{label}</span>
          <span className="text-lg font-light tracking-tight text-stone-900 group-hover:tracking-wider transition-all duration-500">
            {value}
          </span>
        </div>
      </a>
    </motion.div>
  );
}