import React, { useState, useEffect } from 'react';
import { 
  getAdminCreds, 
  saveAdminCreds, 
  getCustomCities, 
  saveCustomCities, 
  getCustomZones, 
  saveCustomZones 
} from '../services/storage';

export default function AdminDashboard({ 
  doctors, 
  logs, 
  complaints, 
  onRegisterDoctor, 
  onToggleActive, 
  onDeleteDoctor, 
  onDeleteComplaint, 
  onDeleteLog,
  onClearLogs, 
  navigateTo, 
  logout,
  language
}) {
  const [activeTab, setActiveTab] = useState('registry'); // 'registry', 'inbox', 'logs', 'profile'
  const isUrdu = language === 'ur';

  // Admin Profile & Credentials state
  const [adminCreds, setAdminCreds] = useState(getAdminCreds());
  const [adminName, setAdminName] = useState(adminCreds.name || 'Super Admin');
  const [adminPhone, setAdminPhone] = useState(adminCreds.phone || '03103716116');
  const [adminPassword, setAdminPassword] = useState(adminCreds.password || 'Sadaf@9099');
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Custom Cities & Zones interactive management state
  const [customCities, setCustomCities] = useState(() => getCustomCities());
  const [customZones, setCustomZones] = useState(() => getCustomZones());
  const [newCityName, setNewCityName] = useState('');
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneCity, setNewZoneCity] = useState('D.I.K');

  // Registration Form state
  const [editId, setEditId] = useState('');
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [timings, setTimings] = useState('');
  const [fee, setFee] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [city, setCity] = useState('D.I.K');
  const [zone, setZone] = useState('');
  const [gender, setGender] = useState('Male');
  const [rating, setRating] = useState(0);

  // Dual-mode selectors: 'select' = predefined dropdown, 'custom' = free text entry
  const [specialtyMode, setSpecialtyMode] = useState('select');
  const [cityMode, setCityMode] = useState('select');
  const [zoneMode, setZoneMode] = useState('select');

  // System Logs confirm dialog
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    setAdminCreds(getAdminCreds());
    setCustomCities(getCustomCities());
    setCustomZones(getCustomZones());
  }, []);

  const handleAddCity = (e) => {
    e.preventDefault();
    if (!newCityName.trim()) return;
    const trimmed = newCityName.trim();
    if (customCities.includes(trimmed)) return;
    const updated = [...customCities, trimmed];
    setCustomCities(updated);
    saveCustomCities(updated);
    setNewCityName('');
  };

  const handleDeleteCity = (cityName) => {
    const updated = customCities.filter(c => c !== cityName);
    setCustomCities(updated);
    saveCustomCities(updated);
  };

  const handleAddZone = (e) => {
    e.preventDefault();
    if (!newZoneName.trim() || !newZoneCity) return;
    const trimmed = newZoneName.trim();
    if (customZones.some(z => z.name === trimmed && z.city === newZoneCity)) return;
    const updated = [...customZones, { name: trimmed, city: newZoneCity }];
    setCustomZones(updated);
    saveCustomZones(updated);
    setNewZoneName('');
  };

  const handleDeleteZone = (zoneObj) => {
    const updated = customZones.filter(z => !(z.name === zoneObj.name && z.city === zoneObj.city));
    setCustomZones(updated);
    saveCustomZones(updated);
  };

  const handleAdminProfileSubmit = (e) => {
    e.preventDefault();
    const updated = { name: adminName.trim(), phone: adminPhone.trim(), password: adminPassword.trim() };
    setAdminCreds(updated);
    saveAdminCreds(updated);
    alert(isUrdu ? "ایڈمن کی لاگ ان معلومات محفوظ ہو گئی ہیں!" : "Super Admin credentials updated successfully!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !specialty || !timings.trim() || !fee || !phone.trim() || !pin.trim() || !zone) return;

    onRegisterDoctor({
      id: editId,
      name: name.trim(),
      specialty,
      timings: timings.trim(),
      fee: parseInt(fee),
      phone: phone.trim(),
      pin: pin.trim(),
      city: city || 'D.I.K',
      zone: zone,
      gender: gender,
      rating: typeof rating === 'number' ? rating : (parseFloat(rating) || 0)
    });

    handleReset();
  };

  const handleEdit = (doc) => {
    setEditId(doc.id);
    setName(doc.name);
    setSpecialty(doc.specialty);
    setTimings(doc.timings);
    setFee(doc.fee);
    setPhone(doc.phone);
    setPin(doc.pin);
    setCity(doc.city || 'D.I.K');
    setZone(doc.zone || '');
    setGender(doc.gender || 'Male');
    setRating(doc.rating || 0);
  };

  const handleReset = () => {
    setEditId('');
    setName('');
    setSpecialty('');
    setTimings('');
    setFee('');
    setPhone('');
    setPin('');
    setCity('D.I.K');
    setZone('');
    setGender('Male');
    setRating(0);
    setShowPin(false);
  };

  const uniqueSpecialties = Array.from(new Set([
    "Cardiologist", "Gynecologist", "Pediatrician", "Neurologist", "Orthopedic", 
    "Dermatologist", "ENT", "Ophthalmologist", "Psychiatrist", "Urologist", "Gastroenterologist",
    ...doctors.filter(d => d && d.specialty).map(d => d.specialty)
  ]));

  const uniqueCities = Array.from(new Set([
    ...customCities,
    "D.I.K", "Tank", "Lakki Marwat", "Peshawar",
    ...doctors.filter(d => d && d.city).map(d => d.city)
  ]));

  const uniqueZones = Array.from(new Set([
    ...customZones.map(z => typeof z === 'string' ? z : z.name),
    "Cantt", "Muryali", "Circular Road", "Topanwala", "Town Hall", "Main Bazar",
    ...doctors.filter(d => d && d.zone).map(d => d.zone)
  ]));

  // Metrics calculations
  const totalTokens = doctors.reduce((sum, d) => sum + (d && d.queue ? d.queue.length : 0), 0);
  const servedCount = doctors.reduce((sum, d) => sum + (d && d.currentServing ? d.currentServing : 0), 0);
  const activeQueueCount = (totalTokens - servedCount) > 0 ? (totalTokens - servedCount) : 0;

  return (
    <section className="space-y-6 max-w-7xl mx-auto">
      
      {/* Admin Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-left">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-950/40 text-red-500 rounded-2xl flex items-center justify-center text-xl shadow-inner">
            <i className="fa-solid fa-user-gear"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-850 dark:text-white">Super Admin Control Hub</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Manage registry access, visitor queries, and server audits</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigateTo('home')} 
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1 dark:text-slate-300"
          >
            <i className="fa-solid fa-arrow-left"></i> Public Hub
          </button>
          <button 
            onClick={logout} 
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>{isUrdu ? 'لاگ آؤٹ' : 'Logout Staff'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Dashboard Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center text-lg"><i className="fa-solid fa-user-doctor"></i></div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Registered Doctors</div>
            <div className="text-xl font-extrabold">{doctors.length}</div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-lg"><i className="fa-solid fa-ticket"></i></div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Tokens Today</div>
            <div className="text-xl font-extrabold">{totalTokens}</div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center text-lg"><i className="fa-solid fa-check-double"></i></div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Served Patients</div>
            <div className="text-xl font-extrabold">{servedCount}</div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-lg"><i className="fa-solid fa-inbox"></i></div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Inbox Queries</div>
            <div className="text-xl font-extrabold">{complaints.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs Control Row */}
      <div className="flex flex-nowrap border-b border-slate-200 dark:border-slate-800 overflow-x-auto w-full whitespace-nowrap scrollbar-none">
        <button 
          onClick={() => setActiveTab('registry')}
          className={`px-5 py-2.5 font-bold text-xs border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'registry' 
              ? 'border-green-500 text-green-600 dark:text-green-400' 
              : 'border-transparent text-slate-500 hover:text-slate-750 dark:hover:text-slate-350'
          }`}
        >
          <i className="fa-solid fa-users-gear"></i> {isUrdu ? 'معالجین کا ڈیٹا بائیس' : 'Doctor Registry'}
        </button>
        <button 
          onClick={() => setActiveTab('inbox')}
          className={`px-5 py-2.5 font-bold text-xs border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'inbox' 
              ? 'border-green-500 text-green-600 dark:text-green-400' 
              : 'border-transparent text-slate-500 hover:text-slate-750 dark:hover:text-slate-350'
          }`}
        >
          <i className="fa-solid fa-inbox"></i> {isUrdu ? 'شکایات و ان باکس' : 'Patient Complaints Inbox'}
        </button>
        <button 
          onClick={() => setActiveTab('logs')}
          className={`px-5 py-2.5 font-bold text-xs border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'logs' 
              ? 'border-green-500 text-green-600 dark:text-green-400' 
              : 'border-transparent text-slate-500 hover:text-slate-750 dark:hover:text-slate-350'
          }`}
        >
          <i className="fa-solid fa-receipt"></i> {isUrdu ? 'سسٹم اڈٹ لاگز' : 'System Logs'}
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-2.5 font-bold text-xs border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'profile' 
              ? 'border-green-500 text-green-600 dark:text-green-400' 
              : 'border-transparent text-slate-500 hover:text-slate-750 dark:hover:text-slate-350'
          }`}
        >
          <i className="fa-solid fa-user-shield"></i> {isUrdu ? 'ایڈمن پروفائل و زون ترتیبات' : 'Admin Profile & Multi-City Hub'}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        
        {/* TAB 1: Doctor Registry */}
        {activeTab === 'registry' && (
          <div className="grid lg:grid-cols-3 gap-6 text-left">
            
            {/* Create / Edit Form */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 h-fit">
              <h2 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                {editId ? 'Modify Doctor Config' : 'Register New Doctor Access'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Doctor Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    placeholder="Enter doctor name" 
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-green-500 outline-none dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-green-500 outline-none dark:text-slate-100"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* --- Specialty: dual-mode selector --- */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Specialty Category</label>
                    <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 text-[10px] font-bold self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => { setSpecialtyMode('select'); setSpecialty(''); }}
                        className={`px-2.5 py-1 transition-all ${specialtyMode === 'select' ? 'bg-green-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                      >
                        Select Existing
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSpecialtyMode('custom'); setSpecialty(''); }}
                        className={`px-2.5 py-1 transition-all ${specialtyMode === 'custom' ? 'bg-green-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                      >
                        Add Custom
                      </button>
                    </div>
                  </div>
                  {specialtyMode === 'select' ? (
                    <select
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-green-500 outline-none dark:text-slate-100"
                    >
                      <option value="" disabled>Select specialty</option>
                      {uniqueSpecialties.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      required
                      placeholder="Type new specialty (e.g. Sports Medicine)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-green-300 dark:border-green-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-green-500 outline-none dark:text-slate-100"
                    />
                  )}
                  {specialtyMode === 'custom' && (
                    <p className="text-[10px] text-green-600 dark:text-green-400 mt-0.5">
                      <i className="fa-solid fa-circle-plus mr-1"></i>New specialty will be added to the system registry.
                    </p>
                  )}
                </div>

                {/* --- Zone: dual-mode selector --- */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">D.I.K Local Medical Zone</label>
                    <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 text-[10px] font-bold self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => { setZoneMode('select'); setZone(''); }}
                        className={`px-2.5 py-1 transition-all ${zoneMode === 'select' ? 'bg-green-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                      >
                        Select Existing
                      </button>
                      <button
                        type="button"
                        onClick={() => { setZoneMode('custom'); setZone(''); }}
                        className={`px-2.5 py-1 transition-all ${zoneMode === 'custom' ? 'bg-green-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                      >
                        Add Custom
                      </button>
                    </div>
                  </div>
                  {zoneMode === 'select' ? (
                    <select
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-green-500 outline-none dark:text-slate-100"
                    >
                      <option value="" disabled>Select D.I.K zone</option>
                      {uniqueZones.map(z => (
                        <option key={z} value={z}>{z}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                      required
                      placeholder="Type new area (e.g. Qureshi Mor)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-green-300 dark:border-green-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-green-500 outline-none dark:text-slate-100"
                    />
                  )}
                  {zoneMode === 'custom' && (
                    <p className="text-[10px] text-green-600 dark:text-green-400 mt-0.5">
                      <i className="fa-solid fa-location-dot mr-1"></i>New area will appear in homepage zone filters.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Clinic Timings</label>
                    <input 
                      type="text" 
                      value={timings} 
                      onChange={(e) => setTimings(e.target.value)} 
                      required 
                      placeholder="e.g. 09:00 AM - 01:00 PM" 
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-green-500 outline-none dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Fee ($)</label>
                    <input 
                      type="number" 
                      value={fee} 
                      onChange={(e) => setFee(e.target.value)} 
                      required 
                      placeholder="Fee" 
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-green-500 outline-none dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300"><i className="fa-solid fa-lock text-green-600 mr-1"></i> Dashboard Login Credentials</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5">Mobile Phone</label>
                      <input 
                        type="tel" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required 
                        placeholder="Phone Number" 
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:placeholder-slate-400 focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5">4-Digit PIN</label>
                      <div className="relative">
                        <input 
                          type={showPin ? 'text' : 'password'} 
                          value={pin} 
                          onChange={(e) => setPin(e.target.value)} 
                          required 
                          pattern="[0-9]{4}" 
                          maxLength={4} 
                          placeholder="PIN Code" 
                          className="w-full pl-2.5 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:placeholder-slate-400 focus:ring-2 focus:ring-green-500 outline-none font-mono"
                        />
                        <button type="button" onClick={() => setShowPin(!showPin)} className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                          <i className={`fa-solid ${showPin ? 'fa-eye-slash' : 'fa-eye'} text-[10px]`}></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {editId && (
                    <button type="button" onClick={handleReset} className="flex-1 py-2 border border-slate-200 dark:border-slate-750 rounded-xl text-xs font-bold hover:bg-slate-100 text-slate-700 dark:text-slate-300">
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl shadow-md transition-all">
                    {editId ? 'Update Config' : 'Save Access Rule'}
                  </button>
                </div>
              </form>
            </div>

            {/* Registry List Table */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Active Doctor Directories</h2>
              
              {/* Desktop Table View (hidden on mobile) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                      <th className="py-2.5">Doctor</th>
                      <th className="py-2.5">Specialty</th>
                      <th className="py-2.5">Phone / PIN</th>
                      <th className="py-2.5">Fee & Hours</th>
                      <th className="py-2.5">Active</th>
                      <th className="py-2.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {doctors.map(doc => {
                      if (!doc) return null;
                      return (
                        <tr key={doc.id} className="border-b border-slate-100 dark:border-slate-805 hover:bg-slate-50/50 dark:hover:bg-slate-850/30">
                          <td className="py-3 font-bold text-slate-805 dark:text-slate-200">
                            {doc.name} 
                            {doc.isOnLeave && (
                              <span className="ml-1 text-[9px] bg-red-100 dark:bg-red-950 text-red-500 px-1.5 py-0.5 rounded font-semibold">Leave</span>
                            )}
                          </td>
                          <td className="py-3 text-slate-655 dark:text-slate-400 font-semibold">
                            <span className="block">{doc.specialty}</span>
                            <span className="block text-[10px] text-slate-400 font-medium"><i className="fa-solid fa-location-dot text-green-500 mr-0.5"></i> {doc.zone || 'N/A'}</span>
                          </td>
                          <td className="py-3 font-mono text-[11px] text-slate-500">
                            <span className="block">P: {doc.phone}</span>
                            <span className="block text-slate-400">PIN: {doc.pin}</span>
                            <span className="block text-[10px] font-semibold text-slate-400">G: {doc.gender || 'Male'}</span>
                          </td>
                          <td className="py-3 text-slate-500">
                            <span className="block font-medium">{doc.timings}</span>
                            <span className="block text-green-600 dark:text-green-400 font-bold">${doc.fee}</span>
                          </td>
                          <td className="py-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={doc.isActive !== false} 
                                onChange={() => onToggleActive(doc.id)} 
                                className="sr-only peer"
                              />
                              <div className="w-8.5 h-4.5 bg-slate-350 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                          </td>
                          <td className="py-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button onClick={() => handleEdit(doc)} className="p-1 px-2 bg-blue-500/10 text-blue-550 hover:bg-blue-500 hover:text-white rounded-lg transition-colors font-bold text-[10px]">Edit</button>
                              <button onClick={() => {
                                if (window.confirm("Are you sure you want to revoke this doctor's login access?")) {
                                  onDeleteDoctor(doc.id);
                                }
                              }} className="p-1 px-2 bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white rounded-lg transition-colors font-bold text-[10px]">Revoke</button>
                              <button onClick={() => {
                                if (window.confirm("Are you sure you want to permanently remove this doctor from the registry?")) {
                                  onDeleteDoctor(doc.id);
                                }
                              }} className="p-1 px-2 bg-red-500/10 text-red-550 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-bold text-[10px] flex items-center gap-0.5">
                                <span>🗑️ Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Card View (hidden on desktop) */}
              <div className="block md:hidden space-y-4">
                {doctors.map(doc => {
                  if (!doc) return null;
                  return (
                    <div key={doc.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-805 bg-slate-50/50 dark:bg-slate-850/10 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-extrabold text-sm text-slate-850 dark:text-slate-100 flex items-center gap-1">
                            {doc.name}
                            {doc.isOnLeave && (
                              <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-500 px-1.5 py-0.5 rounded font-semibold">Leave</span>
                            )}
                          </div>
                          <div className="text-xs text-slate-655 dark:text-slate-400 font-semibold mt-0.5">
                            {doc.specialty} <span className="text-slate-400 font-normal">({doc.zone || 'N/A'})</span>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input 
                            type="checkbox" 
                            checked={doc.isActive !== false} 
                            onChange={() => onToggleActive(doc.id)} 
                            className="sr-only peer"
                          />
                          <div className="w-8.5 h-4.5 bg-slate-350 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                        <div>
                          <span className="block font-medium">Phone: <span className="font-mono">{doc.phone}</span></span>
                          <span className="block font-medium">PIN: <span className="font-mono">{doc.pin}</span></span>
                          <span className="block font-semibold">Gender: {doc.gender || 'Male'}</span>
                        </div>
                        <div className="text-right">
                          <span className="block font-medium">{doc.timings}</span>
                          <span className="block font-extrabold text-green-600 dark:text-green-400 text-xs mt-0.5">${doc.fee} Fee</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button onClick={() => handleEdit(doc)} className="flex-1 py-2 bg-blue-500/10 text-blue-550 hover:bg-blue-500 hover:text-white rounded-xl transition-all font-bold text-xs">
                          <i className="fa-solid fa-pen-to-square"></i> Edit
                        </button>
                        <button onClick={() => {
                          if (window.confirm("Are you sure you want to revoke this doctor's login access?")) {
                            onDeleteDoctor(doc.id);
                          }
                        }} className="flex-1 py-2 bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white rounded-xl transition-all font-bold text-xs">
                          Revoke
                        </button>
                        <button onClick={() => {
                          if (window.confirm("Are you sure you want to permanently remove this doctor from the registry?")) {
                            onDeleteDoctor(doc.id);
                          }
                        }} className="flex-1 py-2 bg-red-500/10 text-red-550 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-xs">
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Patient Complaints Inbox */}
        {activeTab === 'inbox' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-left space-y-4 max-w-4xl mx-auto">
            <h2 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Patient Complaints & Inbox Queries</h2>
            <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                    <th className="p-3">Sender Name</th>
                    <th className="p-3">Mobile Phone</th>
                    <th className="p-3">Complaint Message</th>
                    <th className="p-3 text-right">Time Submitted</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {complaints.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30">
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{item.name}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-500">{item.phone}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-350 max-w-xs break-words">{item.message}</td>
                      <td className="p-3 text-right text-slate-405 text-[10px]">{item.time}</td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => onDeleteComplaint(item.id)} 
                          className="text-red-500 hover:text-red-700 text-xs font-bold"
                          title="Delete Query"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {complaints.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <i className="fa-solid fa-folder-open text-3xl mb-2"></i>
                  <div className="text-xs font-semibold">Complaints inbox is completely clear!</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: System Logs */}
        {activeTab === 'logs' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-left max-w-4xl mx-auto space-y-4">
            
            {/* Header row */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h2 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Global System Activity Log</h2>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-300 dark:border-red-700 rounded-xl text-[10px] font-bold transition-all"
              >
                <i className="fa-solid fa-broom"></i> Clear All Logs
              </button>
            </div>

            {/* Confirmation prompt */}
            {showClearConfirm && (
              <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex-1">
                  <p className="text-xs font-bold text-red-600 dark:text-red-400">⚠️ Clear all system logs?</p>
                  <p className="text-[10px] text-red-500 mt-0.5">This action is permanent and cannot be undone. All audit trail entries will be wiped.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => { onClearLogs(); setShowClearConfirm(false); }}
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold rounded-xl transition-all"
                  >
                    Yes, Wipe All
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Log entries */}
            <div className="h-80 overflow-y-auto bg-slate-50 dark:bg-slate-950/70 border border-slate-150 dark:border-slate-850 p-4 rounded-2xl text-xs font-mono space-y-1.5 text-slate-600 dark:text-slate-350">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 border-b border-dashed border-slate-100 dark:border-slate-850 pb-1.5 last:border-0 group">
                  <p className="flex-1 leading-relaxed">{log}</p>
                  <button
                    onClick={() => onDeleteLog(idx)}
                    title="Delete this log entry"
                    className="opacity-0 group-hover:opacity-100 shrink-0 w-5 h-5 flex items-center justify-center rounded text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-600 transition-all"
                  >
                    <i className="fa-solid fa-trash text-[9px]"></i>
                  </button>
                </div>
              ))}
              {logs.length === 0 && (
                <p className="text-slate-400 text-center py-10">No active system logs found.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Admin Profile & Multi-City Hub */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-left max-w-3xl mx-auto space-y-6">
            <h2 className="text-base font-bold flex items-center gap-2 text-slate-850 dark:text-white">
              <i className="fa-solid fa-user-shield text-green-500"></i>
              <span>{isUrdu ? 'ایڈمن پروفائل ترتیبات و ملٹی سٹی منیجر' : 'Super Admin Profile & Multi-City Settings'}</span>
            </h2>

            <form onSubmit={handleAdminProfileSubmit} className="space-y-4 p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                {isUrdu ? 'لاگ ان معلومات اپ ڈیٹ کریں' : 'Update Credentials'}
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {isUrdu ? 'ایڈمن کا نام' : 'Admin Name'}
                  </label>
                  <input 
                    type="text" 
                    value={adminName} 
                    onChange={(e) => setAdminName(e.target.value)} 
                    required 
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-green-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {isUrdu ? 'لاگ ان فون نمبر' : 'Mobile Phone'}
                  </label>
                  <input 
                    type="tel" 
                    value={adminPhone} 
                    onChange={(e) => setAdminPhone(e.target.value)} 
                    required 
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-green-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {isUrdu ? 'لاگ ان پاس ورڈ' : 'Account Password'}
                  </label>
                  <div className="relative">
                    <input 
                      type={showAdminPass ? 'text' : 'password'} 
                      value={adminPassword} 
                      onChange={(e) => setAdminPassword(e.target.value)} 
                      required 
                      className="w-full pl-3 pr-10 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-green-500 font-mono"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowAdminPass(!showAdminPass)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <i className={`fa-solid ${showAdminPass ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                    </button>
                  </div>
                </div>
              </div>
              <button 
                type="submit" 
                className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                {isUrdu ? 'معلومات محفوظ کریں' : 'Save Admin Profile'}
              </button>
            </form>

            {/* Fully Interactive Multi-City & Zone Manager Console */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-6">
              <div>
                <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                  <i className="fa-solid fa-city text-teal-500"></i>
                  <span>{isUrdu ? 'فعال شہر منیجر (شہر شامل کریں/حذف کریں)' : 'Active Cities Manager'}</span>
                </h3>

                {/* Form: Add New City */}
                <form onSubmit={handleAddCity} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newCityName}
                    onChange={(e) => setNewCityName(e.target.value)}
                    placeholder={isUrdu ? 'نیا شہر (مثلاً ٹانک)' : 'Add new city (e.g. Tank)'}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1 shrink-0"
                  >
                    <i className="fa-solid fa-plus"></i> {isUrdu ? 'شہر شامل کریں' : 'Add City'}
                  </button>
                </form>

                {/* Cities Pill Badges List */}
                <div className="flex flex-wrap gap-2 pt-3">
                  {customCities.map(c => (
                    <span key={c} className="px-3 py-1.5 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-xs font-bold flex items-center gap-2 group shadow-sm">
                      <span><i className="fa-solid fa-city mr-1 text-teal-500"></i>{c}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCity(c)}
                        className="text-red-400 hover:text-red-600 transition-colors ml-1 focus:outline-none"
                        title={`Delete ${c}`}
                      >
                        <i className="fa-solid fa-xmark text-xs"></i>
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
                <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                  <i className="fa-solid fa-location-dot text-green-500"></i>
                  <span>{isUrdu ? 'میڈیکل زونز منیجر (زون شامل کریں/حذف کریں)' : 'Healthcare Zones Manager'}</span>
                </h3>

                {/* Form: Add New Zone under a City */}
                <form onSubmit={handleAddZone} className="mt-3 grid sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newZoneName}
                    onChange={(e) => setNewZoneName(e.target.value)}
                    placeholder={isUrdu ? 'نیا زون (مثلاً قریشی موڑ)' : 'New zone (e.g. Qureshi Mor)'}
                    className="sm:col-span-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-green-500 font-medium"
                  />
                  <select
                    value={newZoneCity}
                    onChange={(e) => setNewZoneCity(e.target.value)}
                    className="sm:col-span-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-green-500 font-medium"
                  >
                    {customCities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="sm:col-span-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center gap-1 shrink-0"
                  >
                    <i className="fa-solid fa-plus"></i> {isUrdu ? 'زون شامل کریں' : 'Add Zone'}
                  </button>
                </form>

                {/* Zones Pill Badges List */}
                <div className="flex flex-wrap gap-2 pt-3">
                  {customZones.map(z => {
                    const zName = typeof z === 'string' ? z : z.name;
                    const zCity = typeof z === 'string' ? 'D.I.K' : z.city;
                    return (
                      <span key={`${zName}-${zCity}`} className="px-3 py-1.5 rounded-xl bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30 text-xs font-bold flex items-center gap-2 group shadow-sm">
                        <span><i className="fa-solid fa-location-dot mr-1 text-green-500"></i>{zCity} - {zName}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteZone(z)}
                          className="text-red-400 hover:text-red-600 transition-colors ml-1 focus:outline-none"
                          title={`Delete ${zName}`}
                        >
                          <i className="fa-solid fa-xmark text-xs"></i>
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </section>
  );
}
