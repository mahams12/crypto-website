import React, { useState } from 'react';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiMessageSquare,
  FiUsers,
  FiHelpCircle
} from 'react-icons/fi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: <FiMail className="w-6 h-6" />,
      title: 'Email',
      details: 'hello@cryptotracker.com',
      description: 'Send us an email anytime'
    },
    {
      icon: <FiPhone className="w-6 h-6" />,
      title: 'Phone',
      details: '+1 (555) 987-6543',
      description: 'Mon-Fri from 8am to 6pm'
    },
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: 'Office',
      details: 'New York, NY',
      description: '123 Finance Avenue, Suite 500'
    }
  ];

  const departments = [
    {
      icon: <FiMessageSquare className="w-8 h-8" />,
      title: 'Editorial Team',
      description: 'News tips, story suggestions, press releases',
      email: 'editorial@cryptotracker.com'
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Partnerships',
      description: 'Business partnerships, collaborations, sponsorships',
      email: 'partnerships@cryptotracker.com'
    },
    {
      icon: <FiHelpCircle className="w-8 h-8" />,
      title: 'Technical Support',
      description: 'Technical issues, account problems, feature requests',
      email: 'support@cryptotracker.com'
    }
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'editorial', label: 'Editorial' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'partnerships', label: 'Partnerships' },
    { value: 'advertising', label: 'Advertising' },
    { value: 'feedback', label: 'Feedback' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert('✅ Thank you for your message! We\'ll get back to you within 24 hours.');

      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });
    } catch (error) {
      alert('❌ Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-black">Contact Us</h1>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            Got questions, suggestions, or feedback? The Crypto Tracker team is here to help.
            Reach out to us through any of the channels below.
          </p>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-300 rounded-lg p-6 text-center hover:border-yellow-400 transition-colors"
            >
              <div className="text-black flex justify-center mb-4">{info.icon}</div>
              <h3 className="font-bold text-lg mb-2 text-black">{info.title}</h3>
              <p className="text-black font-medium mb-1">{info.details}</p>
              <p className="text-gray-600 text-sm">{info.description}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-black border-b-4 border-yellow-400 pb-2">Send us a Message</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-black font-medium">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-black font-medium">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-black font-medium">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                >
                  {categories.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2 text-black font-medium">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  placeholder="Brief subject"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-black font-medium">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 resize-none"
                  placeholder="Write your message..."
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 text-black py-3 rounded-lg font-bold transition-colors flex items-center justify-center border-2 border-yellow-400 hover:border-yellow-500"
                style={{ backgroundColor: '#FFD700', borderColor: '#FFD700' }}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Departments */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-black border-b-4 border-yellow-400 pb-2">Contact Departments</h2>
            <div className="space-y-4 mb-8">
              {departments.map((dept, index) => (
                <div key={index} className="bg-white border-2 border-gray-300 rounded-lg p-6 hover:border-yellow-400 transition-colors">
                  <div className="flex items-start">
                    <div className="text-black mr-4 mt-1">{dept.icon}</div>
                    <div>
                      <h3 className="font-bold text-lg mb-2 text-black">{dept.title}</h3>
                      <p className="text-gray-700 mb-3">{dept.description}</p>
                      <a href={`mailto:${dept.email}`} className="text-black hover:text-gray-700 font-medium underline">
                        {dept.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;