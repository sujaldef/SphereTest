import React from 'react';

export default function DemoPreview() {
  return (
    <section className="py-24 container mx-auto px-6 text-center">
      <h2 className="text-4xl font-bold mb-12">See It in Action</h2>

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-200 max-w-5xl mx-auto">
        <div className="bg-gray-50 h-96 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <p className="text-gray-400">[Platform Screenshot / Demo Video]</p>
        </div>

        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          <span className="bg-black text-white text-sm font-medium px-4 py-2 rounded-full">Admin Dashboard</span>
          <span className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-full">Live Leaderboard</span>
          <span className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-full">Coding Environment</span>
        </div>
      </div>
    </section>
  );
}