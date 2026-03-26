import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-surface font-body text-on-surface">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm shadow-slate-900/5">
        <div className="flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto">
          <div className="text-2xl font-manrope font-extrabold text-slate-900 dark:text-slate-50">
            The Academic Lens
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 dark:hover:text-blue-300 transition-all duration-300" to="/directory">Directory</Link>
            <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 dark:hover:text-blue-300 transition-all duration-300" to="/mentorship">Mentorship</Link>
            <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 dark:hover:text-blue-300 transition-all duration-300" to="/events">Events</Link>
            <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 dark:hover:text-blue-300 transition-all duration-300" to="/jobs">Jobs</Link>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-on-surface-variant">
              <span className="material-symbols-outlined hover:bg-slate-100/50 p-2 rounded-full cursor-pointer transition-all">notifications</span>
              <span className="material-symbols-outlined hover:bg-slate-100/50 p-2 rounded-full cursor-pointer transition-all">settings</span>
            </div>
            <Link to="/login" className="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-container transition-all active:scale-95 duration-200">
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[870px] flex items-center overflow-hidden bg-primary text-on-primary">
          <div className="absolute inset-0 opacity-40">
            <img 
              className="w-full h-full object-cover" 
              alt="University Library" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuArZUoNbKZitkeFOwHCApJY2v2BG7UEZKeCFRmNyeQMbJY4zyLq9ovgQhKBCLpyfgTY8EruVRCKhDH1sglRsGwL2rnnJzdSy1XTnHS6i5MgclmG_tz6L_HBZVXNNwsnzKBCrky1YFRu2ddBw77dfK5C5JbojxOpjl30mrGU8RftelhH2d1CKR-Nc7YnmTQoHuokQSfy9vDggIpH1JSTlmUv-G1gAV4rypx0W7nyi2UsTU_59DpFUfwng5UdmAlBSVLJbkAeh1PhUNum" 
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#031632] to-[#1a2b48] opacity-80"></div>
          </div>
          <div className="container mx-auto px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
                The Legacy <br/><span className="text-secondary-fixed-dim">Continues Here.</span>
              </h1>
              <p className="text-xl md:text-2xl text-on-primary-container font-body max-w-2xl mb-10 leading-relaxed">
                Connect with a global network of innovators, leaders, and thinkers. Your professional journey didn't end at graduation—it evolved.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login" className="bg-secondary text-on-secondary px-8 py-4 rounded-lg font-bold text-lg hover:bg-secondary-container transition-all text-center">
                  Join Alumni Network
                </Link>
                <Link to="/directory" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                  Explore Directory <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block lg:col-span-5 relative">
              <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-xl border border-white/10" style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)' }}>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
                    <span className="material-symbols-outlined text-secondary-fixed-dim text-3xl">groups</span>
                    <div>
                      <div className="text-2xl font-bold">45,000+</div>
                      <div className="text-sm opacity-70">Active Alumni</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
                    <span className="material-symbols-outlined text-secondary-fixed-dim text-3xl">work</span>
                    <div>
                      <div className="text-2xl font-bold">12,400</div>
                      <div className="text-sm opacity-70">Career Placements</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
                    <span className="material-symbols-outlined text-secondary-fixed-dim text-3xl">school</span>
                    <div>
                      <div className="text-2xl font-bold">280</div>
                      <div className="text-sm opacity-70">Mentorship Programs</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-24 bg-surface-container-low">
          <div className="container mx-auto px-8">
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-secondary font-bold tracking-widest uppercase text-sm block mb-4">Our Purpose</span>
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-8 leading-tight">
                Cultivating intellectual excellence through lifelong peer-to-peer engagement.
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16 text-left">
                <div className="space-y-4">
                  <h3 className="font-headline text-xl font-bold text-primary">Global Reach</h3>
                  <p className="text-on-surface-variant leading-relaxed">Spanning 84 countries, our network provides a sophisticated ecosystem for international collaboration and insight.</p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-headline text-xl font-bold text-primary">Strategic Mentorship</h3>
                  <p className="text-on-surface-variant leading-relaxed">Bridging the gap between established industry veterans and emerging pioneers through curated matching.</p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-headline text-xl font-bold text-primary">Academic Rigor</h3>
                  <p className="text-on-surface-variant leading-relaxed">Access exclusive journals, lectures, and research archives that keep you at the forefront of your field.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-24 bg-surface">
          <div className="container mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div>
                <span className="text-secondary font-bold tracking-widest uppercase text-sm block mb-4">Success Stories</span>
                <h2 className="font-headline text-4xl font-bold text-primary">Distinguished Journeys</h2>
              </div>
              <button className="text-secondary font-bold flex items-center gap-2 hover:underline underline-offset-4 mt-6 md:mt-0">
                View All Alumni Highlights <span className="material-symbols-outlined">trending_flat</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 relative overflow-hidden rounded-xl group h-[600px]">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt="Success Story" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRUAbTV_484SSdn81_BL7IUphv56zfZ0Jhhc5qrWPDJrBeATU6uekZ2i1oUC1s-V-I4TWJeczCsMyfr9v79Uj7pEsPfpw6UgumqdWBxg25skIEvRbqkgCjk-UUHhg2zUtjM5N3cXnSbFJDCgxf7KK8pWo8F9xIUpasgzlfHQDJ2I_jP2qCIfCIi5DlzeaWRmIZn3CAEOfWNhPBr0tNWrB5IWMYZl_isLHgLWYZwN5FFVJrDDBIsQAlQjwwFPZGWatgeDaGzWvW5YoP" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 p-10 text-white">
                  <span className="bg-secondary px-3 py-1 rounded text-xs font-bold mb-4 inline-block uppercase">Technology Leader</span>
                  <h3 className="text-3xl font-headline font-bold mb-4">Sarah Jenkins: From Lab to Lead Architect</h3>
                  <p className="text-on-primary-container max-w-lg mb-6">"The Academic Lens provided the mentorship connection that allowed me to pivot into sustainable tech leadership within six months."</p>
                  <a className="inline-flex items-center gap-2 font-bold hover:gap-4 transition-all" href="#">Read her story <span className="material-symbols-outlined">east</span></a>
                </div>
              </div>
              <div className="flex flex-col gap-6 h-[600px]">
                <div className="bg-primary-container rounded-xl p-8 flex flex-col justify-between text-white h-1/2">
                  <div>
                    <span className="material-symbols-outlined text-4xl text-secondary mb-6">format_quote</span>
                    <p className="text-lg font-body italic mb-4">"The networking depth here is unmatched. It's not just a database; it's a living, breathing community of experts."</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img 
                      className="w-10 h-10 rounded-full object-cover grayscale" 
                      alt="David Chen" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-U8RktZeucOz8seDRd8j7o9ZhlV3yPuhjhaXZdQvRaI6QUlyqJIKdk06ixTTQ6U5YvdU9wUmx68ZBISSMYhkW0p_KvbgZQgKUDAutOQ6db9om1trKKwpAsIX2k9TFiFREP38Ll-dLZ4kmRUQmud6qUw5CJto24AqHjLUqh8nzaZD9NBlTZo7WYTf-y4x8miM9GvyaV9s74Q_dZVaGEZqwYZTLv8Ydbeq7cc8yrvfoQuRTpy4_iwOtqZH44siJkYlHaOTJK3_3Sjqc" 
                    />
                    <div>
                      <div className="font-bold text-sm">David Chen</div>
                      <div className="text-xs opacity-60">Venture Partner, Class of '08</div>
                    </div>
                  </div>
                </div>
                <div className="bg-secondary rounded-xl p-8 text-white relative flex flex-col justify-center overflow-hidden h-1/2">
                  <div className="absolute -right-8 -bottom-8 opacity-10">
                    <span className="material-symbols-outlined text-[120px]">psychology</span>
                  </div>
                  <h3 className="text-4xl font-headline font-extrabold mb-2 italic">92%</h3>
                  <p className="text-base font-medium opacity-90">Of our alumni report higher career satisfaction after joining the Mentorship Program.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-surface">
          <div className="container mx-auto px-8">
            <div className="bg-primary-container rounded-3xl p-12 md:p-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/3 h-full hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-container to-transparent z-10"></div>
                <img 
                  className="w-full h-full object-cover opacity-30" 
                  alt="Career Growth" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqVxHwRVXg4ra08QN_2o5m_HQHB9KtN843_Pihf1Dh1jXi0Jr7oQm-jM6TN9kUxOaZQCHUt01r8nE4gtAlp3UHJuoS4uQQV3XHkyyWNtMaIrxUaEJ37Xn554QHOXo78j0Jv83UBbxsWSEyNYdhK8ADoQZzhMhF9tCsLSZAUUwomrHnkUXJIcZWgnK8lZgMcOuPfE06GFgqVZ2WKbGQuEY87iCW0nqx6_o6iCJr2SbZBdbX9FnQY1TWBYmqSCxiU_PtELrRPLsYufc3" 
                />
              </div>
              <div className="relative z-20 max-w-2xl">
                <h2 className="font-headline text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                  Your Seat at the Table <br/>is Waiting.
                </h2>
                <p className="text-on-primary-container text-lg mb-10">
                  Don't miss out on exclusive board opportunities, legacy events, and the combined wisdom of a century of graduates.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/login" className="bg-secondary text-on-secondary px-10 py-4 rounded-lg font-bold hover:bg-secondary-container transition-all">
                    Join Now
                  </Link>
                  <button className="text-white border-b-2 border-white/30 hover:border-white py-4 font-bold transition-all">
                    View Membership Benefits
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black w-full py-12 px-8 border-t border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto space-y-8 md:space-y-0">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="font-headline text-white font-bold text-xl">The Academic Lens</div>
            <div className="font-body text-xs text-slate-400">© 2024 The Academic Lens. All Rights Reserved.</div>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="font-body text-xs text-slate-500 hover:text-white transition-opacity underline decoration-blue-500 underline-offset-4" href="#">About</a>
            <a className="font-body text-xs text-slate-500 hover:text-white transition-opacity underline decoration-blue-500 underline-offset-4" href="#">Contact</a>
            <a className="font-body text-xs text-slate-500 hover:text-white transition-opacity underline decoration-blue-500 underline-offset-4" href="#">Terms of Service</a>
            <a className="font-body text-xs text-slate-500 hover:text-white transition-opacity underline decoration-blue-500 underline-offset-4" href="#">Alumni Giving</a>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-all">
              <span className="material-symbols-outlined text-sm">share</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-all">
              <span className="material-symbols-outlined text-sm">mail</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
