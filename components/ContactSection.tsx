"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Mail, 
  User, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

export default function ContactSection() {
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Custom email validation with trimming
    const form = e.currentTarget;
    const emailInput = form.email as HTMLInputElement;
    const email = emailInput.value.trim();
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(email)) {
      emailInput.setCustomValidity("Please enter a valid email address");
      emailInput.reportValidity();
      return;
    } else {
      // Clear any previous custom error messages
      emailInput.setCustomValidity("");
    }

    // Check the rest of the form validity
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    const formData = new FormData(form);
    // Use the trimmed email value when appending data
    formData.set('email', email);
    formData.append('access_key', process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '');
    const jsonData = JSON.stringify(Object.fromEntries(formData));

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json' 
        },
        body: jsonData
      });
      const result = await res.json();
      if (result.success) {
        setStatus('SUCCESS');
        form.reset();
      } else {
        setStatus('ERROR');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('ERROR');
    }
  };

  return (
    <section
      id="contact"
      className="relative py-20 px-4 overflow-hidden"
      suppressHydrationWarning
    >
      {/* Animated Background Elements */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-1/3 left-1/4 w-64 h-64 bg-accent-100/20 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-primary-100/15 rounded-full blur-3xl"
      />

      <div className="max-w-4xl mx-auto relative">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent"
        >
          Get in Touch
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-primary-50"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <User className="w-5 h-5 absolute left-3 top-11 transform -translate-y-1/2 text-primary-500" />
                <label className="block text-sm font-medium text-secondary-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-primary-100 focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-all"
                />
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <Mail className="w-5 h-5 absolute left-3 top-11 transform -translate-y-1/2 text-primary-500" />
                <label className="block text-sm font-medium text-secondary-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  title="Please enter a valid email address"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-primary-100 focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-all"
                />
              </motion.div>
            </div>

            {/* Message Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <MessageSquare className="w-5 h-5 absolute left-3 top-16 transform -translate-y-1/2 text-primary-500" />
              <label className="block text-sm font-medium text-secondary-600 mb-1">
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-primary-100 focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-all"
              ></textarea>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end"
            >
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:scale-[1.02] transition-transform shadow-md hover:shadow-lg"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </motion.div>
          </form>

          {/* Status Messages */}
          {status && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
                status === 'SUCCESS'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {status === 'SUCCESS' ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <p>
                    Thank you! Your message has been sent successfully. I will get back to you soon.
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-500" />
                  <p>Oops! Something went wrong. Please try again.</p>
                </>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ rotate: -45, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent-100/20 rounded-3xl blur-2xl -z-10"
      />
    </section>
  );
}
