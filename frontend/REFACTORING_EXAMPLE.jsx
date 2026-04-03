/* ============================================
   GAMIFIED UI - REFACTORING EXAMPLE
   How to convert existing components to use GameUI
   ============================================ */

// BEFORE: Using raw HTML/Tailwind
const OldHeroButton = () => {
  return (
    <button className="px-6 py-2 bg-yellow-400 border-2 border-black rounded-sm font-bold hover:shadow-lg transition">
      Create Sphere
    </button>
  );
};

// AFTER: Using GameButton component
import { GameButton } from './components/GameUI';
import { FaRocket } from 'react-icons/fa';

const NewHeroButton = () => {
  return (
    <GameButton
      variant="primary"
      size="lg"
      icon={FaRocket}
      onClick={() => navigate('/create')}
    >
      Create Sphere
    </GameButton>
  );
};

// ============================================
// LANDING PAGE REFACTORING - STEP BY STEP
// ============================================

// Step 1: Import components at top of index.jsx
import {
  GameButton,
  GameCard,
  GameFeatureBox,
  GameSectionHeader,
  GameGrid,
  GameContainer,
  GameBadge,
} from '../components/GameUI';
import './../../styles/gameUI.css'; // Add this import!

// ============================================
// HERO SECTION BEFORE → AFTER
// ============================================

// BEFORE - index.jsx hero
const OldHero = () => {
  return (
    <section className="bg-yellow-400 py-20">
      <h1 className="text-5xl font-black">Test Smarter. Together.</h1>
      <p className="text-xl">Join spheres with friends</p>
      <button className="px-8 py-3 bg-yellow-400 border-2 border-black">
        Create
      </button>
    </section>
  );
};

// AFTER - Refactored
const NewHero = () => {
  const navigate = useNavigate();

  return (
    <GameContainer className="bg-yellow-400 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="game-section-title">Test Smarter. Together.</h1>
        <p className="game-section-subtitle mt-4">
          Join spheres with friends, answer questions, compete
        </p>
        <div className="flex gap-4 mt-8">
          <GameButton
            variant="primary"
            size="lg"
            icon={FaRocket}
            onClick={() => navigate('/create')}
          >
            Create Sphere
          </GameButton>
          <GameButton
            variant="secondary"
            size="lg"
            onClick={() => navigate('/join')}
          >
            Join Now
          </GameButton>
        </div>
      </div>
    </GameContainer>
  );
};

// ============================================
// FEATURES SECTION BEFORE → AFTER
// ============================================

// BEFORE - Raw cards
const OldFeatures = () => {
  return (
    <section className="py-20">
      <h2 className="text-4xl font-bold mb-12">Features</h2>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white border-2 border-black p-6 rounded">
          <FaChartLine size={40} className="mb-4" />
          <h3 className="font-bold text-lg mb-2">Analytics</h3>
          <p className="text-gray-600">Track your progress</p>
        </div>
        {/* More cards... */}
      </div>
    </section>
  );
};

// AFTER - Using GameFeatureBox
const NewFeatures = () => {
  const features = [
    { icon: FaChartLine, title: 'Analytics', desc: 'Track your progress' },
    { icon: FaBrain, title: 'Smart AI', desc: 'Adaptive questions' },
    { icon: FaUsers, title: 'Multiplayer', desc: 'Compete live' },
  ];

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <GameSectionHeader
          title="Features"
          subtitle="Everything you need to exceed"
        />
        <GameGrid columns={3} gap={6} className="mt-12">
          {features.map((f, idx) => (
            <GameFeatureBox key={idx} icon={f.icon} title={f.title}>
              {f.desc}
            </GameFeatureBox>
          ))}
        </GameGrid>
      </div>
    </section>
  );
};

// ============================================
// CTA SECTION BEFORE → AFTER
// ============================================

// BEFORE
const OldCTA = () => {
  return (
    <section className="bg-gray-900 text-white py-20">
      <h2 className="text-4xl font-bold mb-4">Ready to Level Up?</h2>
      <p className="mb-8">Join thousands of students</p>
      <button className="px-6 py-3 bg-yellow-400 text-black font-bold">
        Get Started
      </button>
    </section>
  );
};

// AFTER
const NewCTA = () => {
  return (
    <GameContainer className="bg-gray-900 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl font-black text-white mb-4">
          Ready to Level Up?
        </h2>
        <p className="text-gray-300 mb-8">
          Join thousands of students competing in real-time
        </p>
        <div className="flex gap-4 justify-center">
          <GameButton
            variant="primary"
            size="lg"
            onClick={() => navigate('/create')}
          >
            Create Sphere
          </GameButton>
          <GameButton
            variant="secondary"
            size="lg"
            onClick={() => navigate('/join')}
          >
            Join Sphere
          </GameButton>
        </div>
      </div>
    </GameContainer>
  );
};

// ============================================
// COMPLETE LANDING PAGE EXAMPLE
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GameButton,
  GameFeatureBox,
  GameSectionHeader,
  GameGrid,
  GameContainer,
} from '../components/GameUI';
import '../../styles/gameUI.css';
import {
  FaChartLine,
  FaBrain,
  FaUsers,
  FaLock,
  FaGamepad,
  FaRocket,
} from 'react-icons/fa';

