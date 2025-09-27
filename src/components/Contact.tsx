import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import emailjs from 'emailjs-com';
import { Github, Linkedin, Mail, FileText } from 'lucide-react';

export const Contact = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
  
    try {
      // Send email using EmailJS
      const result = await emailjs.sendForm(
        'service_9so3zzh',    // Your EmailJS service ID
        'template_441ox9k',   // Your EmailJS template ID
        e.target as HTMLFormElement, // Explicitly cast e.target to HTMLFormElement
        'AL0EZnnziTZMPYKHg'        // Your EmailJS user ID
      );
  
      console.log('Email sent successfully:', result.text);
      setStatus('success');
      setFormState({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending email:', error);
      setStatus('error');
    }
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section ref={ref} className="min-h-[40vh] py-16 px-4" id="contact">
      <div className="max-w-container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-heading font-bold mb-8 text-center">Get in Touch</h2>

          <form onSubmit={handleSubmit} className="space-y-6 mb-12">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formState.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-secondary/20 bg-transparent focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formState.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-secondary/20 bg-transparent focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formState.message}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-secondary/20 bg-transparent focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-3 px-6 bg-accent text-light rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'success' && (
              <p className="text-green-500 text-center">Message sent successfully!</p>
            )}
            {status === 'error' && (
              <p className="text-red-500 text-center">Something went wrong. Please try again.</p>
            )}
          </form>

          <div className="flex flex-col items-center gap-8">
            <a
              href="/SITHUM UDAYANGA - CV.pdf"
              download
              className="flex items-center gap-2 px-6 py-3 bg-secondary/10 hover:bg-secondary/20 hover:text-accent rounded-lg transition-colors"
            >
              <FileText size={20} />
              Download CV
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
