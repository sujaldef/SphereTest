import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  ListChecks,
  Shuffle,
  Clock,
  Users,
  Trophy,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Eye,
  Sparkles,
  Zap,
  BrainCircuit,
} from 'lucide-react';
import { createSphere } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function CreateSphereFixed() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [sphereId, setSphereId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'mcq',
    startTime: '',
    endTime: '',
    duration: 60,
    maxPlayers: 50,
    difficulty: 'medium',
    security: { faceId: true, fullscreen: false, tabSwitchDetection: true },
  });

  const totalSteps = 5;
  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const handleGoToQuestions = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const sphere = await createSphere({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        startTime: formData.startTime || undefined,
        endTime: formData.endTime || undefined,
        duration: Number(formData.duration),
        maxPlayers: Number(formData.maxPlayers),
        difficulty: formData.difficulty,
        security: formData.security,
      });

      localStorage.setItem('latestGameCode', sphere.gameCode);
      localStorage.setItem('latestSphereId', sphere._id);
      setGameCode(sphere.gameCode);
      setSphereId(sphere._id);
      nextStep();
    } catch (apiError) {
      const message =
        apiError?.response?.data?.message || 'Failed to create sphere';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleProceedToQuestions = () => {
    navigate(`/dashboard/sphere/${sphereId}/questions`);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepBlueprint formData={formData} setFormData={setFormData} />;
      case 2:
        return <StepMechanics formData={formData} setFormData={setFormData} />;
      case 3:
        return <StepSecurity formData={formData} setFormData={setFormData} />;
      case 4:
        return <StepContentRedirect onRedirect={handleGoToQuestions} />;
      case 5:
        return (
          <StepGameCode
            gameCode={gameCode}
            onProceed={handleProceedToQuestions}
          />
        );
      default:
        return null;
    }
  };

  return (
    // ROOT: Fixed Height
    <div className="h-screen w-full bg-[#FFFDF0] font-sans text-stone-900 flex overflow-hidden">
      {/* LEFT TIMELINE (Fixed) */}
      <aside className="hidden md:flex flex-col w-[280px] border-r-4 border-stone-200 border-dashed relative z-10 bg-white flex-shrink-0">
        <div className="flex-1 flex flex-col justify-center px-6 gap-8">
          <div className="relative h-[400px] w-1 bg-stone-200 rounded-full ml-4">
            <div
              className="absolute top-0 left-0 w-full bg-yellow-400 rounded-full transition-all duration-500 ease-out"
              style={{
                height: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
              }}
            ></div>
            <div
              className="absolute w-3 h-3 bg-yellow-400 rounded-full border-2 border-stone-900 -left-1 shadow-[0_0_10px_rgba(250,204,21,0.8)] transition-all duration-500 ease-out"
              style={{
                top: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
              }}
            ></div>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 left-12 flex flex-col gap-12 h-[400px] justify-between py-1">
            <TimelineNode
              step={1}
              current={currentStep}
              label="Blueprint"
              icon={<Zap size={14} />}
            />
            <TimelineNode
              step={2}
              current={currentStep}
              label="Mechanics"
              icon={<Clock size={14} />}
            />
            <TimelineNode
              step={3}
              current={currentStep}
              label="Security"
              icon={<ShieldAlert size={14} />}
            />
            <TimelineNode
              step={4}
              current={currentStep}
              label="Questions"
              icon={<BrainCircuit size={14} />}
            />
          </div>
        </div>
      </aside>

      {/* RIGHT CONTENT (Flex Column) */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[#FFFDF0] relative">
        {/* Tech Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.4] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        ></div>

        {/* CONTENT (Scrollable) */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center p-8 relative z-0">
          <div className="w-full max-w-2xl">
            {error ? (
              <p className="mb-4 text-sm font-semibold text-red-600">{error}</p>
            ) : null}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* FOOTER (Fixed) */}
        <div className="h-24 px-8 border-t-4 border-stone-200 border-dashed bg-[#FFFDF0] flex items-center justify-between flex-shrink-0 z-20">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 font-bold px-4 py-2 rounded-lg text-sm transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-stone-400 hover:text-stone-900'}`}
          >
            <ArrowLeft size={16} /> Back
          </button>
          {currentStep === 4 ? (
            <RetroButton
              text={submitting ? 'CREATING...' : 'CREATE & CONTINUE'}
              icon={Sparkles}
              onClick={handleGoToQuestions}
              isPrimary={true}
            />
          ) : currentStep === totalSteps ? (
            <RetroButton
              text="OPEN STUDIO"
              icon={Sparkles}
              onClick={handleProceedToQuestions}
              isPrimary={true}
            />
          ) : (
            <RetroButton
              text="NEXT"
              icon={ArrowRight}
              onClick={nextStep}
              isPrimary={true}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// Subcomponents for CreateSphereFixed (Minimal definitions for compactness)
function StepBlueprint({ formData, setFormData }) {
  return (
    <div className="space-y-6 text-center">
      <div>
        <h1 className="text-4xl font-black text-stone-900 italic tracking-tighter">
          BLUEPRINT
        </h1>
        <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mt-2">
          Core Identity
        </p>
      </div>
      <div className="space-y-6">
        <div className="group">
          <input
            type="text"
            placeholder="ENTER TITLE..."
            className="w-full text-center text-3xl font-black bg-transparent border-b-4 border-stone-200 py-2 focus:border-stone-900 focus:outline-none placeholder-stone-200 uppercase"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <ModeOption
            icon={ListChecks}
            label="Quiz"
            active={formData.type === 'mcq'}
            onClick={() => setFormData({ ...formData, type: 'mcq' })}
          />
          <ModeOption
            icon={Terminal}
            label="Coding"
            active={formData.type === 'coding'}
            onClick={() => setFormData({ ...formData, type: 'coding' })}
          />
          <ModeOption
            icon={Shuffle}
            label="Hybrid"
            active={formData.type === 'mixed'}
            onClick={() => setFormData({ ...formData, type: 'mixed' })}
          />
        </div>
      </div>
    </div>
  );
}
function StepMechanics({ formData, setFormData }) {
  // Format date to YYYY-MM-DD for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Format time to HH:MM for input
  const formatTimeForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="space-y-6 text-center">
      <div>
        <h1 className="text-4xl font-black text-stone-900 italic tracking-tighter">
          MECHANICS & SCHEDULE
        </h1>
        <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mt-2">
          Rules and Timing
        </p>
      </div>

      {/* Duration and Max Players */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-black uppercase">
              <Clock size={14} className="inline mr-1" /> Duration
            </span>
            <span className="font-black text-xl">{formData.duration}m</span>
          </div>
          <input
            type="range"
            min="15"
            max="180"
            step="15"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            className="w-full accent-stone-900"
          />
        </div>
        <div className="bg-white p-4 rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-black uppercase">
              <Users size={14} className="inline mr-1" /> Max Players
            </span>
            <span className="font-black text-xl">{formData.maxPlayers}</span>
          </div>
          <input
            type="range"
            min="10"
            max="500"
            step="10"
            value={formData.maxPlayers}
            onChange={(e) =>
              setFormData({ ...formData, maxPlayers: e.target.value })
            }
            className="w-full accent-stone-900"
          />
        </div>
      </div>

      {/* Schedule Section */}
      <div className="max-w-lg mx-auto space-y-4">
        <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-400">
          <p className="text-xs font-black uppercase text-stone-700 mb-3">
            Optional: Schedule This Session
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formatDateForInput(formData.startTime)}
                onChange={(e) => {
                  if (e.target.value) {
                    // Parse date as local time (not UTC)
                    // HTML date input returns YYYY-MM-DD which new Date() treats as UTC
                    const [year, month, day] = e.target.value
                      .split('-')
                      .map(Number);
                    const localDate = new Date(year, month - 1, day);

                    // If time already exists, preserve it; otherwise use midnight
                    const existingTime = formData.startTime
                      ? new Date(formData.startTime)
                      : null;
                    if (existingTime) {
                      localDate.setHours(
                        existingTime.getHours(),
                        existingTime.getMinutes(),
                        0,
                      );
                    } else {
                      localDate.setHours(0, 0, 0);
                    }

                    setFormData({
                      ...formData,
                      startTime: localDate.toISOString(),
                    });
                  } else {
                    setFormData({ ...formData, startTime: '' });
                  }
                }}
                className="w-full px-3 py-2 border-2 border-stone-900 rounded-lg bg-white font-mono text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={formatTimeForInput(formData.startTime)}
                onChange={(e) => {
                  if (e.target.value) {
                    const [hours, minutes] = e.target.value
                      .split(':')
                      .map(Number);
                    let localDate;

                    if (formData.startTime) {
                      // Use existing date, just update time
                      localDate = new Date(formData.startTime);
                    } else {
                      // No date selected yet, use today
                      localDate = new Date();
                    }

                    // Set time in local timezone
                    localDate.setHours(hours, minutes, 0, 0);
                    setFormData({
                      ...formData,
                      startTime: localDate.toISOString(),
                    });
                  }
                }}
                className="w-full px-3 py-2 border-2 border-stone-900 rounded-lg bg-white font-mono text-sm focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formatDateForInput(formData.endTime)}
                onChange={(e) => {
                  if (e.target.value) {
                    const [year, month, day] = e.target.value
                      .split('-')
                      .map(Number);
                    const localDate = new Date(year, month - 1, day);

                    const existingTime = formData.endTime
                      ? new Date(formData.endTime)
                      : null;
                    if (existingTime) {
                      localDate.setHours(
                        existingTime.getHours(),
                        existingTime.getMinutes(),
                        0,
                      );
                    } else {
                      localDate.setHours(23, 59, 59);
                    }

                    setFormData({
                      ...formData,
                      endTime: localDate.toISOString(),
                    });
                  } else {
                    setFormData({ ...formData, endTime: '' });
                  }
                }}
                className="w-full px-3 py-2 border-2 border-stone-900 rounded-lg bg-white font-mono text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={formatTimeForInput(formData.endTime)}
                onChange={(e) => {
                  if (e.target.value) {
                    const [hours, minutes] = e.target.value
                      .split(':')
                      .map(Number);
                    let localDate;

                    if (formData.endTime) {
                      localDate = new Date(formData.endTime);
                    } else {
                      localDate = new Date();
                    }

                    localDate.setHours(hours, minutes, 0, 0);
                    setFormData({
                      ...formData,
                      endTime: localDate.toISOString(),
                    });
                  }
                }}
                className="w-full px-3 py-2 border-2 border-stone-900 rounded-lg bg-white font-mono text-sm focus:outline-none"
              />
            </div>
          </div>
          <p className="text-[10px] text-stone-600 mt-2">
            Leave blank for immediate/on-demand session
          </p>
        </div>
      </div>
    </div>
  );
}
function StepSecurity({ formData, setFormData }) {
  const toggle = (key) =>
    setFormData({
      ...formData,
      security: { ...formData.security, [key]: !formData.security[key] },
    });
  return (
    <div className="space-y-6 text-center">
      <div>
        <h1 className="text-4xl font-black text-stone-900 italic tracking-tighter">
          SECURITY
        </h1>
        <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mt-2">
          Anti-Cheat Matrix
        </p>
      </div>
      <div className="grid gap-4 max-w-md mx-auto">
        <SecurityToggle
          active={formData.security.faceId}
          onClick={() => toggle('faceId')}
          title="Face ID"
          desc="AI Monitor"
          icon={Eye}
        />
        <SecurityToggle
          active={formData.security.tabSwitchDetection}
          onClick={() => toggle('tabSwitchDetection')}
          title="Tab Lock"
          desc="Alert Switch"
          icon={ShieldAlert}
        />
        <SecurityToggle
          active={formData.security.fullscreen}
          onClick={() => toggle('fullscreen')}
          title="Fullscreen"
          desc="Force Mode"
          icon={Trophy}
        />
      </div>
    </div>
  );
}
function StepContentRedirect({ onRedirect }) {
  return (
    <div className="text-center space-y-6">
      <div
        className="w-24 h-24 bg-stone-900 rounded-full flex items-center justify-center mx-auto shadow-[0px_0px_20px_rgba(250,204,21,0.5)] cursor-pointer hover:scale-110 transition-transform"
        onClick={onRedirect}
      >
        <BrainCircuit size={40} className="text-yellow-400" />
      </div>
      <div>
        <h2 className="text-3xl font-black uppercase italic">Setup Complete</h2>
        <p className="text-xs font-bold text-stone-400 mt-2">
          Proceed to Question Studio
        </p>
      </div>
    </div>
  );
}
function TimelineNode({ step, current, label, icon }) {
  const isActive = step === current;
  return (
    <div
      className={`flex items-center gap-3 transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 border-stone-900 ${isActive ? 'bg-stone-900 text-yellow-400' : 'bg-white'}`}
      >
        {icon}
      </div>
      <span className="text-xs font-black uppercase">{label}</span>
    </div>
  );
}
function ModeOption({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${active ? 'border-stone-900 bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] -translate-y-1' : 'border-stone-200 bg-white hover:border-stone-400'}`}
    >
      <Icon size={24} strokeWidth={active ? 3 : 2} />
      <span className="text-xs font-black uppercase">{label}</span>
    </button>
  );
}
function SecurityToggle({ active, onClick, title, desc, icon: Icon }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border-2 flex items-center gap-4 cursor-pointer transition-all ${active ? 'bg-stone-900 border-stone-900 shadow-[4px_4px_0px_0px_#facc15] -translate-y-1' : 'bg-white border-stone-200 hover:border-stone-400'}`}
    >
      <div
        className={`p-2 rounded-lg ${active ? 'bg-yellow-400 text-stone-900' : 'bg-stone-100 text-stone-400'}`}
      >
        <Icon size={18} />
      </div>
      <div className="text-left">
        <h4
          className={`font-black text-sm uppercase ${active ? 'text-white' : 'text-stone-900'}`}
        >
          {title}
        </h4>
        <p
          className={`text-[10px] font-bold uppercase ${active ? 'text-stone-400' : 'text-stone-400'}`}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}
function RetroButton({ text, onClick, icon: Icon, isPrimary = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-stone-900 font-black text-sm uppercase transition-all shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] active:translate-y-0 active:shadow-none ${isPrimary ? 'bg-yellow-400 text-stone-900' : 'bg-white text-stone-900'}`}
    >
      {text} {Icon && <Icon size={16} strokeWidth={3} />}
    </button>
  );
}

function StepGameCode({ gameCode, onProceed }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(gameCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div className="text-center space-y-8">
      <div>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
          Sphere Created!
        </h2>
        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
          Share your game code with others
        </p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div className="bg-stone-900 p-8 rounded-2xl border-4 border-stone-900 shadow-[8px_8px_0px_0px_rgba(250,204,21,0.5)]">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
            Join Code
          </p>
          <div onClick={handleCopy} className="cursor-pointer group relative">
            <div className="font-mono text-5xl font-black text-yellow-400 tracking-[0.5em] group-hover:text-yellow-300 transition-colors">
              {gameCode.split('').map((char, i) => (
                <span
                  key={i}
                  className="inline-block hover:scale-110 transition-transform"
                >
                  {char}
                </span>
              ))}
            </div>
            <p className="text-[10px] font-bold text-stone-500 mt-3 group-hover:text-stone-300 transition-colors">
              {copied ? '✓ COPIED!' : 'Click to copy'}
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-400 space-y-2">
          <p className="text-sm font-bold text-stone-900">📢 How to use:</p>
          <ul className="text-xs text-stone-700 space-y-1 text-left">
            <li>✓ Share code with students</li>
            <li>✓ They enter it on Join Sphere</li>
            <li>✓ You see them in your lobby</li>
          </ul>
        </div>
      </div>

      <motion.button
        onClick={onProceed}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-yellow-400 border-2 border-stone-900 text-stone-900 font-black text-sm px-8 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] transition-all flex items-center gap-2 mx-auto"
      >
        <Sparkles size={18} strokeWidth={4} /> Continue to Studio
      </motion.button>
    </motion.div>
  );
}
