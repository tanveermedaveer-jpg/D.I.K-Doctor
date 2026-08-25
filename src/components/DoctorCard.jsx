import React, { useState } from 'react';

export default function DoctorCard({ doc, onViewProfile, onGetToken, language, onRateDoctor }) {
  const [hoverStar, setHoverStar] = useState(0);
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
    <div className={`relative bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl border transition-all duration-300 overflow-hidden text-left ${
      doc.isOnLeave 
        ? 'border-red-200 dark:border-red-950/60 shadow-sm opacity-90' 
        : 'border-slate-200 dark:border-slate-800 hover:border-green-500/60 shadow-md hover:shadow-xl'
    }`}>
      
      {/* ======================================================== */}
      {/* 📱 COMPACT MOBILE LAYOUT (flex md:hidden)               */}
      {/* ======================================================== */}
      <div className="flex md:hidden p-3 items-stretch gap-3 w-full">
        
        {/* Left Side: Avatar, Status, Rating badge */}
        <div className="flex flex-col items-center justify-between shrink-0 w-20 text-center border-r border-slate-100 dark:border-slate-805 pr-2">
          
          <div className="relative">
            <div className="w-14 h-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-base font-bold shadow-sm overflow-hidden">
              {doc.avatar ? (
                <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-green-500 to-teal-500 text-white">
                  {nameInitials}
                </div>
              )}
            </div>
            {/* Status dot */}
            <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${doc.isOnLeave ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></span>
          </div>

          {/* Compact Rating */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              const nextRate = doc.rating === 5 ? 1 : Math.floor(doc.rating || 0) + 1;
              if (onRateDoctor) onRateDoctor(doc.id, nextRate);
            }}
            className="flex items-center justify-center gap-0.5 bg-slate-105 dark:bg-slate-800/80 px-1.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 text-[9px] font-black cursor-pointer mt-2 w-full text-slate-700 dark:text-slate-200"
            title="Click to rate"
          >
            <i className="fa-solid fa-star text-amber-400 text-[8px]"></i>
            <span>{doc.rating && doc.rating > 0 ? doc.rating.toFixed(1) : '0.0'}</span>
          </div>

          <span className={`text-[8px] font-bold mt-1.5 block uppercase tracking-tight ${doc.isOnLeave ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
            {doc.isOnLeave ? trans.onLeave : trans.available}
          </span>
        </div>

        {/* Right Side: Info & Actions */}
        <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-extrabold text-xs text-slate-850 dark:text-white truncate">{doc.name}</h3>
              {doc.gender === 'Female' && (
                <span className="text-[8px] px-1 rounded bg-pink-100 dark:bg-pink-955 text-pink-600 dark:text-pink-400 shrink-0 border border-pink-200 dark:border-pink-900/30">👩‍⚕️</span>
              )}
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="font-bold text-green-605 dark:text-green-400">{doc.specialty}</span>
              {doc.zone && <span className="text-[9px] text-slate-400">📍 {doc.zone}</span>}
            </div>

            {/* Quick Timing / Fee row */}
            <div className="grid grid-cols-2 gap-1 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-lg border border-slate-100 dark:border-slate-850/50 text-[9px] text-slate-600 dark:text-slate-350 mt-1">
              <div className="truncate">
                <span className="text-slate-400 font-medium mr-0.5">Time:</span>
                <span className="font-bold">{doc.timings}</span>
              </div>
              <div className="text-right truncate">
                <span className="text-slate-400 font-medium mr-0.5">Fee:</span>
                <span className="font-bold text-green-605 dark:text-green-400">Rs.{doc.fee}</span>
              </div>
            </div>

            {/* Serving State indicator */}
            <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 flex justify-between">
              <span>{trans.liveServing}:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                #{doc.currentServing || '--'} / #{doc.queue.length ? doc.queue[doc.queue.length - 1].tokenNumber : 0}
              </span>
            </div>
            
            {doc.isDelayed && (
              <div className="mt-1 px-1.5 py-0.5 bg-amber-50 dark:bg-amber-955/20 border border-amber-100 dark:border-amber-900/30 rounded text-[8px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                <i className="fa-solid fa-triangle-exclamation text-amber-500 animate-bounce"></i>
                <span>{isUrdu ? 'تاخیر' : 'Doctor delayed'}</span>
              </div>
            )}
          </div>

          {/* Mobile Buttons */}
          <div className="flex gap-1.5">
            <button 
              onClick={onViewProfile} 
              className="flex-1 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Profile
            </button>
            <button 
              onClick={onGetToken} 
              disabled={doc.isOnLeave} 
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-0.5 ${
                doc.isOnLeave 
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600 text-white shadow shadow-green-500/10'
              }`}
            >
              <i className="fa-solid fa-ticket text-[8px]"></i>
              <span>{trans.getToken}</span>
            </button>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 💻 STANDARD DESKTOP LAYOUT (hidden md:flex)              */}
      {/* ======================================================== */}
      <div className="hidden md:flex flex-col justify-between h-full w-full">
        
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
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 text-green-600 dark:bg-green-955/40 dark:text-green-400 text-[10px] font-bold z-10">
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

          {/* Empty-by-default Interactive 5-Star Rating Badge */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-850 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-[11px] font-extrabold shadow-sm shrink-0">
            <div 
              className="flex items-center gap-0.5" 
              onMouseLeave={() => setHoverStar(0)}
              title="Click stars to rate doctor"
            >
              {[1, 2, 3, 4, 5].map(star => {
                const activeRating = hoverStar > 0 ? hoverStar : (doc.rating || 0);
                const isFilled = star <= Math.round(activeRating);
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverStar(star)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onRateDoctor) onRateDoctor(doc.id, star);
                    }}
                    className="hover:scale-125 transition-transform p-0.5 focus:outline-none"
                    title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <i className={`fa-solid fa-star ${isFilled ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}></i>
                  </button>
                );
              })}
            </div>
            <span className={`ml-1 text-[11px] font-black ${doc.rating > 0 ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400'}`}>
              {doc.rating && doc.rating > 0 ? (typeof doc.rating === 'number' ? doc.rating.toFixed(1) : doc.rating) : '0.0'}
            </span>
          </div>
        </div>

        {/* 3. Name & Specialty details container completely below */}
        <div className="px-5 pt-3 pb-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-855 dark:text-slate-100 truncate">{doc.name}</h3>
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

    </div>
  );
}
