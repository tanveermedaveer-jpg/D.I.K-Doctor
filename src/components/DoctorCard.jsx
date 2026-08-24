import React from 'react';

export default function DoctorCard({ doc, onViewProfile, onGetToken, language, onRateDoctor }) {
  const nameInitials = doc.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const isUrdu = language === 'ur';

  // Translation mapping
  const trans = {
    viewProfile: isUrdu ? 'پروفائل دیکھیں' : 'View Profile',
    getToken: isUrdu ? 'ٹوکن حاصل کریں' : 'Get Token',
    onLeave: isUrdu ? 'رخصت پر' : 'On Leave',
    available: isUrdu ? 'دستیاب' : 'Available',
    timings: isUrdu ? 'اوقات' : 'Timings',
    fee: isUrdu ? 'فیس' : 'Consultation Fee',
    liveServing: isUrdu ? 'لائیو سرونگ ٹوکن' : 'Live serving token',
    of: isUrdu ? 'میں سے' : 'of',
    token: isUrdu ? 'ٹوکن' : 'Token'
  };

  return (
    <div className={`relative bg-white dark:bg-slate-900 rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between text-left h-full ${
      doc.isOnLeave 
        ? 'border-red-200 dark:border-red-950/60 shadow-sm opacity-90' 
        : 'border-slate-200 dark:border-slate-800 hover:border-green-500/60 shadow-md hover:shadow-xl'
    }`}>
      
      {/* 1. Header Banner */}
      <div 
        className={`h-24 relative flex items-start justify-between p-3 ${
          doc.banner && doc.banner.startsWith('bg-') ? doc.banner : 'bg-cover bg-center'
        }`}
        style={doc.banner && doc.banner.startsWith('bg-') ? {} : { backgroundImage: `url('${doc.banner || ''}')` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Status Badge */}
        {doc.isOnLeave ? (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold z-10 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            {trans.onLeave}
          </span>
        ) : (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400 text-[10px] font-bold z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            {trans.available}
          </span>
        )}
      </div>
      
      {/* 2. Place profile avatar overlapping the banner's bottom edge */}
      <div className="px-5 -mt-8 relative z-10 flex items-end justify-between">
        <div className="w-16 h-16 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg font-bold shadow-md overflow-hidden shrink-0">
          {doc.avatar ? (
            <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-green-500 to-teal-500 text-white">
              {nameInitials}
            </div>
          )}
        </div>

        {/* Interactive 5-Star Rating Badge */}
        <div className="flex items-center gap-1 bg-amber-500/10 dark:bg-amber-500/20 px-2 py-1 rounded-full border border-amber-400/40 text-amber-500 dark:text-amber-400 text-[11px] font-extrabold shadow-sm shrink-0">
          <div className="flex items-center gap-0.5" title="Click stars to rate doctor">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRateDoctor) onRateDoctor(doc.id, star);
                }}
                className="hover:scale-125 transition-transform p-0.5 text-amber-400 focus:outline-none"
                title={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                <i className={`fa-solid fa-star ${star <= Math.round(doc.rating || 5) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}></i>
              </button>
            ))}
          </div>
          <span className="ml-1 text-[11px] font-black">{doc.rating ? (typeof doc.rating === 'number' ? doc.rating.toFixed(1) : doc.rating) : '5.0'}</span>
        </div>
      </div>

      {/* 3. Name & Specialty details container completely below */}
      <div className="px-5 pt-3 pb-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-850 dark:text-slate-100 truncate">{doc.name}</h3>
          {doc.gender === 'Female' && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-pink-100 dark:bg-pink-955/40 text-pink-600 dark:text-pink-400 text-[9px] font-extrabold uppercase tracking-wider shrink-0 border border-pink-200 dark:border-pink-900/30">
              👩‍⚕️ {isUrdu ? 'لیڈی اسپیشلسٹ' : 'Lady Specialist'}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <span className="text-xs font-bold text-green-600 dark:text-green-400 block truncate">{doc.specialty}</span>
          {doc.zone && (
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 shrink-0">
              📍 {doc.city ? `${doc.city} - ` : ''}{doc.zone}
            </span>
          )}
        </div>
      </div>

      {doc.isDelayed && (
        <div className="mx-5 mt-3.5 px-3 py-2 bg-amber-50 dark:bg-amber-955/20 border border-amber-100 dark:border-amber-900/30 rounded-xl flex items-center gap-2 text-[10px] text-amber-600 dark:text-amber-400 font-bold">
          <i className="fa-solid fa-triangle-exclamation animate-bounce"></i>
          <span>{isUrdu ? 'ڈاکٹر فی الحال تاخیر کا شکار ہیں' : 'Doctor temporarily delayed'}</span>
        </div>
      )}

      <div className="p-5 pt-3 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Details Section */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850/50 text-[11px] text-slate-700 dark:text-slate-300">
          <div>
            <span className="block text-slate-400 font-medium">{trans.timings}</span>
            <span className="font-bold block truncate">
              <i className="fa-regular fa-clock mr-1 text-teal-500"></i>
              {doc.timings}
            </span>
          </div>
          <div>
            <span className="block text-slate-400 font-medium">{trans.fee}</span>
            <span className="font-bold block text-green-600 dark:text-green-400">
              <i className="fa-solid fa-dollar-sign mr-0.5"></i>
              {doc.fee}
            </span>
          </div>
        </div>

        {/* Contact info with privacy */}
        <div className="text-[11px] px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl flex items-center justify-between text-slate-600 dark:text-slate-300">
          <span className="font-medium text-slate-400"><i className="fa-solid fa-phone text-green-550 mr-1"></i>Contact:</span>
          <span className="font-extrabold font-mono">
            {doc.hidePhone ? (
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider"><i className="fa-solid fa-building-user mr-0.5"></i> Clinic Desk</span>
            ) : (
              <span>{doc.phone}</span>
            )}
          </span>
        </div>

        {/* Queue Serving Indicators */}
        <div className="flex items-center justify-between py-1 border-t border-dashed border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-400 font-medium">{trans.liveServing}:</span>
          <span className="font-extrabold text-slate-700 dark:text-slate-350">
            {trans.token} <span className="text-green-500 font-black">{doc.currentServing || '--'}</span> {trans.of} <span className="text-blue-500 font-black">{doc.queue.length ? doc.queue[doc.queue.length - 1].tokenNumber : 0}</span>
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button 
            onClick={onViewProfile} 
            className="flex-1 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all"
          >
            {trans.viewProfile}
          </button>
          <button 
            onClick={onGetToken} 
            disabled={doc.isOnLeave} 
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              doc.isOnLeave 
                ? 'bg-slate-200 dark:bg-slate-805 text-slate-400 cursor-not-allowed border border-slate-100 dark:border-slate-800' 
                : 'bg-green-500 hover:bg-green-600 text-white shadow-sm shadow-green-500/10'
            }`}
          >
            <i className="fa-solid fa-ticket"></i> {trans.getToken}
          </button>
        </div>

      </div>
    </div>
  );
}
