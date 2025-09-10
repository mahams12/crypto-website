import React from 'react';

const About = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Editor-in-Chief',
    },
    {
      name: 'Mike Chen',
      role: 'News Editor',
    },
    {
      name: 'Alex Rodriguez',
      role: 'Features Reporter',
    },
    {
      name: 'Emily Davis',
      role: 'Weekend Editor',
    },
    {
      name: 'Anthony Patrick',
      role: 'Senior Reporter',
    },
    {
      name: 'Anish Jain',
      role: 'Markets Analyst',
    }
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* About Section */}
        <section className="mb-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-6 text-black">About Crypto Tracker</h1>
          <div className="space-y-4">
            <p className="text-lg text-gray-700 mb-4">
              Crypto Tracker is an independent platform providing transparent insights into cryptocurrency
              markets. We started in 2019 with the mission to make digital assets more understandable for
              everyone — from beginners to professionals.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Our goal is to deliver accurate, objective, and timely reporting — going beyond the hype to
              explain, analyze and simplify the fast-evolving crypto industry.
            </p>
            <p className="text-lg text-gray-700">
              Have a tip, question or correction?{' '}
              <a href="/contact" className="text-black underline hover:text-gray-700 font-medium">Contact us.</a>
            </p>
          </div>
        </section>

        {/* Revenue Model */}
        <section className="mb-16 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-black border-b-4 border-yellow-400 pb-2">Our Revenue Model</h2>
          <div className="space-y-4">
            <p className="text-lg text-gray-700 mb-4">
              All content on Crypto Tracker is always free to access — no paywalls or subscriptions.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Our revenue comes from ad placements and partner content. Our editorial team operates
              independently, maintaining a strict separation between our editorial and business decisions.
            </p>
            <p className="text-gray-700 font-medium">
              <span className="font-semibold text-black">Transparency Promise:</span> All paid content (sponsored content, partner content, press releases, etc.) is clearly
              marked and attributed.
            </p>
          </div>
        </section>

        {/* Editorial Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-black border-b-4 border-yellow-400 pb-2 inline-block w-full">Editorial Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="flex items-center bg-white border-2 border-gray-300 rounded-lg p-6 hover:border-yellow-400 transition-colors"
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-black mr-4 border-2"
                  style={{ backgroundColor: '#FFD700', borderColor: '#FFD700' }}
                >
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black">{member.name}</h3>
                  <p className="text-gray-700 text-sm font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;