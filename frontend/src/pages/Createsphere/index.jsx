import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Terminal, ListChecks, Shuffle, Clock, Users,
    Trophy, ArrowRight, ArrowLeft, ShieldAlert,
    Eye, Sparkles, Zap, BrainCircuit, Medal,
    Flame, Layers, Shield, Code2, Plus, X, Check
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSphereThunk, clearSphereError } from '../../features/spheres/sphereSlice';
import { selectSpheres } from '../../store/store';

export default function CreateSphereFixed() {
    const [currentStep, setCurrentStep] = useState(1);
    
    // 1. Added questions array to initial state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'mcq', // 'mcq', 'coding', or 'mixed'
        startTime: '',
        duration: 60,
        maxPlayers: 50,
        difficulty: 'medium',
        security: { faceId: true, fullscreen: false, tabSwitchDetection: true },
        questions: [] 
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const spheres = useSelector(selectSpheres);

    const totalSteps = 4;
    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    // Wrapper to make it easy for the steps to update specific fields
    const updateForm = (newData) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    // 2. Updated final submission to include questions
    const handleSubmitSphere = async () => {
        dispatch(clearSphereError());
        const payload = {
            title: formData.title,
            description: formData.description,
            type: formData.type,
            startTime: formData.startTime,
            duration: formData.duration,
            maxPlayers: formData.maxPlayers,
            difficulty: formData.difficulty,
            security: formData.security,
            questions: formData.questions,
        };
        
        const resultAction = await dispatch(createSphereThunk(payload));
        if (createSphereThunk.fulfilled.match(resultAction)) {
            // Navigate back to dashboard or to the created sphere's view
            navigate('/dashboard'); 
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return <WizardStep1 form={formData} updateForm={updateForm} />;
            case 2: return <WizardStep2 form={formData} updateForm={updateForm} />;
            case 3: return <WizardStep3 form={formData} updateForm={updateForm} />;
            case 4: return <WizardStep4 form={formData} updateForm={updateForm} />;
            default: return null;
        }
    };

    return (
        <div className="h-screen w-full bg-[#FFFDF0] font-sans text-stone-900 flex overflow-hidden">
            {/* LEFT TIMELINE */}
            <aside className="hidden md:flex flex-col w-[280px] border-r-4 border-stone-200 border-dashed relative z-10 bg-white flex-shrink-0">
                <div className="flex-1 flex flex-col justify-center px-6 gap-8">
                    <div className="relative h-[400px] w-1 bg-stone-200 rounded-full ml-4">
                        <div className="absolute top-0 left-0 w-full bg-yellow-400 rounded-full transition-all duration-500 ease-out" style={{ height: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}></div>
                        <div className="absolute w-3 h-3 bg-yellow-400 rounded-full border-2 border-stone-900 -left-1 shadow-[0_0_10px_rgba(250,204,21,0.8)] transition-all duration-500 ease-out" style={{ top: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}></div>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-12 flex flex-col gap-12 h-[400px] justify-between py-1">
                        <TimelineNode step={1} current={currentStep} label="Blueprint" icon={<Zap size={14} />} />
                        <TimelineNode step={2} current={currentStep} label="Mechanics" icon={<Clock size={14} />} />
                        <TimelineNode step={3} current={currentStep} label="Security" icon={<ShieldAlert size={14} />} />
                        <TimelineNode step={4} current={currentStep} label="Questions" icon={<BrainCircuit size={14} />} />
                    </div>
                </div>
            </aside>

            {/* RIGHT CONTENT */}
            <main className="flex-1 flex flex-col h-full min-w-0 bg-[#FFFDF0] relative">
                {/* Tech Grid Background */}
                <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                {/* SCROLLABLE CONTENT */}
                <div className="flex-1 overflow-y-auto flex items-center justify-center p-8 relative z-0">
                    <div className="w-full max-w-2xl">
                        <AnimatePresence mode="wait">
                            <motion.div key={currentStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                                {renderStepContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* FIXED FOOTER */}
                <div className="h-24 px-8 border-t-4 border-stone-200 border-dashed bg-[#FFFDF0] flex items-center justify-between flex-shrink-0 z-20">
                    <button onClick={prevStep} disabled={currentStep === 1} className={`flex items-center gap-2 font-bold px-4 py-2 rounded-lg text-sm transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-stone-400 hover:text-stone-900'}`}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    
                    {/* Only show NEXT if we are not on the last step */}
                    {currentStep !== totalSteps && (
                        <div className="ml-auto">
                            <RetroButton text="NEXT" icon={ArrowRight} onClick={nextStep} isPrimary={true} />
                        </div>
                    )}

                    {/* Show Final CTA on Step 4 */}
                    {currentStep === totalSteps && (
                         <div className="ml-auto">
                             <RetroButton text="CREATE SPHERE" icon={Sparkles} onClick={handleSubmitSphere} isPrimary={true} />
                         </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// ─── UI Helper Components ─────────────────────────────────────

function Card({ className, children }) {
    return <div className={`bg-white rounded-2xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] ${className}`}>{children}</div>;
}

function Tag({ color, children }) {
    const colorStyles = {
        blue: "bg-blue-100 border-blue-400 text-blue-700",
        purple: "bg-purple-100 border-purple-400 text-purple-700",
        green: "bg-green-100 border-green-500 text-green-700",
        stone: "bg-stone-100 border-stone-400 text-stone-600",
        yellow: "bg-yellow-100 border-yellow-500 text-yellow-700",
    };
    return <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded border-2 ${colorStyles[color] || colorStyles.stone}`}>{children}</span>;
}

function RetroButton({ text, onClick, icon: Icon, isPrimary = false, disabled = false, size = "default", className = "" }) {
    const sizeClasses = size === "sm" ? "px-4 py-2 text-xs" : "px-8 py-3 text-sm";
    return (
        <button 
            onClick={onClick} 
            disabled={disabled}
            className={`flex items-center gap-2 rounded-xl border-2 border-stone-900 font-black uppercase transition-all shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:pointer-events-none ${sizeClasses} ${isPrimary ? 'bg-yellow-400 text-stone-900' : 'bg-white text-stone-900'} ${className}`}
        >
            {text} {Icon && <Icon size={size === "sm" ? 14 : 16} strokeWidth={3} />}
        </button>
    );
}

function TimelineNode({ step, current, label, icon }) {
    const isActive = step === current;
    const isPast = step < current;
    return (
        <div className={`flex items-center gap-3 transition-opacity ${isActive || isPast ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 border-stone-900 transition-colors ${isActive ? 'bg-stone-900 text-yellow-400' : isPast ? 'bg-yellow-400 text-stone-900' : 'bg-white'}`}>
                {icon}
            </div>
            <span className="text-xs font-black uppercase">{label}</span>
        </div>
    );
}

// ─── Wizard Step Components ─────────────────────────────────────

function WizardStep1({ form, updateForm }) {
    return (
        <div className="space-y-8 text-center pb-8">
            <div>
                <h1 className="text-5xl font-black italic tracking-tighter">BLUEPRINT</h1>
                <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mt-2">Core Identity</p>
            </div>

            <input type="text" placeholder="SPHERE TITLE..." value={form.title} onChange={e => updateForm({ title: e.target.value })}
                className="w-full text-center text-3xl font-black bg-transparent border-b-4 border-stone-200 py-3 focus:border-yellow-400 focus:outline-none placeholder-stone-200 uppercase tracking-tight" />

            <textarea placeholder="Optional description..." value={form.description} onChange={e => updateForm({ description: e.target.value })}
                className="w-full text-center text-sm font-semibold bg-white border-2 border-stone-200 rounded-xl p-4 focus:border-stone-900 focus:outline-none placeholder-stone-300 resize-none h-20 transition-colors" />

            <div>
                <p className="text-xs font-black uppercase text-stone-400 mb-4">Choose Format</p>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { value: "mcq", icon: ListChecks, label: "Quiz", desc: "Multiple choice & short answers", color: "bg-blue-400" },
                        { value: "coding", icon: Terminal, label: "Coding", desc: "Code challenges & debugging", color: "bg-purple-400" },
                        { value: "mixed", icon: Shuffle, label: "Hybrid", desc: "Mix of both formats", color: "bg-orange-400" },
                    ].map(opt => (
                        <button key={opt.value} onClick={() => updateForm({ type: opt.value })}
                            className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${form.type === opt.value ? "border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] -translate-y-1 " + opt.color : "border-stone-200 bg-white hover:border-stone-400"}`}>
                            <div className={`w-10 h-10 rounded-xl border-2 border-stone-900 flex items-center justify-center ${form.type === opt.value ? "bg-stone-900" : "bg-stone-100"}`}>
                                <opt.icon size={20} className={form.type === opt.value ? "text-yellow-400" : "text-stone-600"} />
                            </div>
                            <div>
                                <p className="font-black text-sm uppercase">{opt.label}</p>
                                <p className="text-[10px] text-stone-800 font-semibold mt-0.5 opacity-80">{opt.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <p className="text-xs font-black uppercase text-stone-400 mb-4">Difficulty</p>
                <div className="flex gap-3 justify-center">
                    {["easy", "medium", "hard"].map(d => (
                        <button key={d} onClick={() => updateForm({ difficulty: d })}
                            className={`px-6 py-3 rounded-xl border-2 border-stone-900 font-black text-xs uppercase transition-all ${form.difficulty === d ? "bg-stone-900 text-yellow-400 shadow-[3px_3px_0px_0px_#facc15]" : "bg-white text-stone-600 hover:bg-stone-50"}`}>{d}</button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function WizardStep2({ form, updateForm }) {
    return (
        <div className="space-y-8 text-center pb-8">
            <div>
                <h1 className="text-5xl font-black italic tracking-tighter">MECHANICS</h1>
                <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mt-2">Rules of Engagement</p>
            </div>

            <div className="grid grid-cols-2 gap-5">
                {[
                    { key: "duration", icon: Clock, label: "Duration", unit: "min", min: 15, max: 180, step: 15 },
                    { key: "maxPlayers", icon: Users, label: "Max Players", unit: "", min: 10, max: 500, step: 10 },
                ].map(({ key, icon: Icon, label, unit, min, max, step }) => (
                    <Card key={key} className="p-5">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-black uppercase flex items-center gap-1.5 text-stone-500"><Icon size={13} />{label}</span>
                            <span className="font-black text-2xl">{form[key]}{unit}</span>
                        </div>
                        <input type="range" min={min} max={max} step={step} value={form[key]} onChange={e => updateForm({ [key]: Number(e.target.value) })}
                            className="w-full accent-stone-900 cursor-pointer" />
                        <div className="flex justify-between text-[10px] font-bold text-stone-400 mt-1"><span>{min}{unit}</span><span>{max}{unit}</span></div>
                    </Card>
                ))}
            </div>

            <Card className="p-5 text-left">
                <p className="text-xs font-black uppercase text-stone-400 mb-4 flex items-center gap-2"><Clock size={13} /> Schedule Start (Optional)</p>
                <input type="datetime-local" value={form.startTime || ""} onChange={e => updateForm({ startTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 font-bold text-sm bg-white focus:border-stone-900 focus:outline-none transition-colors" />
            </Card>

            <div className="grid grid-cols-3 gap-4">
                {[
                    { icon: Trophy, label: "Leaderboard", desc: "Live ranking" },
                    { icon: Medal, label: "Badges", desc: "Earn rewards" },
                    { icon: Flame, label: "Streaks", desc: "Daily fire" },
                ].map((f, i) => (
                    <Card key={i} className="p-4 flex flex-col items-center gap-2 bg-stone-50 border-stone-200 shadow-none">
                        <f.icon size={20} className="text-yellow-500" />
                        <p className="font-black text-xs uppercase">{f.label}</p>
                        <p className="text-[10px] text-stone-400 font-semibold">{f.desc}</p>
                        <Tag color="green">Enabled</Tag>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function WizardStep3({ form, updateForm }) {
    const toggle = (key) => updateForm({ security: { ...form.security, [key]: !form.security[key] } });

    const options = [
        { key: "faceId", icon: Eye, title: "Face ID Monitor", desc: "AI-powered identity check via webcam", risk: "High Security" },
        { key: "tabSwitchDetection", icon: ShieldAlert, title: "Tab Lock", desc: "Alert & warn on browser tab switch", risk: "Anti-Cheat" },
        { key: "fullscreen", icon: Layers, title: "Fullscreen Force", desc: "Require fullscreen mode to proceed", risk: "Lockdown" },
    ];

    const activeCount = Object.values(form.security).filter(Boolean).length;

    return (
        <div className="space-y-8 text-center pb-8">
            <div>
                <h1 className="text-5xl font-black italic tracking-tighter">SECURITY</h1>
                <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mt-2">Anti-Cheat Matrix</p>
            </div>

            <div className="space-y-4 max-w-lg mx-auto">
                {options.map(opt => {
                    const active = form.security[opt.key];
                    return (
                        <motion.div key={opt.key} whileTap={{ scale: 0.98 }} onClick={() => toggle(opt.key)}
                            className={`p-5 rounded-2xl border-2 flex items-center gap-4 cursor-pointer transition-all ${active ? "bg-stone-900 border-stone-900 shadow-[4px_4px_0px_0px_#facc15] -translate-y-0.5" : "bg-white border-stone-200 hover:border-stone-400"}`}>
                            <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center flex-shrink-0 ${active ? "bg-yellow-400 border-yellow-400" : "bg-stone-100 border-stone-200"}`}>
                                <opt.icon size={20} className={active ? "text-stone-900" : "text-stone-400"} />
                            </div>
                            <div className="flex-1 text-left">
                                <h4 className={`font-black text-sm uppercase ${active ? "text-white" : "text-stone-900"}`}>{opt.title}</h4>
                                <p className={`text-[10px] font-semibold mt-0.5 ${active ? "text-stone-400" : "text-stone-500"}`}>{opt.desc}</p>
                            </div>
                            <Tag color={active ? "yellow" : "stone"}>{opt.risk}</Tag>
                        </motion.div>
                    );
                })}
            </div>

            <Card className="p-5 max-w-lg mx-auto">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl border-2 border-stone-900 flex items-center justify-center ${activeCount > 0 ? 'bg-green-400' : 'bg-stone-200'}`}>
                        <Shield size={18} className={activeCount > 0 ? 'text-stone-900' : 'text-stone-400'} />
                    </div>
                    <div className="text-left">
                        <p className="font-black text-sm uppercase">Security Level: {activeCount === 0 ? "None" : activeCount === 1 ? "Low" : activeCount === 2 ? "Medium" : "High"}</p>
                        <p className="text-xs text-stone-400 font-semibold">{activeCount} of 3 shields active</p>
                    </div>
                    <div className="ml-auto flex gap-1">
                        {[0, 1, 2].map(i => <div key={i} className={`w-3 h-3 rounded-sm border-2 border-stone-900 ${i < activeCount ? "bg-green-400" : "bg-stone-200"}`} />)}
                    </div>
                </div>
            </Card>
        </div>
    );
}

function WizardStep4({ form, updateForm }) {
    const [addMode, setAddMode] = useState(null); // "mcq" | "coding" | null
    const [draft, setDraft] = useState({ text: "", options: ["", "", "", ""], correct: 0, code: "", language: "javascript", points: 10 });

    const addQuestion = () => {
        if (!draft.text.trim()) return;
        const q = {
            id: Date.now(), type: addMode, text: draft.text, points: draft.points,
            ...(addMode === "mcq" ? { options: draft.options, correct: draft.correct } : { code: draft.code, language: draft.language }),
        };
        updateForm({ questions: [...form.questions, q] });
        setDraft({ text: "", options: ["", "", "", ""], correct: 0, code: "", language: "javascript", points: 10 });
        setAddMode(null);
    };

    const removeQ = (id) => updateForm({ questions: form.questions.filter(q => q.id !== id) });

    return (
        <div className="space-y-6 pb-8">
            <div className="text-center">
                <h1 className="text-5xl font-black italic tracking-tighter">QUESTIONS</h1>
                <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mt-2">Build Your Game Arena</p>
            </div>

            {/* Question count banner */}
            <div className="flex items-center justify-between p-4 bg-stone-900 rounded-2xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_#facc15]">
                <div className="flex items-center gap-3">
                    <BrainCircuit size={20} className="text-yellow-400" />
                    <span className="font-black text-white uppercase text-sm">{form.questions.length} Question{form.questions.length !== 1 ? "s" : ""} Added</span>
                </div>
                <div className="flex gap-2">
                    {(form.type === "mcq" || form.type === "mixed") && (
                        <button onClick={() => setAddMode("mcq")} className="px-4 py-2 rounded-xl border-2 border-yellow-400 bg-yellow-400 text-stone-900 font-black text-xs uppercase hover:-translate-y-0.5 transition-transform flex items-center gap-1.5">
                            {form.type === "mixed" ? <ListChecks size={13} /> : <Plus size={13} />}
                            {form.type === "mixed" ? "MCQ" : "Add"}
                        </button>
                    )}
                    {(form.type === "coding" || form.type === "mixed") && (
                        <button onClick={() => setAddMode("coding")} className={`px-4 py-2 rounded-xl border-2 border-yellow-400 font-black text-xs uppercase hover:-translate-y-0.5 transition-transform flex items-center gap-1.5 ${form.type === "mixed" ? "bg-stone-900 text-yellow-400" : "bg-yellow-400 text-stone-900"}`}>
                            {form.type === "mixed" ? <Code2 size={13} /> : <Plus size={13} />}
                            {form.type === "mixed" ? "Coding" : "Add"}
                        </button>
                    )}
                </div>
            </div>

            {/* Draft form */}
            <AnimatePresence>
                {addMode && (
                    <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -10, height: 0 }} transition={{ duration: 0.2 }}>
                        <Card className="overflow-hidden">
                            <div className={`p-4 border-b-2 border-stone-900 flex items-center justify-between ${addMode === "mcq" ? "bg-blue-50" : "bg-purple-50"}`}>
                                <span className="font-black text-sm uppercase flex items-center gap-2">
                                    {addMode === "mcq" ? <ListChecks size={15} /> : <Code2 size={15} />}
                                    New {addMode === "mcq" ? "MCQ" : "Coding"} Question
                                </span>
                                <button onClick={() => setAddMode(null)} className="text-stone-400 hover:text-stone-900"><X size={16} /></button>
                            </div>
                            <div className="p-5 space-y-4">
                                <textarea value={draft.text} onChange={e => setDraft(d => ({ ...d, text: e.target.value }))}
                                    placeholder="Enter your question here..." rows={3}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 font-semibold text-sm focus:border-stone-900 focus:outline-none resize-none" />

                                {addMode === "mcq" && (
                                    <div className="space-y-2">
                                        <p className="text-xs font-black uppercase text-stone-400">Options (click ✓ to mark correct)</p>
                                        {draft.options.map((opt, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <button onClick={() => setDraft(d => ({ ...d, correct: i }))}
                                                    className={`w-7 h-7 rounded-lg border-2 border-stone-900 flex items-center justify-center flex-shrink-0 transition-colors ${draft.correct === i ? "bg-green-400" : "bg-white hover:bg-stone-50"}`}>
                                                    {draft.correct === i ? <Check size={13} strokeWidth={3} /> : <span className="text-xs font-black text-stone-400">{String.fromCharCode(65 + i)}</span>}
                                                </button>
                                                <input value={opt} onChange={e => { const o = [...draft.options]; o[i] = e.target.value; setDraft(d => ({ ...d, options: o })); }}
                                                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                                    className="flex-1 px-3 py-2 rounded-xl border-2 border-stone-200 font-semibold text-sm focus:border-stone-900 focus:outline-none" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {addMode === "coding" && (
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            {["javascript", "python", "java", "c++"].map(l => (
                                                <button key={l} onClick={() => setDraft(d => ({ ...d, language: l }))}
                                                    className={`px-3 py-1.5 rounded-lg border-2 border-stone-900 font-black text-[10px] uppercase transition-colors ${draft.language === l ? "bg-stone-900 text-yellow-400" : "bg-white text-stone-600 hover:bg-stone-50"}`}>{l}</button>
                                            ))}
                                        </div>
                                        <textarea value={draft.code} onChange={e => setDraft(d => ({ ...d, code: e.target.value }))}
                                            placeholder="// Starter code or problem description..." rows={4}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 font-mono text-sm focus:border-stone-900 focus:outline-none resize-none bg-stone-900 text-green-400 placeholder-stone-600" />
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black uppercase text-stone-400">Points:</span>
                                        {[5, 10, 15, 20].map(p => (
                                            <button key={p} onClick={() => setDraft(d => ({ ...d, points: p }))}
                                                className={`px-3 py-1.5 rounded-lg border-2 border-stone-900 font-black text-xs transition-colors ${draft.points === p ? "bg-yellow-400" : "bg-white text-stone-600 hover:bg-stone-50"}`}>{p}</button>
                                        ))}
                                    </div>
                                    <RetroButton size="sm" isPrimary={true} onClick={addQuestion} disabled={!draft.text.trim()} text="Add To Sphere" />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Question list */}
            <div className="space-y-3">
                <AnimatePresence>
                    {form.questions.map((q, i) => (
                        <motion.div key={q.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ delay: i * 0.04 }}>
                            <Card className="p-4 flex items-start gap-3 hover:bg-[#FFFDF0] transition-colors group">
                                <div className="w-8 h-8 rounded-lg border-2 border-stone-900 flex items-center justify-center font-black text-sm bg-stone-100 flex-shrink-0">{i + 1}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">{q.text}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Tag color={q.type === "mcq" ? "blue" : "purple"}>{q.type === "mcq" ? "MCQ" : "Code"}</Tag>
                                        {q.type === "coding" && <Tag color="stone">{q.language}</Tag>}
                                        <span className="text-[10px] font-black text-stone-400 uppercase">{q.points} pts</span>
                                    </div>
                                </div>
                                <button onClick={() => removeQ(q.id)} className="text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                    <X size={15} />
                                </button>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {form.questions.length === 0 && (
                    <div className="text-center py-16 text-stone-300 border-2 border-dashed border-stone-200 rounded-2xl bg-white/50">
                        <BrainCircuit size={36} className="mx-auto mb-3 opacity-50" />
                        <p className="font-black uppercase text-sm text-stone-400">No questions yet</p>
                        <p className="text-xs font-semibold mt-1 text-stone-400">Click Add above to start building</p>
                    </div>
                )}
            </div>

            {form.questions.length > 0 && (
                <Card className="p-4 bg-stone-50 flex items-center justify-between border-stone-300 shadow-none">
                    <span className="text-xs font-black uppercase text-stone-500">Total Score Available</span>
                    <span className="font-black text-xl text-stone-900">{form.questions.reduce((a, q) => a + q.points, 0)} pts</span>
                </Card>
            )}
        </div>
    );
}