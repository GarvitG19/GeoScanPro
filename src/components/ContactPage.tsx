import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Moon, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#f5f4ed] dark:bg-[#080a09] text-[#4a4a4a] dark:text-[#e3ddd7]">
      {/* Header */}
      <header className="bg-white/90 dark:bg-[#080a09]/90 shadow-sm backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-[#4a4a4a] dark:text-[#e3ddd7] hover:text-[#4a4a4a]/80 dark:hover:text-[#e3ddd7]/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <h1 className="text-2xl font-bold text-[#4a4a4a] dark:text-[#e3ddd7]">Contact Us</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/80 dark:bg-[#111211]/80 rounded-xl p-6 shadow-lg backdrop-blur-sm
                          flex flex-col items-center text-center">
              <Mail className="w-8 h-8 mb-4" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-600 dark:text-gray-400">g_gupta@es.iitr.ac.in</p>
            </div>
            <div className="bg-white/80 dark:bg-[#111211]/80 rounded-xl p-6 shadow-lg backdrop-blur-sm
                          flex flex-col items-center text-center">
              <Phone className="w-8 h-8 mb-4" />
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-gray-600 dark:text-gray-400">+91-8085130XXX</p>
            </div>
            <div className="bg-white/80 dark:bg-[#111211]/80 rounded-xl p-6 shadow-lg backdrop-blur-sm
                          flex flex-col items-center text-center">
              <MapPin className="w-8 h-8 mb-4" />
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="text-gray-600 dark:text-gray-400">Indian Institute of Technology Roorkee</p>
            </div>
          </div>

          {/* Contact Form */}
          {/* <div className="bg-white/80 dark:bg-[#111211]/80 rounded-2xl p-8 shadow-lg backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-[#f5f4ed]/50 dark:bg-[#080a09]/50
                             border border-gray-200 dark:border-gray-700
                             focus:outline-none focus:ring-2 focus:ring-[#4a4a4a]/50 dark:focus:ring-[#e3ddd7]/50"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-[#f5f4ed]/50 dark:bg-[#080a09]/50
                             border border-gray-200 dark:border-gray-700
                             focus:outline-none focus:ring-2 focus:ring-[#4a4a4a]/50 dark:focus:ring-[#e3ddd7]/50"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#f5f4ed]/50 dark:bg-[#080a09]/50
                           border border-gray-200 dark:border-gray-700
                           focus:outline-none focus:ring-2 focus:ring-[#4a4a4a]/50 dark:focus:ring-[#e3ddd7]/50"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 rounded-lg bg-[#f5f4ed]/50 dark:bg-[#080a09]/50
                           border border-gray-200 dark:border-gray-700
                           focus:outline-none focus:ring-2 focus:ring-[#4a4a4a]/50 dark:focus:ring-[#e3ddd7]/50"
                  required
                />
              </div>
              
              {submitStatus !== 'idle' && (
                <div className={`p-4 rounded-lg ${
                  submitStatus === 'success' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}>
                  {submitStatus === 'success' 
                    ? 'Message sent successfully!' 
                    : 'Failed to send message. Please try again.'}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-[#4a4a4a] to-[#4a4a4a]/80 
                         dark:from-[#e3ddd7] dark:to-[#e3ddd7]/80 text-white dark:text-[#080a09]
                         hover:opacity-90 transition-all flex items-center justify-center space-x-2
                         disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white dark:border-[#080a09] border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div> */}

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  question: "How accurate is GeoScan Pro's rock identification?",
                  answer: "Our AI-powered system achieves 98% accuracy in rock identification, backed by continuous learning and expert verification."
                },
                {
                  question: "Can I use GeoScan Pro offline?",
                  answer: "No, you cannot download the database for offline use as of now, though we will implement this functionality in the future updates."
                },
                {
                  question: "Do you need any Subscriptions?",
                  answer: "No this website is completely free to use, enjoy this powerfull tool with no extra cost."
                }
              ].map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white/80 dark:bg-[#111211]/80 rounded-xl p-6 shadow-lg backdrop-blur-sm"
                >
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;