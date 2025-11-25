import React from 'react';
import { useNavigate } from 'react-router-dom';
export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-[#FFFDF0]/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div
          className="text-2xl font-bold text-black cursor-pointer select-none"
          onClick={() => navigate('/')}
        >
          Sphere<span className="text-gray-500">Test</span>
        </div>

        <div className="flex items-center gap-4">
          <RetroButton
            text="Log In"
            variant="secondary"
            onClick={() => navigate('/login')}
          />
          <RetroButton
            text="Sign Up"
            variant="primary"
            onClick={() => navigate('/login')}
          />
        </div>
      </div>
    </nav>
  );
}

// Reusable Component
function RetroButton({ text, variant = 'primary', onClick }) {
  const isPrimary = variant === 'primary';

  return (
    <div className="game-btn-wrapper" onClick={onClick}>
      <style>{`
        .game-btn-wrapper {
          /* Color Variables */
          --stone-800: #292524;
          --yellow-400: #facc15;
          --yellow-300: #fde047;
          --white-100: #ffffff;
          --gray-100: #f5f5f4;
          
          position: relative;
          display: inline-block;
          height: 3rem; /* Slightly smaller for nav bar balance */
          cursor: pointer;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
        }

        /* 3D Shadow Block */
        .game-btn-shadow {
          position: absolute;
          inset: 0;
          z-index: 0;
          background-color: var(--stone-800);
          border-radius: 0.25rem;
          transform: translate(4px, 4px);
          transition: transform 0.1s;
        }

        /* Main Button Face */
        .game-btn-content {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 0 1.5rem;
          border: 2px solid var(--stone-800);
          border-radius: 0.25rem;
          color: var(--stone-800);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.85rem;
          transition: background-color 0.2s, transform 0.1s;
          overflow: hidden;
        }

        /* Variants */
        .variant-primary {
          background-color: var(--yellow-400);
        }
        .game-btn-wrapper:hover .variant-primary {
          background-color: var(--yellow-300);
        }

        .variant-secondary {
          background-color: var(--white-100);
        }
        .game-btn-wrapper:hover .variant-secondary {
          background-color: var(--gray-100);
        }

        /* Hover & Active Movements */
        .game-btn-wrapper:hover .game-btn-content {
          transform: translateY(-1px);
        }
        .game-btn-wrapper:active .game-btn-content {
          transform: translateY(2px);
        }
        .game-btn-wrapper:active .game-btn-shadow {
          transform: translate(0px, 0px);
        }

        /* Polka Dot Pattern */
        .game-btn-dots {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: 
            radial-gradient(rgba(255, 255, 255, 0.8) 20%, transparent 20%),
            radial-gradient(rgba(255, 255, 255, 1) 20%, transparent 20%);
          background-position: 0 0, 4px 4px;
          background-size: 8px 8px;
          mix-blend-mode: hard-light;
          opacity: 0.4;
          animation: moveDots 2s linear infinite;
        }

        @keyframes moveDots {
          0% { background-position: 0 0, 4px 4px; }
          100% { background-position: 8px 0, 12px 4px; }
        }

        /* Corner Bolts */
        .game-btn-bolt {
          position: absolute;
          width: 3px;
          height: 3px;
          background-color: var(--stone-800);
          z-index: 20;
          pointer-events: none;
        }
        .bolt-tl { top: 3px; left: 3px; }
        .bolt-tr { top: 3px; right: 3px; }
        .bolt-bl { bottom: 3px; left: 3px; }
        .bolt-br { bottom: 3px; right: 3px; }
      `}</style>

      {/* The 3D Shadow Layer */}
      <div className="game-btn-shadow"></div>

      {/* The Button Face */}
      <button
        className={`game-btn-content ${
          isPrimary ? 'variant-primary' : 'variant-secondary'
        }`}
      >
        {/* Polka Dots (Only on primary to keep secondary clean, or remove conditional to have on both) */}
        {isPrimary && <div className="game-btn-dots"></div>}

        {/* Corner Bolts */}
        <div className="game-btn-bolt bolt-tl"></div>
        <div className="game-btn-bolt bolt-tr"></div>
        <div className="game-btn-bolt bolt-bl"></div>
        <div className="game-btn-bolt bolt-br"></div>

        {/* Text */}
        <span className="relative z-10">{text}</span>
      </button>
    </div>
  );
}
