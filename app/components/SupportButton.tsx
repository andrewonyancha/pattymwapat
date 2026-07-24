'use client';
import { useState } from 'react';
import { FaWhatsapp, FaEnvelope, FaTimes, FaComments } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { MdAddCall } from 'react-icons/md';

const ContactUs = () => {
  const [isContactOptionsVisible, setIsContactOptionsVisible] = useState(false);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/254member720001256', '_blank');
  };

  const handleCallClick = () => {
    window.location.href = 'tel:+123456';
  };

  const iconAnimationVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.5, y: 50 },
  };

  const labelVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
  };

  return (
    <div className="fixed  left-6 md:left-4 lg:left-6 flex flex-col-reverse items-end space-y-4 z-40">
      {!isContactOptionsVisible ? (
        <div className="relative">
          <button
            onClick={() => setIsContactOptionsVisible(true)}
            className="bg-gradient-to-r from-green-400 to-green-900 hover:text-black text-white p-3 rounded-full shadow-2xl hover:shadow-xl transition-all flex items-center justify-center fixed bottom-4 left-4"
          >
            <FaComments className="text-2xl sm:text-1xl md:text-2xl lg:text-3xl" />
          </button>
          {!isContactOptionsVisible && (
            <span className="text-xs text-black whitespace-nowrap fixed md:bottom-18 bottom-16 left-4">
              Contact Us
            </span>
          )}

         
        </div>
      ) : (
        <div className="fixed bottom-20 left-6 md:left-4 lg:left-6 flex flex-col-reverse items-end space-y-4 z-40">
          {/* Close button with label */}
          <div className="fixed bottom-4 left-4 flex items-center gap-3">
            <button
              onClick={() => setIsContactOptionsVisible(false)}
              className="bg-gradient-to-r from-green-400 to-green-900 hover:text-black text-white p-3 rounded-full shadow-2xl hover:shadow-xl transition-all flex items-center justify-center fixed bottom-4 left-4"
            >
              <FaTimes className="sm:text-1xl md:text-2xl lg:text-3xl" />
            </button>
            
          </div>

          {/* Animated icons */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={iconAnimationVariants}
            transition={{ type: 'spring', stiffness: 150 }}
            className="flex flex-col space-y-4 items-center"
          >
            {/* Call button with floating label */}
            <div className="flex items-center -ml-3 gap-3">
              <motion.button
                onClick={handleCallClick}
                className="text-black hover:text-blue-700 transition-all"
              >
                <MdAddCall className="text-3xl" />
              </motion.button>
              <motion.span
                initial="hidden"
                animate="visible"
                variants={labelVariants}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="text-xs font-semibold tracking-widest  text-black pr-3 py-1 whitespace-nowrap pointer-events-none"
                style={{ fontFamily: "'Georgia', serif", letterSpacing: '0.12em' }}
              >
                Call Us
              </motion.span>
            </div>

            {/* WhatsApp button with floating label */}
            <div className="flex items-center -ml-1 gap-3">
              <motion.button
                onClick={handleWhatsAppClick}
                className="text-green-700 hover:text-green-400 transition-all"
              >
                <FaWhatsapp className="text-3xl" />
              </motion.button>
              <motion.span
                initial="hidden"
                animate="visible"
                variants={labelVariants}
                transition={{ delay: 0.05, duration: 0.35 }}
                className="text-xs font-semibold tracking-widest  text-green-700  px-0 py-0  whitespace-nowrap pointer-events-none"
                style={{ fontFamily: "'Georgia', serif", letterSpacing: '0.12em' }}
              >
                WhatsApp
              </motion.span>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ContactUs;