import React, { useState } from 'react';

export default function TokenModal({ isOpen, onClose, doc, onTokenGenerated, generatedSlip, onCloseSlip }) {
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [keepPrivate, setKeepPrivate] = useState(false);

  if (!isOpen && !generatedSlip) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) return;
    onTokenGenerated(patientName.trim(), patientPhone.trim(), keepPrivate);
    setPatientName('');
    setPatientPhone('');
    setKeepPrivate(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!generatedSlip) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 540;
      const ctx = canvas.getContext('2d');

      // Draw background Card
      ctx.fillStyle = '#0f172a'; // slate-900 (solid background)
      ctx.fillRect(0, 0, 400, 540);

      // Inner card container border
      ctx.strokeStyle = '#334155'; // slate-700 border
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, 380, 520);

      // Header Brand bar
      ctx.fillStyle = '#1e293b'; // slate-800
      ctx.fillRect(10, 10, 380, 75);

      // Draw Logo Icon Circle
      ctx.fillStyle = '#22c55e'; // green-500
      ctx.beginPath();
      ctx.arc(200, 35, 12, 0, 2 * Math.PI);
      ctx.fill();
      // Draw plus in white
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(200, 29);
      ctx.lineTo(200, 41);
      ctx.moveTo(194, 35);
      ctx.lineTo(206, 35);
      ctx.stroke();

      // Brand text
      ctx.fillStyle = '#22c55e'; // green-500
      ctx.font = 'bold 15px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('D.I.K DOCTOR TICKET', 200, 68);

      // Separator line
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(25, 100);
      ctx.lineTo(375, 100);
      ctx.stroke();

      // Details Block
      ctx.fillStyle = '#94a3b8'; // text-slate-400
      ctx.font = '13px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Doctor Name:', 35, 130);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Arial';
      ctx.fillText(generatedSlip.docName, 140, 130);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px Arial';
      ctx.fillText('Patient Name:', 35, 165);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Arial';
      ctx.fillText(generatedSlip.token.patientName, 140, 165);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px Arial';
      ctx.fillText('Booking Time:', 35, 200);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(generatedSlip.token.registeredTime, 140, 200);

      // Divider
      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(25, 225);
      ctx.lineTo(375, 225);
      ctx.stroke();

      // Large Ticket Number container box
      ctx.fillStyle = '#1e293b'; // slate-800
      ctx.fillRect(40, 245, 320, 175);

      // Box title
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('YOUR APPOINTMENT TOKEN', 200, 275);

      // Token Large Digit
      ctx.fillStyle = '#22c55e'; // green-500
      ctx.font = 'bold 55px Arial';
      const numVal = generatedSlip.token.tokenNumber;
      const tDigits = numVal < 10 ? `0${numVal}` : `${numVal}`;
      ctx.fillText(tDigits, 200, 335);

      // Details row
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 355);
      ctx.lineTo(340, 355);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px Arial';
      ctx.fillText(`Current Serving: ${generatedSlip.serving === 0 ? '--' : generatedSlip.serving}`, 125, 385);
      ctx.fillText(`Estimated Wait: ${generatedSlip.wait}`, 265, 385);

      // Footer disclaimer & pseudo barcode
      ctx.fillStyle = '#475569';
      ctx.font = '8px Arial';
      ctx.fillText('Valid strictly for date of generation. Purges after 24 hrs.', 200, 445);

      // Barcode line
      ctx.fillStyle = '#64748b';
      const startBarcodeX = 120;
      const widths = [3, 5, 2, 4, 1, 6, 2, 4, 2, 5, 1, 4];
      let currentX = startBarcodeX;
      for (const w of widths) {
        ctx.fillRect(currentX, 465, w, 22);
        currentX += w + 3;
      }
      ctx.fillStyle = '#475569';
      ctx.font = '8px Arial';
      ctx.fillText('DIK-DOC-Q-89721', 200, 502);

      // Convert canvas to URL & trigger download click
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `dik-doctor-token-${tDigits}.png`;
      link.href = url;
      link.click();
    } catch (err) {
      console.error("Failed to compile canvas output", err);
    }
  };

  return (
    <>
      {/* 1. Get Token Form Modal */}
      {isOpen && doc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-x-hidden">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-[95%] max-w-md mx-auto overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-550 dark:text-slate-400 uppercase">Live Queue Token Booking</h2>
              <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs hover:bg-red-500 hover:text-white transition-all">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50/50 dark:bg-green-955/20 border border-green-100 dark:border-green-950/30 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center text-lg shrink-0">
                  <i className="fa-solid fa-user-doctor"></i>
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-xs sm:text-sm font-bold truncate">{doc.name}</div>
                  <div className="text-[10px] text-green-606 dark:text-green-400 font-semibold truncate">{doc.specialty}</div>
                </div>
              </div>

              <div className="space-y-3.5 text-left">
                <div>
                  <label className="block text-xs font-semibold text-slate-655 dark:text-slate-450 mb-1">Patient Full Name</label>
                  <input 
                    type="text" 
                    value={patientName} 
                    onChange={(e) => setPatientName(e.target.value)} 
                    required 
                    placeholder="Enter patient name" 
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-green-500 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-655 dark:text-slate-450 mb-1">Mobile Number</label>
                  <input 
                    type="tel" 
                    value={patientPhone} 
                    onChange={(e) => setPatientPhone(e.target.value)} 
                    required 
                    placeholder="Enter patient mobile number" 
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-green-500 dark:text-slate-100"
                  />
                </div>
                
                {/* Privacy Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input 
                    type="checkbox" 
                    id="keep-private" 
                    checked={keepPrivate} 
                    onChange={(e) => setKeepPrivate(e.target.checked)} 
                    className="w-4 h-4 rounded text-green-500 border-slate-300 focus:ring-green-500 bg-slate-50 dark:bg-slate-800 cursor-pointer"
                  />
                  <label htmlFor="keep-private" className="text-xs font-bold text-slate-650 dark:text-slate-400 select-none cursor-pointer">
                    🔒 Keep Name Private in Public Queue (Renders as "F. Patient / Token Holder")
                  </label>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 flex gap-1.5 p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl text-left">
                <i className="fa-solid fa-triangle-exclamation text-amber-500 text-xs mt-0.5 shrink-0"></i>
                <span>Note: Generating tokens registers you in today's active queue sequence. Tokens are only valid for today.</span>
              </div>

              <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all">
                Generate Ticket Slip
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Display Token Slip Modal */}
      {generatedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-x-hidden">
          <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-[95%] max-w-md mx-auto overflow-hidden">
            
            {/* Cutout Receipt top decoration */}
            <div className="h-2.5 bg-slate-100 dark:bg-slate-900 border-b border-dashed border-slate-200 dark:border-slate-800 flex justify-between px-2 overflow-hidden">
              <span className="w-4 h-4 bg-slate-900 rounded-full -mt-2"></span>
              <span className="w-4 h-4 bg-slate-900 rounded-full -mt-2"></span>
              <span className="w-4 h-4 bg-slate-900 rounded-full -mt-2"></span>
              <span className="w-4 h-4 bg-slate-900 rounded-full -mt-2"></span>
              <span className="w-4 h-4 bg-slate-900 rounded-full -mt-2"></span>
              <span className="w-4 h-4 bg-slate-900 rounded-full -mt-2"></span>
              <span className="w-4 h-4 bg-slate-900 rounded-full -mt-2"></span>
            </div>

            <div className="p-4 sm:p-6 space-y-6" id="print-area">
              <div className="text-center space-y-1">
                <div className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-tr from-green-500 to-teal-500 flex items-center justify-center text-white text-base shadow">
                  <i className="fa-solid fa-house-medical"></i>
                </div>
                <h2 className="text-xs sm:text-sm font-extrabold tracking-widest text-slate-405 dark:text-slate-500 uppercase">D.I.K DOCTOR TICKET</h2>
                <p className="text-[10px] text-slate-550">Digital Queue Serving System</p>
              </div>

              <div className="border-y border-dashed border-slate-200 dark:border-slate-800 py-3.5 space-y-2 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Doctor:</span>
                  <span className="font-bold text-slate-805 dark:text-slate-200">{generatedSlip.docName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Patient:</span>
                  <span className="font-bold text-slate-805 dark:text-slate-200">{generatedSlip.token.patientName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Date / Time:</span>
                  <span className="font-semibold text-slate-650 dark:text-slate-350">{generatedSlip.token.registeredTime}</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-105 dark:border-slate-850 p-4 sm:p-5 text-center space-y-3.5 shadow-inner">
                <div>
                  <div className="text-[10px] uppercase font-extrabold tracking-widest text-slate-405">Your Token Number</div>
                  <div className="text-4xl sm:text-5xl font-black text-green-500 mt-1">
                    {generatedSlip.token.tokenNumber < 10 ? `0${generatedSlip.token.tokenNumber}` : generatedSlip.token.tokenNumber}
                  </div>
                </div>
                <div className="w-full h-[1px] bg-slate-200 dark:bg-slate-800 border-dashed border-b"></div>
                <div className="flex justify-around items-center gap-2">
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-400">Current Serving</div>
                    <div className="text-base sm:text-lg font-bold text-blue-505">
                      {generatedSlip.serving === 0 ? '--' : (generatedSlip.serving < 10 ? `0${generatedSlip.serving}` : generatedSlip.serving)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-400">Estimated Wait</div>
                    <div className="text-base sm:text-lg font-bold text-amber-505">{generatedSlip.wait}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-1.5 opacity-70">
                <div className="h-6 w-48 bg-slate-300 dark:bg-slate-800 rounded-sm flex items-center justify-around overflow-hidden px-1">
                  <span className="w-[2px] h-full bg-slate-800 dark:bg-slate-300"></span>
                  <span className="w-[4px] h-full bg-slate-800 dark:bg-slate-300"></span>
                  <span className="w-[1px] h-full bg-slate-800 dark:bg-slate-300"></span>
                  <span className="w-[3px] h-full bg-slate-800 dark:bg-slate-300"></span>
                  <span className="w-[1px] h-full bg-slate-800 dark:bg-slate-300"></span>
                  <span className="w-[5px] h-full bg-slate-800 dark:bg-slate-300"></span>
                  <span className="w-[2px] h-full bg-slate-800 dark:bg-slate-300"></span>
                  <span className="w-[3px] h-full bg-slate-800 dark:bg-slate-300"></span>
                </div>
                <span className="text-[8px] font-mono tracking-widest text-slate-400">DIK-DOC-Q-89721</span>
              </div>
            </div>

            {/* Actions: Download Token and Print Token side-by-side */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-905 space-y-2.5">
              <div className="flex gap-2">
                <button 
                  onClick={handleDownload} 
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1"
                >
                  <i className="fa-solid fa-download"></i> Download Token
                </button>
                <button 
                  onClick={handlePrint} 
                  className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1"
                >
                  <i className="fa-solid fa-print"></i> Print Token
                </button>
              </div>
              <button 
                onClick={onCloseSlip} 
                className="w-full py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300"
              >
                Close Receipt
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
