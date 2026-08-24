import React, { useState, useEffect } from 'react';

const playChimeAndTTS = (tokenNum, patientName, language) => {
  try {
    // Force cancel any queued silent/inactive speech states immediately to clear queue block
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // 1. Play Chime Sound using HTML5 Web Audio API sine wave oscillators
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      const audioCtx = new AudioContext();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      // First tone (G5)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(783.99, audioCtx.currentTime); // G5
      gain1.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc1.start(audioCtx.currentTime);
      osc1.stop(audioCtx.currentTime + 0.35);

      // Second tone (C6) at 0.15s offset
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.15); // C6
      gain2.gain.setValueAtTime(0.15, audioCtx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
      osc2.start(audioCtx.currentTime + 0.15);
      osc2.stop(audioCtx.currentTime + 0.5);
    }
  } catch (err) {
    console.error("Web Audio chime failed", err);
  }

  // 2. Text-to-Speech Voice announcement
  setTimeout(() => {
    try {
      if ('speechSynthesis' in window) {
        const isUrdu = language === 'ur';
        const phrase = isUrdu
          ? `ٹوکن نمبر ${tokenNum}، محترم ${patientName}، برائے مہربانی اندر تشریف لائیں`
          : `Token Number ${tokenNum}, ${patientName}, please proceed inside`;

        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.lang = isUrdu ? 'ur-PK' : 'en-US';
        utterance.pitch = 1.0;
        utterance.rate = 0.9;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (speechErr) {
      console.error("Text-to-speech failed", speechErr);
    }
  }, 400);
};

export default function DoctorDashboard({ 
  doc, 
  onUpdateConfig, 
  onToggleLeave, 
  onCallNext, 
  onSkipToken,
  onMarkComplete,
  onDeleteToken,
  onClearQueue,
  onAddWalkIn, 
  navigateTo, 
  logout,
  language
}) {
  const [activeTab, setActiveTab] = useState('queue'); // 'queue', 'profile', 'schedule'
  
  // Profile inputs
  const [docName, setDocName] = useState(doc.name);
  const [specialty, setSpecialty] = useState(doc.specialty || '');
  const [docPhone, setDocPhone] = useState(doc.phone || '');
  const [docPin, setDocPin] = useState(doc.pin || '');
  const [showDocPin, setShowDocPin] = useState(false);
  const [tempBanner, setTempBanner] = useState(doc.banner || '');
  const [tempAvatar, setTempAvatar] = useState(doc.avatar || '');
  const [bannerUrl, setBannerUrl] = useState(doc.banner && (doc.banner.startsWith('data:') || doc.banner.startsWith('bg-')) ? '' : doc.banner || '');
  const [hidePhone, setHidePhone] = useState(doc.hidePhone || false);
  
  // Schedule inputs
  const [fee, setFee] = useState(doc.fee);
  const [timings, setTimings] = useState(doc.timings);

  // Broadcast delay in minutes (0 = not set)
  const [delayMinutes, setDelayMinutes] = useState('');
  
  // Walk-in inputs
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [justGeneratedToken, setJustGeneratedToken] = useState(null);
  const [callLanguage, setCallLanguage] = useState(() => localStorage.getItem('dik_call_language') || 'ur');

  useEffect(() => {
    setDocName(doc.name);
    setSpecialty(doc.specialty || '');
    setDocPhone(doc.phone || '');
    setDocPin(doc.pin || '');
    setTempBanner(doc.banner || '');
    setTempAvatar(doc.avatar || '');
    setBannerUrl(doc.banner && (doc.banner.startsWith('data:') || doc.banner.startsWith('bg-')) ? '' : doc.banner || '');
    setHidePhone(doc.hidePhone || false);
    setFee(doc.fee);
    setTimings(doc.timings);
  }, [doc]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    onUpdateConfig(doc.id, {
      name: docName,
      specialty: specialty,
      phone: docPhone,
      pin: docPin,
      banner: tempBanner,
      avatar: tempAvatar,
      hidePhone: hidePhone
    });
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    onUpdateConfig(doc.id, {
      fee: parseInt(fee),
      timings: timings
    });
  };

  const handleWalkInSubmit = (e) => {
    e.preventDefault();
    if (!walkinName.trim() || !walkinPhone.trim()) return;
    const token = onAddWalkIn(doc.id, walkinName.trim(), walkinPhone.trim());
    if (token) {
      setJustGeneratedToken(token);
    }
    setWalkinName('');
    setWalkinPhone('');
  };

  // Base64 file loaders
  const handleBannerFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempBanner(reader.result);
      setBannerUrl('');
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleBannerColor = (colorClass) => {
    setTempBanner(colorClass);
    setBannerUrl('');
  };

  const handleBannerUrlInput = (url) => {
    setBannerUrl(url);
    if (url.trim()) {
      setTempBanner(url.trim());
    }
  };

  const servingVal = doc.currentServing || 0;
  const pendingQueue = doc.queue || [];
  const initials = doc.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <section className="space-y-6 max-w-5xl mx-auto">
      
      {/* Doctor Header Banner Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm text-left">
        
        {/* Banner Container: w-full h-44 sm:h-60 object-cover rounded-xl */}
        <div className="w-full h-44 sm:h-60 rounded-xl overflow-hidden relative shadow-inner">
          {tempBanner && tempBanner.startsWith('bg-') ? (
            <div className={`w-full h-full ${tempBanner}`}></div>
          ) : (
            <img src={tempBanner || ''} alt="Clinic Banner" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black/15"></div>
          <span className="absolute bottom-3 left-3 text-[10px] text-white/90 bg-black/45 px-2.5 py-0.5 rounded-full font-bold">
            Clinic Banner Live Preview
          </span>
        </div>

        {/* Profile Info Position: completely BELOW the banner image in a clear row (flex flex-col sm:flex-row items-center gap-4 mt-4 px-2) */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 px-2">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-850 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-md overflow-hidden shrink-0">
              {tempAvatar ? (
                <img src={tempAvatar} alt="Doctor Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-green-500 text-white">{initials}</div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-850 dark:text-white leading-tight">{doc.name}</h1>
              <p className="text-xs text-green-600 dark:text-green-400 font-semibold">{doc.specialty}</p>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <button 
              onClick={() => navigateTo('home')} 
              className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 dark:text-slate-300"
            >
              <i className="fa-solid fa-arrow-left"></i> Public Hub
            </button>
            <button 
              onClick={logout} 
              className="flex-1 sm:flex-none px-4 py-2 bg-red-500 hover:bg-red-650 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5"
            >
              <i className="fa-solid fa-right-from-bracket"></i> Exit Portal
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 w-full overflow-x-auto scrollbar-none">
        <button 
          onClick={() => setActiveTab('queue')}
          className={`flex-1 min-w-[100px] justify-center px-4 py-2.5 font-bold text-xs border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'queue' 
              ? 'border-green-500 text-green-600 dark:text-green-400' 
              : 'border-transparent text-slate-500 hover:text-slate-750 dark:hover:text-slate-305'
          }`}
        >
          <i className="fa-solid fa-people-group"></i> <span className="truncate">Live Queue</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex-1 min-w-[100px] justify-center px-4 py-2.5 font-bold text-xs border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'profile' 
              ? 'border-green-500 text-green-600 dark:text-green-400' 
              : 'border-transparent text-slate-500 hover:text-slate-750 dark:hover:text-slate-305'
          }`}
        >
          <i className="fa-solid fa-user-doctor"></i> <span className="truncate">Profile & Media</span>
        </button>
        <button 
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 min-w-[100px] justify-center px-4 py-2.5 font-bold text-xs border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'schedule' 
              ? 'border-green-500 text-green-600 dark:text-green-400' 
              : 'border-transparent text-slate-500 hover:text-slate-750 dark:hover:text-slate-305'
          }`}
        >
          <i className="fa-solid fa-calendar-days"></i> <span className="truncate">Schedule & Fee</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        
        {/* TAB 1: Live Queue */}
        {activeTab === 'queue' && (
          <div className="grid md:grid-cols-3 gap-6 text-left">
            
            {/* Queue Counter & Call Next */}
            <div className="md:col-span-2 bg-white dark:bg-slate-900 p-3 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
              
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${doc.isDelayed ? 'bg-amber-500 animate-pulse' : 'bg-red-500 animate-ping'}`}></span>
                    Live Patients Queue
                  </h2>
                  <p className="text-xs text-slate-500">Track and serve token appointments consecutively</p>
                </div>

                <div className="grid grid-cols-2 gap-2 w-full xl:flex xl:flex-wrap xl:items-center xl:w-auto">
                  {/* Delay Toggle Control */}
                  <button 
                    type="button"
                    onClick={() => onUpdateConfig(doc.id, { isDelayed: !doc.isDelayed })}
                    className={`px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      doc.isDelayed 
                        ? 'bg-amber-500 text-white shadow shadow-amber-500/20' 
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350'
                    }`}
                  >
                    <i className={`fa-solid ${doc.isDelayed ? 'fa-play' : 'fa-pause'}`}></i>
                    <span className="truncate">{doc.isDelayed ? 'Resume' : 'Pause/Delay'}</span>
                  </button>

                  {/* Skip Current Token */}
                  <button 
                    type="button"
                    onClick={() => onSkipToken(doc.id)} 
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] sm:text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    title="Skip current patient"
                  >
                    <i className="fa-solid fa-angles-right"></i>
                    <span className="truncate">Skip Token</span>
                  </button>

                  {/* Mark Current Complete */}
                  <button 
                    type="button"
                    onClick={() => onMarkComplete && onMarkComplete(doc.id)} 
                    className="px-3.5 py-2 bg-teal-500 hover:bg-teal-600 text-white font-bold text-[11px] sm:text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    title="Mark current patient as served/complete"
                  >
                    <i className="fa-solid fa-circle-check"></i>
                    <span className="truncate">Mark Complete</span>
                  </button>

                  {/* Call Next Token & Language Switcher Dropdown */}
                  <div className="flex gap-1.5 items-center w-full">
                    <button 
                      type="button"
                      onClick={() => {
                        const nextTokenNum = (doc.currentServing || 0) + 1;
                        const nextPatient = doc.queue?.find(item => item.tokenNumber === nextTokenNum);
                        if (nextPatient) {
                          playChimeAndTTS(nextTokenNum, nextPatient.patientName, callLanguage);
                        }
                        onCallNext(doc.id);
                      }} 
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-[11px] sm:text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1 active:scale-95"
                    >
                      <i className="fa-solid fa-volume-high"></i>
                      <span className="truncate">Call Next</span>
                    </button>

                    <select
                      value={callLanguage}
                      onChange={(e) => {
                        const nextLang = e.target.value;
                        setCallLanguage(nextLang);
                        localStorage.setItem('dik_call_language', nextLang);
                      }}
                      className="px-1.5 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-[10px] sm:text-xs rounded-xl shadow-sm outline-none shrink-0"
                      title="Choose Call Announcement Language"
                    >
                      <option value="ur">اردو</option>
                      <option value="en">ENG</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col items-center justify-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Serving Token</div>
                  <div className="text-3xl font-extrabold text-green-500 mt-1">{(pendingQueue.length === 0 || servingVal === 0) ? '--' : servingVal}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col items-center justify-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Queue Length</div>
                  <div className="text-3xl font-extrabold text-blue-500 mt-1">{pendingQueue.length}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <i className="fa-solid fa-list-ol"></i> Patient Roll Call
                  </h3>
                  {pendingQueue.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to clear all patient tokens for today?")) {
                          onClearQueue(doc.id);
                        }
                      }}
                      className="px-2.5 py-1 text-[10px] bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-300 dark:border-red-700/50 rounded-xl font-bold transition-all flex items-center gap-1"
                    >
                      <i className="fa-solid fa-broom"></i>
                      <span>Clear Queue / Reset Today's Tokens</span>
                    </button>
                  )}
                </div>

                {/* Desktop View */}
                <div className="hidden sm:block max-h-60 overflow-y-auto overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-2xl w-full">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                        <th className="p-3">Token</th>
                        <th className="p-3">Patient Name</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Mode</th>
                        <th className="p-3">Time</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {pendingQueue.map((item) => {
                        const isSkipped = item.status === 'skipped';
                        const isComplete = item.status === 'complete';
                        const isServed = item.tokenNumber <= servingVal && !isSkipped && !isComplete;
                        return (
                          <tr 
                            key={item.tokenNumber} 
                            className={isSkipped
                              ? "bg-red-50/40 dark:bg-red-955/10 border-b border-red-100 dark:border-red-900/20 text-slate-500"
                              : isComplete
                                ? "bg-teal-50/40 dark:bg-teal-955/10 border-b border-teal-100 dark:border-teal-900/20 text-slate-400"
                                : isServed 
                                  ? "opacity-50 line-through bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800"
                                  : "bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850/50"
                            }
                          >
                            <td className="p-3 font-bold text-slate-800 dark:text-slate-205 flex items-center gap-1.5">
                              <span>#{item.tokenNumber}</span>
                              {isSkipped && (
                                <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-500 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide">Skipped</span>
                              )}
                              {isComplete && (
                                <span className="text-[9px] bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide">✓ Done</span>
                              )}
                            </td>
                            <td className="p-3 font-semibold text-slate-700 dark:text-slate-350">{item.patientName}</td>
                            <td className="p-3 font-mono text-[11px] text-slate-500">{item.patientPhone}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                item.mode === 'online' ? 'bg-blue-100 dark:bg-blue-950 text-blue-500' : 'bg-teal-100 dark:bg-teal-950 text-teal-500'
                              }`}>
                                {item.mode}
                              </span>
                            </td>
                            <td className="p-3 text-slate-400">{item.registeredTime}</td>
                            <td className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to remove Token #${item.tokenNumber} (${item.patientName})?`)) {
                                    onDeleteToken(doc.id, item.tokenNumber);
                                  }
                                }}
                                className="text-red-550 hover:text-red-700 transition-colors p-1"
                                title="Delete Token"
                              >
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {pendingQueue.length === 0 && (
                    <div className="text-center py-10 text-slate-400">
                      <i className="fa-solid fa-clipboard-check text-2xl mb-2"></i>
                      <div className="text-xs font-semibold">Queue is empty today.</div>
                    </div>
                  )}
                </div>

                {/* Mobile View */}
                <div className="block sm:hidden space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {pendingQueue.map((item) => {
                    const isSkipped = item.status === 'skipped';
                    const isComplete = item.status === 'complete';
                    const isServed = item.tokenNumber <= servingVal && !isSkipped && !isComplete;
                    return (
                      <div 
                        key={item.tokenNumber}
                        className={`p-3 rounded-2xl border text-left space-y-2 relative ${
                          isSkipped 
                            ? "bg-red-50/40 dark:bg-red-955/10 border-red-150 dark:border-red-900/30 text-slate-500" 
                            : isComplete 
                              ? "bg-teal-50/40 dark:bg-teal-955/10 border-teal-150 dark:border-teal-900/30 text-slate-400"
                              : isServed
                                ? "opacity-50 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-slate-800 dark:text-slate-205">Token #{item.tokenNumber}</span>
                          <div className="flex items-center gap-1.5">
                            {isSkipped && (
                              <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-500 px-1.5 py-0.5 rounded font-extrabold uppercase">Skipped</span>
                            )}
                            {isComplete && (
                              <span className="text-[9px] bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 px-1.5 py-0.5 rounded font-extrabold uppercase">✓ Done</span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to remove Token #${item.tokenNumber} (${item.patientName})?`)) {
                                  onDeleteToken(doc.id, item.tokenNumber);
                                }
                              }}
                              className="w-7 h-7 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all text-xs"
                              title="Delete Token"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Patient Name</span>
                            <span className="font-bold text-slate-700 dark:text-slate-350">{item.patientName}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Phone</span>
                            <span className="font-mono font-medium text-slate-600 dark:text-slate-400">{item.patientPhone}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Channel / Mode</span>
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                              item.mode === 'online' ? 'bg-blue-100 dark:bg-blue-950 text-blue-500' : 'bg-teal-100 dark:bg-teal-950 text-teal-500'
                            }`}>
                              {item.mode}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Registered Time</span>
                            <span className="font-semibold text-slate-500">{item.registeredTime}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {pendingQueue.length === 0 && (
                    <div className="text-center py-10 text-slate-400">
                      <i className="fa-solid fa-clipboard-check text-2xl mb-2"></i>
                      <div className="text-xs font-semibold">Queue is empty today.</div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Offline Entry & Leave Status */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-3 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><i className="fa-solid fa-toggle-on text-green-500"></i> Availability</h3>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold">On Leave Status</h4>
                    <p className="text-[10px] text-slate-400">Deactivates public generation</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={doc.isOnLeave}
                      onChange={() => onToggleLeave(doc.id)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5.5 bg-slate-300 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                  <i className="fa-solid fa-hospital-user"></i> Add Offline Walk-In
                </h3>
                
                {justGeneratedToken ? (
                  <div className="p-3.5 bg-teal-50 dark:bg-teal-955/20 border border-teal-200 dark:border-teal-900/40 rounded-2xl space-y-3 text-left">
                    <div className="text-xs font-bold text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                      <i className="fa-solid fa-circle-check text-green-500"></i>
                      <span>Token #{justGeneratedToken.tokenNumber} Registered!</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-0.5">
                      <div>Patient: <strong className="text-slate-700 dark:text-slate-200">{justGeneratedToken.patientName}</strong></div>
                      <div>Phone: <span className="font-mono">{justGeneratedToken.patientPhone}</span></div>
                      <div>Time: {justGeneratedToken.registeredTime}</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="flex-1 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1"
                      >
                        <i className="fa-solid fa-print"></i> Print Receipt
                      </button>
                      <button
                        type="button"
                        onClick={() => setJustGeneratedToken(null)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all"
                      >
                        New
                      </button>
                    </div>

                    {/* Hidden printable receipt container, styled strictly for thermal slip layout */}
                    <div id="print-area" className="hidden print:block text-slate-900 bg-white p-6 max-w-[320px] mx-auto text-center font-sans space-y-4">
                      <div className="border-b-2 border-dashed border-slate-400 pb-3 text-center">
                        <h2 className="text-sm font-extrabold tracking-widest uppercase">D.I.K DOCTOR RECEIPT</h2>
                        <p className="text-[10px] text-slate-500">Clinic Offline Walk-in Appointment</p>
                      </div>
                      <div className="space-y-1.5 text-xs text-left">
                        <div className="flex justify-between"><span className="text-slate-500 font-medium">Doctor:</span> <span className="font-bold">{doc.name}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500 font-medium">Specialty:</span> <span className="font-semibold">{doc.specialty}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500 font-medium">Patient:</span> <span className="font-bold">{justGeneratedToken.patientName}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500 font-medium">Phone:</span> <span className="font-mono font-medium">{justGeneratedToken.patientPhone}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500 font-medium">Date/Time:</span> <span className="font-semibold">{justGeneratedToken.registeredTime}</span></div>
                      </div>
                      <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Token Number</div>
                        <div className="text-4xl font-black text-slate-850 mt-1">
                          {justGeneratedToken.tokenNumber < 10 ? `0${justGeneratedToken.tokenNumber}` : justGeneratedToken.tokenNumber}
                        </div>
                      </div>
                      <div className="border-t border-dashed border-slate-400 pt-3 text-[8px] text-slate-400 text-center">
                        Valid strictly for date of generation. Please wait for your turn.
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleWalkInSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">Patient Name</label>
                      <input 
                        type="text" 
                        value={walkinName} 
                        onChange={(e) => setWalkinName(e.target.value)} 
                        required 
                        placeholder="Enter patient name" 
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 focus:ring-2 focus:ring-teal-500 outline-none dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">Patient Phone / ID</label>
                      <input 
                        type="tel" 
                        value={walkinPhone} 
                        onChange={(e) => setWalkinPhone(e.target.value)} 
                        required 
                        placeholder="Enter patient mobile number" 
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 focus:ring-2 focus:ring-teal-500 outline-none dark:text-slate-100"
                      />
                    </div>
                    <button type="submit" className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1">
                      <i className="fa-solid fa-plus"></i> Generate Offline Token
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Profile & Media */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-left max-w-2xl mx-auto space-y-6">
            <h2 className="text-base font-bold flex items-center gap-1.5"><i className="fa-solid fa-address-card text-green-500"></i> Profile Information & Clinic Media</h2>
            
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{language === 'ur' ? 'معالج کا نام' : 'Doctor Name'}</label>
                  <input 
                    type="text" 
                    value={docName} 
                    onChange={(e) => setDocName(e.target.value)} 
                    required 
                    placeholder="Enter doctor name" 
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{language === 'ur' ? 'طبی شعبہ (اسپیشلٹی)' : 'Medical Specialty'}</label>
                  <input 
                    type="text" 
                    value={specialty} 
                    onChange={(e) => setSpecialty(e.target.value)} 
                    required 
                    placeholder="e.g. Cardiologist" 
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{language === 'ur' ? 'لاگ ان فون نمبر' : 'Login Phone Number'}</label>
                  <input 
                    type="tel" 
                    value={docPhone} 
                    onChange={(e) => setDocPhone(e.target.value)} 
                    required 
                    placeholder="Phone number" 
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-green-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{language === 'ur' ? '۴ ہندسوں کا پن کوڈ' : '4-Digit Login PIN'}</label>
                  <div className="relative">
                    <input 
                      type={showDocPin ? 'text' : 'password'} 
                      value={docPin} 
                      onChange={(e) => setDocPin(e.target.value)} 
                      required 
                      maxLength={4}
                      pattern="[0-9]{4}"
                      placeholder="PIN Code" 
                      className="w-full pl-3 pr-10 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-green-500 outline-none font-mono"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowDocPin(!showDocPin)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <i className={`fa-solid ${showDocPin ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* File upload inputs for banner & profile picture */}
              <div className="grid sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Doctor Profile Picture</label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                      {tempAvatar ? (
                        <img src={tempAvatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <i className="fa-solid fa-user text-slate-400"></i>
                      )}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAvatarFile}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-green-500/10 file:text-green-600 dark:file:text-green-400 hover:file:bg-green-500/20 file:cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Clinic Banner Image</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleBannerFile}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-green-500/10 file:text-green-600 dark:file:text-green-400 hover:file:bg-green-500/20 file:cursor-pointer"
                  />
                </div>
              </div>

              {/* Alternative theme colors & custom URL */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-2.5">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Alternative Banner Colors & URLs</label>
                <div className="grid grid-cols-4 gap-2">
                  <button type="button" onClick={() => handleBannerColor('bg-gradient-to-r from-teal-500 to-green-500')} className="h-8 rounded-lg bg-gradient-to-r from-teal-500 to-green-500 border border-slate-300 dark:border-slate-700"></button>
                  <button type="button" onClick={() => handleBannerColor('bg-gradient-to-r from-purple-600 to-pink-500')} className="h-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 border border-slate-300 dark:border-slate-700"></button>
                  <button type="button" onClick={() => handleBannerColor('bg-gradient-to-r from-blue-600 to-cyan-500')} className="h-8 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 border border-slate-300 dark:border-slate-700"></button>
                  <button type="button" onClick={() => handleBannerColor('bg-gradient-to-r from-amber-500 to-orange-600')} className="h-8 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 border border-slate-300 dark:border-slate-700"></button>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-455 mb-0.5">Or paste Custom Banner URL</label>
                  <input 
                    type="text" 
                    value={bannerUrl} 
                    onChange={(e) => handleBannerUrlInput(e.target.value)} 
                    placeholder="Enter banner image URL" 
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 outline-none dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Contact Privacy Toggle */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold flex items-center gap-1.5"><i className="fa-solid fa-user-shield text-green-500"></i> Contact Privacy Option</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Hide personal mobile number on public profile</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={hidePhone}
                    onChange={(e) => setHidePhone(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5.5 bg-slate-300 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              <button type="submit" className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl shadow-md transition-all">
                Save Profile Changes
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: Schedule & Fee */}
        {activeTab === 'schedule' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-left max-w-2xl mx-auto space-y-6">
            <h2 className="text-base font-bold flex items-center gap-1.5"><i className="fa-solid fa-calendar-days text-green-500"></i> Clinic Schedule &amp; Consulting Fees</h2>
            
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Consultation timings</label>
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
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Consultation Fee (Rs.)</label>
                <input 
                  type="number" 
                  value={fee} 
                  onChange={(e) => setFee(e.target.value)} 
                  required 
                  placeholder="Enter fee amount" 
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-green-500 outline-none dark:text-slate-100"
                />
              </div>

              <div className="text-[10px] bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850 text-slate-500">
                <i className="fa-solid fa-circle-info mr-1 text-green-500"></i> Updates made to timings or fee configurations propagate to the public homepage immediately.
              </div>

              <button type="submit" className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl shadow-md transition-all">
                Save Timing &amp; Fee Config
              </button>
            </form>

            {/* Broadcast Delay Notice */}
            <div className="border border-amber-200 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <i className="fa-solid fa-clock-rotate-left"></i> Broadcast Delay Notice
              </h3>
              <p className="text-[10px] text-amber-600 dark:text-amber-500">
                Enter expected delay time in minutes. This will display an amber warning on your public doctor card and notify waiting patients.
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={delayMinutes}
                  onChange={(e) => setDelayMinutes(e.target.value)}
                  placeholder="e.g. 15"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-400 outline-none dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => {
                    const mins = parseInt(delayMinutes) || 0;
                    onUpdateConfig(doc.id, {
                      isDelayed: mins > 0,
                      delayMinutes: mins
                    });
                    setDelayMinutes('');
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  Broadcast
                </button>
                {doc.isDelayed && (
                  <button
                    type="button"
                    onClick={() => onUpdateConfig(doc.id, { isDelayed: false, delayMinutes: 0 })}
                    className="px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl transition-all"
                    title="Clear delay notice"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>
              {doc.isDelayed && (
                <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <i className="fa-solid fa-triangle-exclamation animate-pulse"></i>
                  Delay notice is currently active{doc.delayMinutes ? ` — ~${doc.delayMinutes} min estimated` : ''}.
                </div>
              )}
            </div>
          </div>
        )}

      </div>

    </section>
  );
}
