import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Hash,
  User,
  Camera,
  Sparkles,
  Link as LinkIcon,
  AlertCircle,
  Mail,
  Lock,
} from 'lucide-react';
import {
  getSphereByCode,
  joinSphere,
  registerUser,
  loginUser,
} from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function JoinSphere() {
  const navigate = useNavigate();

  // State for the flow: 'code' -> 'register' -> 'ready'
  const [step, setStep] = useState('code');
  const [gameCode, setGameCode] = useState('');
  const [isLinkJoin] = useState(false); // Simulates joining via link
  const [sphere, setSphere] = useState(null);
  const [joinedSphere, setJoinedSphere] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { token, login, user } = useAuth();

  // Mock function  to simulate "Link Join" detection
  useEffect(() => {
    // In a real app, you'd check URL params here
    const timer = setTimeout(() => {
      // Just for demo purposes, showing a "Link Detected" toast occasionally
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (gameCode.trim().length < 6) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const details = await getSphereByCode(gameCode.trim());
      setSphere(details);

      // 🔒 ADMIN CHECK: Prevent admin from joining own sphere
      if (user && details.createdBy._id === user._id) {
        setError(
          'You created this sphere - admins cannot join as participants. Go to My Spheres to manage it.',
        );
        setLoading(false);
        return;
      }

      // If already authenticated, skip registration and join directly
      if (token) {
        setStep('joining');
        // Immediately try to join
        const result = await joinSphere({ gameCode: details.gameCode });
        setJoinedSphere(result);

        // ✅ FIX #1: Check if session is ACTIVE and redirect immediately (late join)
        if (result.sessionStatus === 'ACTIVE') {
          // Late join - redirect directly to test page
          console.log('🟢 Late join detected - redirecting to test...');
          navigate(`/dashboard/sphere/${result._id}/test`);
          return;
        }

        setStep('ready');
      } else {
        // Need to register/login first
        setStep('register');
      }
    } catch (apiError) {
      // Get error message from error object
      const errorMessage =
        apiError?.message || 'Invalid code. Please check and try again.';
      setError(errorMessage);
      console.error('Code lookup error:', apiError);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!sphere) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      let accessToken = token;

      if (!accessToken) {
        try {
          const registered = await registerUser(registerData);
          accessToken = registered.token;
        } catch (registerErr) {
          if (
            registerErr?.status === 409 ||
            registerErr?.originalError?.response?.status === 409
          ) {
            // User already exists, try login
            try {
              const loggedIn = await loginUser({
                email: registerData.email,
                password: registerData.password,
              });
              accessToken = loggedIn.token;
            } catch (loginErr) {
              // Login failed, throw appropriate error
              throw new Error(loginErr?.message || 'Invalid login credentials');
            }
          } else {
            // Registration error (validation, server error, etc)
            throw registerErr;
          }
        }

        await login(accessToken);
      }

      const result = await joinSphere({ gameCode: sphere.gameCode });
      setJoinedSphere(result);

      // ✅ FIX #1: Check if session is ACTIVE and redirect immediately (late join)
      if (result.sessionStatus === 'ACTIVE') {
        // Late join - redirect directly to test page
        console.log('🟢 Late join detected - redirecting to test...');
        navigate(`/dashboard/sphere/${result._id}/test`);
        return;
      }

      setStep('ready');
    } catch (apiError) {
      // Use backend error message directly
      const errorMessage =
        apiError?.message || 'Unable to join sphere. Please try again.';
      setError(errorMessage);
      console.error('Join sphere error:', apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF0] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* --- SHARED THEME STYLES (Reused for consistency) --- */}
      <style>{`
        .gamified-bg {
          width: 100%;
          height: 100%;
          --s: 120px; 
          --c1: #f0c838ff; 
          --c2: #FFFDF0; 
          
          --_g: var(--c2) 4% 14%, var(--c1) 14% 24%, var(--c2) 22% 34%,
            var(--c1) 34% 44%, var(--c2) 44% 56%, var(--c1) 56% 66%, var(--c2) 66% 76%,
            var(--c1) 76% 86%, var(--c2) 86% 96%;
            
          background:
            radial-gradient(100% 100% at 100% 0, var(--c1) 4%, var(--_g), #0008 96%, #0000),
            radial-gradient(100% 100% at 0 100%, #0000, #0008 4%, var(--_g), var(--c1) 96%)
            var(--c1);
          background-size: var(--s) var(--s);
          opacity: 0.6; 
          animation: bg-scroll 20s linear infinite;
        }

        @keyframes bg-scroll {
          0% { background-position: 0 0; }
          100% { background-position: var(--s) var(--s); }
        }

        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        
        .floating-icon { animation: float 6s ease-in-out infinite; }
      `}</style>

      {/* Background Layers */}
      <div className="absolute inset-0 gamified-bg pointer-events-none z-0"></div>

      {/* --- MAIN CARD --- */}
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden relative z-10 border-4 border-stone-900">
        {/* Card Header (Game Cartridge Style) */}
        <div className="bg-stone-900 p-6 text-center border-b-4 border-yellow-400 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-2 bg-stone-800 rounded-b-lg"></div>
          <h1 className="text-3xl font-black text-[#FBF9F1] tracking-tight mt-2">
            JOIN <span className="text-yellow-400">SPHERE</span>
          </h1>
          <p className="text-stone-400 text-xs font-mono uppercase tracking-widest mt-1">
            Player Connection Protocol
          </p>
        </div>

        {/* Dynamic Content Area */}
        <div className="p-8 min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            {/* STEP 1: ENTER CODE */}
            {step === 'code' && (
              <motion.div
                key="code-step"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="flex-1 flex flex-col justify-center space-y-6"
              >
                {/* Link Detected Toast (Simulation) */}
                {isLinkJoin && (
                  <div className="bg-blue-50 border-2 border-blue-200 text-blue-800 p-3 rounded-xl flex items-center gap-3 text-sm font-bold animate-pulse">
                    <LinkIcon size={16} />
                    <span>Invite Link Detected: Sphere #8821</span>
                  </div>
                )}

                <div className="text-center space-y-2">
                  <div className="inline-block p-4 bg-yellow-100 rounded-full text-yellow-600 mb-2">
                    <Hash size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900">
                    Enter Access Code
                  </h2>
                  <p className="text-stone-500 text-sm">
                    Input the 6-character code provided by your instructor.
                  </p>
                </div>

                <form onSubmit={handleCodeSubmit} className="space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={gameCode}
                      onChange={(e) =>
                        setGameCode(e.target.value.toUpperCase())
                      }
                      placeholder="ABC-123"
                      maxLength={7}
                      className="w-full bg-stone-50 border-4 border-stone-200 focus:border-yellow-400 rounded-2xl py-4 text-center text-3xl font-black text-stone-900 tracking-[0.5em] placeholder-stone-300 focus:outline-none transition-all uppercase"
                    />
                  </div>

                  <RetroButton
                    text={loading ? 'CONNECTING...' : 'CONNECT'}
                    fullWidth
                    icon={ArrowRight}
                    disabled={gameCode.trim().length < 6 || loading}
                  />
                </form>

                {error ? (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex gap-3 items-start">
                    <AlertCircle
                      className="text-red-600 shrink-0 mt-0.5"
                      size={20}
                    />
                    <div>
                      <p className="text-sm font-semibold text-red-800">
                        Connection Failed
                      </p>
                      <p className="text-xs text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                ) : null}

                <div className="text-center">
                  <span className="text-xs font-bold text-stone-400 uppercase">
                    Or scan QR Code
                  </span>
                </div>
              </motion.div>
            )}

            {/* STEP 2: REGISTER TO PLAY */}
            {step === 'register' && (
              <motion.div
                key="register-step"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex-1 flex flex-col space-y-6"
              >
                <div
                  className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-wider cursor-pointer hover:text-stone-900"
                  onClick={() => setStep('code')}
                >
                  <ArrowRight className="rotate-180" size={14} /> Back to Code
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-black text-stone-900">
                    AI Registration
                  </h2>
                  <p className="text-stone-500 text-sm mt-1">
                    This sphere uses{' '}
                    <span className="font-bold text-stone-900">
                      ML Monitoring
                    </span>
                    . Please create an account and scan your face to proceed.
                  </p>
                  {sphere ? (
                    <p className="text-xs font-bold text-stone-500 mt-2 uppercase tracking-wide">
                      Joining: {sphere.title} ({sphere.gameCode})
                    </p>
                  ) : null}
                </div>

                {/* Face ID Scan Spot */}
                <div className="flex justify-center">
                  <div className="w-32 h-32 bg-stone-100 rounded-2xl border-4 border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 cursor-pointer hover:border-yellow-400 hover:text-yellow-600 hover:bg-yellow-50 transition-all relative group overflow-hidden shadow-inner">
                    {/* Scanning Animation */}
                    <div className="absolute inset-x-0 h-1 bg-yellow-400 shadow-[0_0_10px_2px_rgba(250,204,21,0.5)] top-0 opacity-0 group-hover:opacity-100 group-hover:animate-[scan_1.5s_linear_infinite]"></div>

                    <Camera size={32} className="relative z-10" />
                    <span className="text-[10px] font-bold uppercase mt-2 text-center leading-tight px-2 relative z-10">
                      Scan Face
                      <br />
                      for AI Model
                    </span>

                    {/* "Required" Badge */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse z-10"></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <GamifiedInput
                    icon={User}
                    placeholder="Full Name"
                    autoFocus
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, name: e.target.value })
                    }
                  />
                  <GamifiedInput
                    icon={Mail}
                    placeholder="Email Address"
                    type="email"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                  />
                  <GamifiedInput
                    icon={Lock}
                    placeholder="Password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                  />

                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl flex gap-3 items-start">
                    <AlertCircle
                      className="text-yellow-600 shrink-0"
                      size={18}
                    />
                    <p className="text-xs text-yellow-800 font-medium leading-relaxed">
                      Your face data is required to train the monitoring model
                      for this session.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <RetroButton
                    text={loading ? 'JOINING...' : 'CREATE & JOIN'}
                    fullWidth
                    icon={Sparkles}
                    onClick={handleJoin}
                    disabled={
                      loading ||
                      !registerData.name.trim() ||
                      !registerData.email.trim() ||
                      !registerData.password.trim()
                    }
                  />
                </div>

                {error ? (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex gap-3 items-start">
                    <AlertCircle
                      className="text-red-600 shrink-0 mt-0.5"
                      size={20}
                    />
                    <div>
                      <p className="text-sm font-semibold text-red-800">
                        Join Failed
                      </p>
                      <p className="text-xs text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            )}

            {step === 'joining' && (
              <motion.div
                key="joining-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col justify-center items-center space-y-6"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-black text-stone-900">
                    Joining Sphere
                  </h2>
                  <p className="text-stone-500 text-sm">
                    Connecting you to{' '}
                    <span className="font-bold text-stone-900">
                      {sphere?.title}
                    </span>
                    ...
                  </p>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </motion.div>
            )}

            {step === 'ready' && (
              <motion.div
                key="ready-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col justify-center space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black text-stone-900">
                    Connected
                  </h2>
                  <p className="text-stone-500 text-sm">
                    You have joined the sphere successfully.
                  </p>
                </div>

                {joinedSphere ? (
                  <div className="bg-stone-50 border-2 border-stone-200 rounded-xl p-4 space-y-2 text-sm">
                    <p>
                      <span className="font-bold">Title:</span>{' '}
                      {joinedSphere.title}
                    </p>
                    <p>
                      <span className="font-bold">Code:</span>{' '}
                      {joinedSphere.gameCode}
                    </p>
                    <p>
                      <span className="font-bold">Participants:</span>{' '}
                      {joinedSphere.participants?.length || 0}
                    </p>
                  </div>
                ) : null}

                <div className="text-center text-xs font-bold uppercase tracking-wider text-stone-500">
                  Waiting for test to start...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 p-4 border-t border-stone-200 flex justify-between items-center text-xs font-mono text-stone-400">
          <span>v2.4.0</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            AI MONITOR ACTIVE
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SHARED COMPONENTS (Simplified for this file) ---

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

function RetroButton({ text, onClick, fullWidth, icon: Icon, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
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
