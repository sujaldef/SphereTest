import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, ListChecks, Shuffle, Clock, Users, 
  Trophy, ArrowRight, ArrowLeft, Calendar, ShieldAlert, 
  Eye, Play, Check, Sparkles, Zap, BrainCircuit
} from 'lucide-react';

export default function CreateSphereFixed() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '', description: '', type: 'mcq', startTime: '', duration: 60, maxPlayers: 50, difficulty: 'medium',
    security: { faceId: true, fullscreen: false, tabSwitchDetection: true }
  });

  const totalSteps = 4;
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const handleGoToQuestions = () => { console.log("Saving:", formData); window.location.href = '/questions'; };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <StepBlueprint formData={formData} setFormData={setFormData} />;
      case 2: return <StepMechanics formData={formData} setFormData={setFormData} />;
      case 3: return <StepSecurity formData={formData} setFormData={setFormData} />;
      case 4: return <StepContentRedirect onRedirect={handleGoToQuestions} />;
      default: return null;
    }
  };

  return (
    // ROOT: Fixed Height
    <div className="h-screen w-full bg-[#FFFDF0] font-sans text-stone-900 flex overflow-hidden">
      
      {/* LEFT TIMELINE (Fixed) */}
      <aside className="hidden md:flex flex-col w-[280px] border-r-4 border-stone-200 border-dashed relative z-10 bg-white flex-shrink-0">
          <div className="flex-1 flex flex-col justify-center px-6 gap-8">
                <div className="relative h-[400px] w-1 bg-stone-200 rounded-full ml-4">
                    <div className="absolute top-0 left-0 w-full bg-yellow-400 rounded-full transition-all duration-500 ease-out" style={{ height: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}></div>
                    <div className="absolute w-3 h-3 bg-yellow-400 rounded-full border-2 border-stone-900 -left-1 shadow-[0_0_10px_rgba(250,204,21,0.8)] transition-all duration-500 ease-out" style={{ top: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}></div>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 left-12 flex flex-col gap-12 h-[400px] justify-between py-1">
                    <TimelineNode step={1} current={currentStep} label="Blueprint" icon={<Zap size={14}/>} />
                    <TimelineNode step={2} current={currentStep} label="Mechanics" icon={<Clock size={14}/>} />
                    <TimelineNode step={3} current={currentStep} label="Security" icon={<ShieldAlert size={14}/>} />
                    <TimelineNode step={4} current={currentStep} label="Questions" icon={<BrainCircuit size={14}/>} />
                </div>
          </div>
      </aside>

      {/* RIGHT CONTENT (Flex Column) */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[#FFFDF0] relative">
         {/* Tech Grid Background */}
         <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

         {/* CONTENT (Scrollable) */}
         <div className="flex-1 overflow-y-auto flex items-center justify-center p-8 relative z-0">
             <div className="w-full max-w-2xl">
                <AnimatePresence mode="wait">
                    <motion.div key={currentStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                        {renderStepContent()}
                    </motion.div>
                </AnimatePresence>
             </div>
         </div>

         {/* FOOTER (Fixed) */}
         <div className="h-24 px-8 border-t-4 border-stone-200 border-dashed bg-[#FFFDF0] flex items-center justify-between flex-shrink-0 z-20">
              <button onClick={prevStep} disabled={currentStep === 1} className={`flex items-center gap-2 font-bold px-4 py-2 rounded-lg text-sm transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-stone-400 hover:text-stone-900'}`}>
                <ArrowLeft size={16} /> Back
              </button>
              {currentStep === totalSteps ? (
                 <RetroButton text="OPEN STUDIO" icon={Sparkles} onClick={handleGoToQuestions} isPrimary={true} />
              ) : (
                 <RetroButton text="NEXT" icon={ArrowRight} onClick={nextStep} isPrimary={true} />
              )}
         </div>
      </main>
    </div>
  );
}

// Subcomponents for CreateSphereFixed (Minimal definitions for compactness)
function StepBlueprint({ formData, setFormData }) { return (<div className="space-y-6 text-center"><div><h1 className="text-4xl font-black text-stone-900 italic tracking-tighter">BLUEPRINT</h1><p className="text-sm font-bold text-stone-400 uppercase tracking-widest mt-2">Core Identity</p></div><div className="space-y-6"><div className="group"><input type="text" placeholder="ENTER TITLE..." className="w-full text-center text-3xl font-black bg-transparent border-b-4 border-stone-200 py-2 focus:border-stone-900 focus:outline-none placeholder-stone-200 uppercase" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} /></div><div className="grid grid-cols-3 gap-4"><ModeOption icon={ListChecks} label="Quiz" active={formData.type === 'mcq'} onClick={() => setFormData({...formData, type: 'mcq'})} /><ModeOption icon={Terminal} label="Coding" active={formData.type === 'coding'} onClick={() => setFormData({...formData, type: 'coding'})} /><ModeOption icon={Shuffle} label="Hybrid" active={formData.type === 'mixed'} onClick={() => setFormData({...formData, type: 'mixed'})} /></div></div></div>); }
function StepMechanics({ formData, setFormData }) { return (<div className="space-y-6 text-center"><div><h1 className="text-4xl font-black text-stone-900 italic tracking-tighter">MECHANICS</h1><p className="text-sm font-bold text-stone-400 uppercase tracking-widest mt-2">Rules of Engagement</p></div><div className="grid grid-cols-2 gap-6"><div className="bg-white p-4 rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]"><div className="flex justify-between items-center mb-4"><span className="text-xs font-black uppercase"><Clock size={14} className="inline mr-1"/> Time</span><span className="font-black text-xl">{formData.duration}m</span></div><input type="range" min="15" max="180" step="15" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className="w-full accent-stone-900" /></div><div className="bg-white p-4 rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]"><div className="flex justify-between items-center mb-4"><span className="text-xs font-black uppercase"><Users size={14} className="inline mr-1"/> Max</span><span className="font-black text-xl">{formData.maxPlayers}</span></div><input type="range" min="10" max="500" step="10" value={formData.maxPlayers} onChange={(e) => setFormData({...formData, maxPlayers: e.target.value})} className="w-full accent-stone-900" /></div></div></div>); }
function StepSecurity({ formData, setFormData }) { const toggle = (key) => setFormData({ ...formData, security: { ...formData.security, [key]: !formData.security[key] } }); return (<div className="space-y-6 text-center"><div><h1 className="text-4xl font-black text-stone-900 italic tracking-tighter">SECURITY</h1><p className="text-sm font-bold text-stone-400 uppercase tracking-widest mt-2">Anti-Cheat Matrix</p></div><div className="grid gap-4 max-w-md mx-auto"><SecurityToggle active={formData.security.faceId} onClick={() => toggle('faceId')} title="Face ID" desc="AI Monitor" icon={Eye} /><SecurityToggle active={formData.security.tabSwitchDetection} onClick={() => toggle('tabSwitchDetection')} title="Tab Lock" desc="Alert Switch" icon={ShieldAlert} /><SecurityToggle active={formData.security.fullscreen} onClick={() => toggle('fullscreen')} title="Fullscreen" desc="Force Mode" icon={Trophy} /></div></div>); }
function StepContentRedirect({ onRedirect }) { return (<div className="text-center space-y-6"><div className="w-24 h-24 bg-stone-900 rounded-full flex items-center justify-center mx-auto shadow-[0px_0px_20px_rgba(250,204,21,0.5)] cursor-pointer hover:scale-110 transition-transform" onClick={onRedirect}><BrainCircuit size={40} className="text-yellow-400" /></div><div><h2 className="text-3xl font-black uppercase italic">Setup Complete</h2><p className="text-xs font-bold text-stone-400 mt-2">Proceed to Question Studio</p></div></div>); }
function TimelineNode({ step, current, label, icon }) { const isActive = step === current; return (<div className={`flex items-center gap-3 transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`}><div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 border-stone-900 ${isActive ? 'bg-stone-900 text-yellow-400' : 'bg-white'}`}>{icon}</div><span className="text-xs font-black uppercase">{label}</span></div>); }
function ModeOption({ icon: Icon, label, active, onClick }) { return <button onClick={onClick} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${active ? 'border-stone-900 bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] -translate-y-1' : 'border-stone-200 bg-white hover:border-stone-400'}`}><Icon size={24} strokeWidth={active ? 3 : 2} /><span className="text-xs font-black uppercase">{label}</span></button>; }
function SecurityToggle({ active, onClick, title, desc, icon: Icon }) { return <div onClick={onClick} className={`p-4 rounded-xl border-2 flex items-center gap-4 cursor-pointer transition-all ${active ? 'bg-stone-900 border-stone-900 shadow-[4px_4px_0px_0px_#facc15] -translate-y-1' : 'bg-white border-stone-200 hover:border-stone-400'}`}><div className={`p-2 rounded-lg ${active ? 'bg-yellow-400 text-stone-900' : 'bg-stone-100 text-stone-400'}`}><Icon size={18} /></div><div className="text-left"><h4 className={`font-black text-sm uppercase ${active ? 'text-white' : 'text-stone-900'}`}>{title}</h4><p className={`text-[10px] font-bold uppercase ${active ? 'text-stone-400' : 'text-stone-400'}`}>{desc}</p></div></div>; }
function RetroButton({ text, onClick, icon: Icon, isPrimary = false }) { return <button onClick={onClick} className={`flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-stone-900 font-black text-sm uppercase transition-all shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] active:translate-y-0 active:shadow-none ${isPrimary ? 'bg-yellow-400 text-stone-900' : 'bg-white text-stone-900'}`}>{text} {Icon && <Icon size={16} strokeWidth={3} />}</button>; }