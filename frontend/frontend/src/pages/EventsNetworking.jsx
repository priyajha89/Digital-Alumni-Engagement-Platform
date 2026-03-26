import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { eventService, donationService } from '../services';
import { useAuth } from '../context/AuthContext';

const EventsNetworking = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rsvped, setRsvped] = useState({});
  const [filter, setFilter] = useState('all');
  const [donateAmount, setDonateAmount] = useState('');
  const [donateMsg, setDonateMsg] = useState('');
  const [myDonations, setMyDonations] = useState([]);
  const [totalDonated, setTotalDonated] = useState(0);

  useEffect(() => {
    eventService.getAll().then(res => {
      const evts = res.data;
      setEvents(evts);
      const initial = {};
      evts.forEach(ev => {
        if (ev.attendees?.includes(user._id)) initial[ev._id] = true;
      });
      setRsvped(initial);
    }).finally(() => setLoading(false));

    donationService.getMyDonations().then(res => {
      setMyDonations(res.data);
      setTotalDonated(res.data.reduce((acc, d) => acc + d.amount, 0));
    });
  }, [user._id]);

  const handleRsvp = async (eventId) => {
    const res = await eventService.rsvp(eventId);
    const updated = res.data.event;
    setEvents(prev => prev.map(e => e._id === eventId ? updated : e));
    setRsvped(prev => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const handleDonate = async () => {
    if (!donateAmount || isNaN(donateAmount) || Number(donateAmount) <= 0) { setDonateMsg('Enter a valid amount'); return; }
    try {
      await donationService.donate(Number(donateAmount));
      setDonateMsg(`🎉 Thank you for donating $${donateAmount}!`);
      setTotalDonated(prev => prev + Number(donateAmount));
      setDonateAmount('');
    } catch { setDonateMsg('Donation failed. Try again.'); }
  };

  const filtered = filter === 'all' ? events : events.filter(e => e.type === filter);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <DashboardLayout>
      <header className="mb-10">
        <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-2">Alumni Events</span>
        <h1 className="text-5xl font-headline font-extrabold text-primary tracking-tight mb-2">Events & Networking</h1>
        <p className="text-slate-500 text-lg">Stay connected. Attend, RSVP, and network.</p>
      </header>

      {/* Donation Widget */}
      <div className="grid grid-cols-12 gap-6 mb-12">
        <div className="col-span-12 lg:col-span-8 bg-primary rounded-2xl p-8 text-white">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="material-symbols-outlined text-amber-400 text-4xl mb-3">volunteer_activism</span>
              <h3 className="text-3xl font-extrabold mb-2">Empower the Future</h3>
              <p className="text-slate-400 text-sm max-w-sm">Your contributions fund the next generation of pioneers. Every dollar matters.</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">You've Donated</p>
              <p className="text-4xl font-extrabold text-secondary">${totalDonated}</p>
              <p className="text-xs text-slate-500">{myDonations.length} donation{myDonations.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Enter amount ($)"
              value={donateAmount}
              onChange={e => setDonateAmount(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-secondary"
            />
            <button onClick={handleDonate} className="px-6 py-3 bg-secondary rounded-lg font-bold hover:opacity-90 transition-all">
              Donate
            </button>
          </div>
          {donateMsg && <p className="text-green-300 text-sm mt-3">{donateMsg}</p>}
        </div>
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between">
          <h4 className="font-bold text-primary text-lg mb-2">Your Donation History</h4>
          {myDonations.length === 0
            ? <p className="text-slate-400 text-sm mt-2">No donations yet.</p>
            : <div className="space-y-2 overflow-y-auto max-h-44">
              {myDonations.map(d => (
                <div key={d._id} className="flex justify-between text-sm">
                  <span className="text-slate-600">{new Date(d.createdAt).toLocaleDateString()}</span>
                  <span className="font-bold text-secondary">${d.amount}</span>
                </div>
              ))}
            </div>
          }
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        {['all', 'in-person', 'virtual', 'hybrid'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all ${filter === f ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {f === 'all' ? 'All Events' : f}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <section>
        <h4 className="text-2xl font-bold text-primary mb-6">
          {filtered.length} Event{filtered.length !== 1 ? 's' : ''} Found
        </h4>
        {loading && <p className="text-slate-400">Loading events...</p>}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-2xl">
            <span className="material-symbols-outlined text-6xl text-slate-300">event_busy</span>
            <p className="text-slate-400 mt-4 font-medium">No events found for this filter.</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map(ev => (
            <div key={ev._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-md transition-all flex flex-col">
              {ev.imageUrl
                ? <div className="h-48 overflow-hidden"><img className="w-full h-full object-cover group-hover:scale-105 transition-transform" src={ev.imageUrl} alt={ev.title} /></div>
                : <div className="h-48 bg-gradient-to-br from-primary to-secondary/60 flex items-center justify-center"><span className="material-symbols-outlined text-white text-6xl">event</span></div>
              }
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">{formatDate(ev.date)}</p>
                    <h5 className="text-lg font-bold text-primary">{ev.title}</h5>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase shrink-0 ${ev.type === 'virtual' ? 'bg-blue-100 text-blue-600' : ev.type === 'hybrid' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-700'}`}>{ev.type}</span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 mb-3">{ev.description}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {ev.location}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                  <span className="material-symbols-outlined text-sm">group</span>
                  {ev.attendees?.length || 0} attending
                </div>
                <div className="mt-auto">
                  <button
                    onClick={() => handleRsvp(ev._id)}
                    className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${rsvped[ev._id] ? 'bg-green-100 text-green-700' : 'bg-secondary text-white hover:opacity-90'}`}
                  >
                    {rsvped[ev._id] ? '✓ Attending — Cancel RSVP' : 'RSVP Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default EventsNetworking;