export default function LandingPageRefactored() {
  const navigate = useNavigate();

  // ========== HEADER SECTION ==========
  const Header = () => (
    <nav className="sticky top-0 bg-white border-b-2 border-black z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-black">SPHERE TEST</h1>
        <div className="flex gap-4">
          <GameButton
            variant="secondary"
            size="sm"
            onClick={() => navigate('/login')}
          >
            Login
          </GameButton>
          <GameButton
            variant="primary"
            size="sm"
            onClick={() => navigate('/dashboard/create')}
          >
            Sign Up
          </GameButton>
        </div>
      </div>
    </nav>
  );

  // ========== HERO SECTION ==========
  const Hero = () => (
    <section className="bg-yellow-400 py-24">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-6xl font-black mb-6 leading-tight">
            Test Smarter.
            <br />
            Together.
          </h1>
          <p className="text-xl font-semibold mb-8 max-w-lg">
            Join public spheres with friends, answer questions together, and
            compete in real-time.
          </p>
          <div className="flex gap-4">
            <GameButton
              variant="primary"
              size="lg"
              icon={FaRocket}
              onClick={() => navigate('/create')}
            >
              Create Sphere
            </GameButton>
            <GameButton
              variant="secondary"
              size="lg"
              onClick={() => navigate('/join')}
            >
              Join Now
            </GameButton>
          </div>
        </motion.div>
      </div>
    </section>
  );

  // ========== HOW IT WORKS SECTION ==========
  const HowItWorks = () => {
    const steps = [
      'Create or join a sphere',
      'Answer questions together',
      'Track your progress',
      'Compete on leaderboards',
      'Earn badges & rewards',
    ];

    return (
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <GameSectionHeader
            title="How It Works"
            subtitle="5 simple steps to get started"
          />
          <GameGrid columns={5} gap={4} className="mt-12">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-center">
                  <div className="inline-block mb-4 w-12 h-12 bg-yellow-400 border-2 border-black rounded flex items-center justify-center font-black text-lg">
                    {idx + 1}
                  </div>
                  <p className="font-bold text-center">{step}</p>
                </div>
              </motion.div>
            ))}
          </GameGrid>
        </div>
      </section>
    );
  };

  // ========== FEATURES SECTION ==========
  const Features = () => {
    const features = [
      {
        icon: FaChartLine,
        title: 'Analytics',
        desc: 'Track your progress with detailed statistics',
      },
      {
        icon: FaBrain,
        title: 'Smart AI',
        desc: 'Questions adapt to your knowledge level',
      },
      {
        icon: FaUsers,
        title: 'Multiplayer',
        desc: 'Compete with friends in real-time',
      },
      {
        icon: FaLock,
        title: 'Secure',
        desc: 'Your data is encrypted and protected',
      },
      {
        icon: FaGamepad,
        title: 'Gamified',
        desc: 'Earn points, badges, and rewards',
      },
      {
        icon: FaRocket,
        title: 'Fast',
        desc: 'Lightning-quick performance',
      },
    ];

    return (
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <GameSectionHeader
            title="Features"
            subtitle="Everything you need to succeed"
          />
          <GameGrid columns={3} gap={6} className="mt-12">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <GameFeatureBox icon={feature.icon} title={feature.title}>
                  {feature.desc}
                </GameFeatureBox>
              </motion.div>
            ))}
          </GameGrid>
        </div>
      </section>
    );
  };

  // ========== CTA SECTION ==========
  const CTA = () => (
    <section className="bg-black text-white py-24">
      <div className="max-w-2xl mx-auto text-center px-4">
        <h2 className="text-5xl font-black mb-6">Ready to Level Up?</h2>
        <p className="text-xl mb-12 text-gray-300">
          Join thousands of students competing and learning together right now.
        </p>
        <div className="flex gap-4 justify-center">
          <GameButton
            variant="primary"
            size="lg"
            onClick={() => navigate('/create')}
          >
            Create Sphere
          </GameButton>
          <GameButton
            variant="secondary"
            size="lg"
            onClick={() => navigate('/join')}
          >
            Join Sphere
          </GameButton>
        </div>
      </div>
    </section>
  );

  // ========== FOOTER SECTION ==========
  const Footer = () => (
    <footer className="bg-gray-900 text-white py-12 border-t-2 border-black">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h5 className="font-black mb-4">PRODUCT</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Security
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-black mb-4">COMPANY</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-black mb-4">LEGAL</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-black mb-4">FOLLOW</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 Sphere Test. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );

  // ========== MAIN RENDER ==========
  return (
    <>
      <Header />
      <Hero />
      <HowItWorks />
      <Features />
      <CTA />
      <Footer />
    </>
  );
}

// ============================================
// HOW TO USE THIS IN YOUR APP
// ============================================

// 1. Copy this entire component to your landing/index.jsx
// 2. Ensure you have imported GameUI components above
// 3. Ensure gameUI.css is imported in your main App.jsx
// 4. The component is now fully gamified with consistent styling
// 5. All buttons, cards, and sections follow the 3D block design
// 6. Hover on any button/card to see the 3D effect
// 7. Click to see the press-down interaction

// ============================================
// WHAT CHANGED
// ============================================

// ✅ All buttons are now GameButton (consistent styling)
// ✅ All cards use GameFeatureBox (consistent styling)
// ✅ All section headings use GameSectionHeader
// ✅ All grids use GameGrid (responsive)
// ✅ Removed manual shadow/border styling
// ✅ Added consistent hover/click effects
// ✅ Added polka dots to primary buttons
// ✅ Colors are now from CSS variables (easy to customize)
// ✅ Transitions are smooth but snappy (0.1s)
// ✅ Everything feels like a game UI

// ============================================
// NEXT STEPS
// ============================================

// 1. Apply this to Dashboard pages (Dashboard.jsx, MySpheresPage.jsx, etc.)
// 2. Convert form components to use GameInput + GameButton
// 3. Convert sphere cards to use GameCard + GameBadge
// 4. Update any custom cards/containers to use GameContainer
// 5. Test all interactions on mobile and desktop
// 6. Adjust colors/spacing as needed in gameUI.css
