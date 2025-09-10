import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-black">Privacy Policy</h1>
          <p className="text-gray-700 text-lg">
            Your privacy matters to us. This Privacy Policy explains how Crypto
            Tracker collects, uses, and protects your information.
          </p>
          <p className="text-sm text-gray-600 mt-4 font-medium">
            <strong>Last Updated:</strong> January 15, 2025 | <strong>Effective Date:</strong> January 1, 2025
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-10 text-gray-800 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-black border-b-4 border-yellow-400 pb-2">
              1. Information We Collect
            </h2>
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-black">Personal Information</h3>
              <p className="mb-4">
                We may collect personal information you provide directly, such as
                your name, email address, phone number, or any details you submit through our
                contact forms, newsletter subscriptions, or user accounts.
              </p>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-black">Automatically Collected Information</h3>
              <p className="mb-2">
                We automatically collect certain information when you visit our website, including:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Device information (browser type, operating system, device type)</li>
                <li>Usage data (pages visited, time spent on site, click patterns)</li>
                <li>Technical data (IP address, browser version, screen resolution)</li>
                <li>Referral information (how you arrived at our website)</li>
                <li>Location data (general geographic location based on IP address)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3 text-black">Information from Third Parties</h3>
              <p>
                We may receive information about you from third-party services such as analytics providers,
                advertising networks, or social media platforms when you interact with our content on those platforms.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-black border-b-4 border-yellow-400 pb-2">
              2. How We Use Your Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-black">Service Provision</h3>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Provide and maintain our website services</li>
                  <li>Process and respond to your inquiries</li>
                  <li>Send newsletters and updates (with consent)</li>
                  <li>Personalize your experience</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-black">Improvement & Analytics</h3>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Analyze website performance and usage patterns</li>
                  <li>Improve our content and user experience</li>
                  <li>Conduct research and statistical analysis</li>
                  <li>Monitor and prevent fraud or abuse</li>
                </ul>
              </div>
            </div>
            <p className="mt-6 text-gray-700">
              We process your information based on legitimate business interests, consent (where required),
              or legal obligations. You may withdraw consent at any time where we rely on consent as the legal basis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-black border-b-4 border-yellow-400 pb-2">
              3. Sharing of Information
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-black">What We Don't Do</h3>
                <p className="font-medium text-red-600">
                  We do not sell, rent, or trade your personal information to third parties for their marketing purposes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-black">When We May Share</h3>
                <ul className="list-disc ml-6 space-y-2">
                  <li><strong>Service Providers:</strong> Trusted third-party vendors who help us operate our website (hosting, analytics, email services)</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Safety & Security:</strong> To protect our rights, property, or safety of our users</li>
                  <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-black border-b-4 border-yellow-400 pb-2">
              4. Data Security & Retention
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-black">Security Measures</h3>
                <ul className="list-disc ml-6 space-y-2">
                  <li>SSL/TLS encryption for data transmission</li>
                  <li>Secure servers and database encryption</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access controls for staff</li>
                  <li>Industry-standard security protocols</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-black">Data Retention</h3>
                <p className="mb-2">We retain your information for as long as necessary to:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Provide our services to you</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Improve our services (anonymized data)</li>
                </ul>
              </div>
            </div>
            <p className="mt-6 text-gray-700 font-medium">
              <strong>Important:</strong> While we implement robust security measures, no method of transmission 
              or storage is 100% secure. We cannot guarantee absolute security but are committed to protecting your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-black border-b-4 border-yellow-400 pb-2">
              5. Cookies & Tracking Technologies
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-black">Types of Cookies We Use</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Essential Cookies</h4>
                    <p className="text-sm text-gray-600">Required for basic website functionality</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Analytics Cookies</h4>
                    <p className="text-sm text-gray-600">Help us understand how visitors use our site</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Preference Cookies</h4>
                    <p className="text-sm text-gray-600">Remember your settings and preferences</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Marketing Cookies</h4>
                    <p className="text-sm text-gray-600">Used to deliver relevant advertisements</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-black">Managing Cookies</h3>
                <p className="mb-2">You can control cookies through:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Browser settings (most browsers allow you to refuse cookies)</li>
                  <li>Our cookie preference center (available on first visit)</li>
                  <li>Third-party opt-out tools for advertising cookies</li>
                  <li>Industry opt-out pages like NAI or DAA</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-black border-b-4 border-yellow-400 pb-2">
              6. Third-Party Links & Services
            </h2>
            <p className="mb-4">
              Our website may contain links to third-party websites, including cryptocurrency exchanges,
              news sources, and analytical tools. We are not responsible for the privacy practices 
              or content of those external sites.
            </p>
            <p className="font-medium">
              <strong>Recommendation:</strong> We encourage you to review the privacy policies 
              of any third-party sites you visit through our links, as their practices may differ from ours.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-black border-b-4 border-yellow-400 pb-2">
              7. Your Privacy Rights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-black">Universal Rights</h3>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Access your personal information</li>
                  <li>Update or correct inaccurate data</li>
                  <li>Delete your personal information</li>
                  <li>Object to certain processing activities</li>
                  <li>Withdraw consent (where applicable)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-black">Additional Rights (EU/UK)</h3>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Data portability (receive your data)</li>
                  <li>Restrict processing in certain circumstances</li>
                  <li>Right not to be subject to automated decision-making</li>
                  <li>Lodge complaints with supervisory authorities</li>
                </ul>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-3 text-black">How to Exercise Your Rights</h3>
              <p className="mb-2">To exercise any of these rights, contact us at:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Email: privacy@cryptotracker.com</li>
                <li>Include: Your full name, email address, and specific request</li>
                <li>Response time: We will respond within 30 days (EU: 1 month)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-black border-b-4 border-yellow-400 pb-2">
              8. International Data Transfers
            </h2>
            <p className="mb-4">
              As a global service, your information may be transferred to and processed in countries 
              other than your own, including the United States. We ensure appropriate safeguards 
              are in place for international transfers, including:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Standard Contractual Clauses approved by the European Commission</li>
              <li>Adequacy decisions for transfers to countries with adequate protection</li>
              <li>Binding Corporate Rules where applicable</li>
              <li>Your explicit consent for specific transfers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-black border-b-4 border-yellow-400 pb-2">
              9. Children's Privacy
            </h2>
            <p className="mb-4 font-medium text-red-600">
              <strong>Age Restriction:</strong> Our services are not intended for children under 13 years old 
              (or 16 in the EU). We do not knowingly collect personal information from children under these ages.
            </p>
            <p>
              If we become aware that we have collected information from a child under the applicable age,
              we will delete such information promptly. Parents who believe their child has provided
              information to us should contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-black border-b-4 border-yellow-400 pb-2">
              10. Updates to This Policy
            </h2>
            <p className="mb-4">
              We may update this Privacy Policy periodically to reflect changes in our practices,
              technology, legal requirements, or other factors. We will notify you of material changes by:
            </p>
            <ul className="list-disc ml-6 space-y-1 mb-4">
              <li>Posting the updated policy on our website with a new effective date</li>
              <li>Sending email notifications for significant changes (if you've subscribed)</li>
              <li>Displaying prominent notices on our website</li>
            </ul>
            <p className="text-gray-600">
              Your continued use of our services after changes take effect constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-black border-b-4 border-yellow-400 pb-2">
              11. Contact Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-black">Privacy Inquiries</h3>
                <p className="mb-2">For privacy-related questions or requests:</p>
                <p>
                  <strong>Email:</strong> <a href="mailto:privacy@cryptotracker.com" className="text-black hover:text-gray-700 underline">privacy@cryptotracker.com</a><br/>
                  <strong>Response Time:</strong> Within 48 hours<br/>
                  <strong>Postal Address:</strong> 123 Finance Avenue, Suite 500, New York, NY 10001
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-black">Data Protection Officer</h3>
                <p className="mb-2">For EU/UK residents:</p>
                <p>
                  <strong>Email:</strong> <a href="mailto:dpo@cryptotracker.com" className="text-black hover:text-gray-700 underline">dpo@cryptotracker.com</a><br/>
                  <strong>Role:</strong> Independent oversight of data protection practices<br/>
                  <strong>Direct Contact:</strong> Available for complaints and guidance
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;