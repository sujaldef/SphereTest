import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  RefreshCw,
  Check,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  ArrowLeft,
  Gamepad2,
  Joystick,
  Sword,
  Trophy,
} from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false); // Default to Sign Up as per request focus

  return (
    <div className="min-h-screen bg-[#FFFDF0] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* --- CUSTOM BACKGROUND STYLE --- */}
      <style>{`
        .gamified-bg {
          width: 100%;
          height: 100%;
          --s: 120px; /* Size of the pattern */
          --c1: #f0c838ff; /* Updated Yellow from your snippet */
          --c2: #FBF9F1; /* Cream BG color */
          
          /* Pattern Logic */
          --_g: var(--c2) 4% 14%, var(--c1) 14% 24%, var(--c2) 22% 34%,
            var(--c1) 34% 44%, var(--c2) 44% 56%, var(--c1) 56% 66%, var(--c2) 66% 76%,
            var(--c1) 76% 86%, var(--c2) 86% 96%;
            
          background:
            radial-gradient(
              100% 100% at 100% 0,
              var(--c1) 4%,
              var(--_g),
              #0008 96%,
              #0000
            ),
            radial-gradient(
                100% 100% at 0 100%,
                #0000,
                #0008 4%,
                var(--_g),
                var(--c1) 96%
              )
              var(--c1);
          background-size: var(--s) var(--s);
          opacity: 0.6; 

          /* Animation: Moves the background pattern diagonally */
          animation: bg-scroll 20s linear infinite;
        }

        @keyframes bg-scroll {
          0% {
            background-position: 0 0;
          }
          100% {
            /* Move by exactly one pattern unit to ensure seamless looping */
            background-position: var(--s) var(--s);
          }
        }

        /* Floating Animation for Icons */
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        .floating-icon {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* Background Pattern Layer */}
      <div className="absolute inset-0 gamified-bg pointer-events-none z-0"></div>

      <div className="w-full max-w-5xl h-[650px] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex relative z-10 border-4 border-stone-900">
        {/* Left Side: Graphic / Info Area */}
        <div
          className={`hidden md:flex w-1/2 bg-stone-900 text-[#FBF9F1] flex-col justify-between p-12 transition-all duration-500 ease-in-out ${
            isLogin ? 'order-2' : 'order-1'
          }`}
        >
          <div>
            <div className="text-3xl font-black tracking-tighter mb-4">
              Sphere<span className="text-yellow-400">Test</span>
            </div>
            <h2 className="text-5xl font-bold leading-tight mb-6">
              {isLogin ? 'Welcome Back, Player 1.' : 'Level Up Your Classroom.'}
            </h2>
            <p className="text-stone-400 text-lg">
              {isLogin
                ? "Enter the arena and track your students' progress in real-time."
                : 'Create your first Sphere today. Secure, gamified, and instant.'}
            </p>
          </div>

          {/* Gamified Stat Box */}
          <div className="bg-stone-800 p-6 rounded-xl border border-stone-700 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
              <Camera size={64} />
            </div>
            <h3 className="text-yellow-400 font-bold uppercase text-sm mb-1">
              System Status
            </h3>
            <div className="text-2xl font-mono flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              {isLogin ? 'Face ID Active' : 'Registration Open'}
            </div>
          </div>
        </div>

        {/* Right Side: Forms */}
        <div
          className={`w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#FFFDD0]/30 transition-all duration-500 ${
            isLogin ? 'order-1' : 'order-2'
          }`}
        >
          {/* Header Switcher */}
          <div className="flex justify-end mb-8">
            <div className="bg-stone-200 p-1 rounded-full inline-flex">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  isLogin
                    ? 'bg-stone-900 text-white shadow-lg'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                LOGIN
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  !isLogin
                    ? 'bg-stone-900 text-white shadow-lg'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                REGISTER
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <LoginForm key="login" />
              ) : (
                <MultiStepRegister key="register" />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function LoginForm() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      <div className="text-center md:text-left">
        <h3 className="text-3xl font-black text-stone-900 mb-2">Login</h3>
        <p className="text-stone-500">
          Access your dashboard using credentials or Face ID.
        </p>
      </div>

      <div className="space-y-4">
        <GamifiedInput icon={Mail} type="email" placeholder="Email Address" />
        <GamifiedInput icon={Lock} type="password" placeholder="Password" />
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer text-stone-600">
          <input
            type="checkbox"
            className="rounded border-stone-300 text-yellow-500 focus:ring-yellow-500"
          />
          Remember me
        </label>
        <a
          href="#"
          className="font-bold text-stone-900 hover:text-yellow-600 underline decoration-yellow-400 decoration-2"
        >
          Forgot Password?
        </a>
      </div>

      <RetroButton text="ENTER SYSTEM" fullWidth />

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-stone-300"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#fbfaf6] px-2 text-stone-400 font-mono">
            Or login with
          </span>
        </div>
      </div>

      <button className="w-full py-3 border-2 border-stone-200 rounded-xl font-bold text-stone-600 hover:border-stone-900 hover:bg-stone-50 transition-all flex items-center justify-center gap-2">
        <Camera size={20} /> Face Recognition
      </button>
    </motion.div>
  );
}

function MultiStepRegister() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    faceImage: null,
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex flex-col"
    >
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
          <span className={step >= 1 ? 'text-stone-900' : ''}>
            Step 1: Info
          </span>
          <span className={step >= 2 ? 'text-stone-900' : ''}>
            Step 2: Biometrics
          </span>
        </div>
        <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-yellow-400"
            initial={{ width: '0%' }}
            animate={{ width: step === 1 ? '50%' : '100%' }}
            transition={{ duration: 0.5, ease: 'circOut' }}
          />
        </div>
      </div>

      {step === 1 ? (
        <div className="space-y-6">
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-black text-stone-900 mb-2">
              Create Account
            </h3>
            <p className="text-stone-500">Join the SphereTest network.</p>
          </div>
          <div className="space-y-4">
            <GamifiedInput icon={User} type="text" placeholder="Full Name" />
            <GamifiedInput
              icon={Mail}
              type="email"
              placeholder="Email Address"
            />
            <GamifiedInput icon={Phone} type="tel" placeholder="Phone Number" />
          </div>
          <div className="pt-4">
            <RetroButton
              text="NEXT: FACE ID"
              onClick={nextStep}
              fullWidth
              icon={ArrowRight}
            />
          </div>
        </div>
      ) : (
        <FaceCaptureStep onBack={prevStep} />
      )}
    </motion.div>
  );
}

function FaceCaptureStep({ onBack }) {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Simple HTML5 Video Capture logic
  const videoRef = useRef(null);

  const startVideo = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('We need camera access to secure your account!');
    }
  }, []);

  React.useEffect(() => {
    if (!imgSrc) startVideo();
    return () => {
      // Cleanup stream if needed
    };
  }, [imgSrc, startVideo]);

  const capture = useCallback(() => {
    setIsCapturing(true);
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      setImgSrc(canvas.toDataURL('image/jpeg'));
      setIsCapturing(false);
    }, 500); // Fake delay for effect
  }, []);

  const retake = () => {
    setImgSrc(null);
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="text-center md:text-left mb-2">
        <h3 className="text-2xl font-black text-stone-900">
          Secure Your Sphere
        </h3>
        <p className="text-stone-500 text-sm">
          We use facial recognition for quick, secure classroom access.
        </p>
      </div>

      {/* Camera Viewport */}
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border-4 border-stone-900 shadow-inner group">
        {!imgSrc ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
              onLoadedMetadata={() => videoRef.current.play()}
            />
            {/* Overlay UI */}
            <div className="absolute inset-0 pointer-events-none border-2 border-yellow-400/50 m-4 rounded-lg opacity-50"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-dashed border-white/70 rounded-full"></div>
            <div className="absolute bottom-4 left-0 w-full text-center text-white/80 text-xs font-mono animate-pulse">
              ALIGN FACE IN CENTER
            </div>
          </>
        ) : (
          <img
            src={imgSrc}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        )}

        {isCapturing && (
          <div className="absolute inset-0 bg-white animate-flash"></div>
        )}
      </div>

      <div className="flex gap-4 pt-2 mt-auto">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl font-bold border-2 border-stone-200 text-stone-500 hover:border-stone-900 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        {!imgSrc ? (
          <button
            onClick={capture}
            className="flex-1 bg-stone-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-transform active:scale-95"
          >
            <Camera size={20} /> CAPTURE
          </button>
        ) : (
          <>
            <button
              onClick={retake}
              className="flex-1 bg-white border-2 border-stone-200 text-stone-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-50"
            >
              <RefreshCw size={20} /> RETAKE
            </button>
            <button className="flex-1 bg-yellow-400 text-stone-900 rounded-xl font-bold flex items-center justify-center gap-2 border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <Check size={20} /> FINISH
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes flash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-flash {
          animation: flash 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// --- UTILITY COMPONENTS ---

function GamifiedInput({ icon: Icon, ...props }) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-yellow-500 transition-colors">
        <Icon size={20} />
      </div>
      <input
        {...props}
        className="w-full bg-white border-2 border-stone-200 rounded-xl py-3 pl-12 pr-4 text-stone-900 font-medium placeholder-stone-400 focus:outline-none focus:border-stone-900 focus:ring-4 focus:ring-yellow-400/20 transition-all"
      />
    </div>
  );
}

function RetroButton({ text, onClick, fullWidth, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative group cursor-pointer
        ${fullWidth ? 'w-full' : 'w-auto'}
      `}
    >
      <div className="absolute inset-0 bg-stone-900 rounded-xl translate-y-1 translate-x-1 transition-transform group-hover:translate-x-0 group-hover:translate-y-0 group-active:translate-x-0 group-active:translate-y-0"></div>
      <div className="relative bg-yellow-400 border-2 border-stone-900 text-stone-900 font-black text-lg py-3 px-6 rounded-xl flex items-center justify-center gap-3 transition-transform group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 group-active:translate-y-1 group-active:translate-x-1">
        {text}
        {Icon && <Icon size={24} strokeWidth={3} />}
      </div>
    </button>
  );
}
