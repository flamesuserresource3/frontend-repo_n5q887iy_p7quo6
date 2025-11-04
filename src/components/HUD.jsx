import React from 'react';

export default function HUD({ score, timeLeft, level, onStart, onPause, running }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 items-center text-sm md:text-base">
      <div className="bg-white/80 backdrop-blur border border-white/60 rounded-xl p-3 flex items-center justify-center shadow">
        <span className="font-semibold text-gray-700">Score:</span>
        <span className="ml-2 text-green-700 font-extrabold">{score}</span>
      </div>
      <div className="bg-white/80 backdrop-blur border border-white/60 rounded-xl p-3 flex items-center justify-center shadow">
        <span className="font-semibold text-gray-700">Time:</span>
        <span className="ml-2 text-blue-700 font-extrabold">{minutes}:{seconds}</span>
      </div>
      <div className="bg-white/80 backdrop-blur border border-white/60 rounded-xl p-3 hidden md:flex items-center justify-center shadow">
        <span className="font-semibold text-gray-700">Level:</span>
        <span className="ml-2 text-red-700 font-extrabold">{level}</span>
      </div>
      <div className="flex gap-2 justify-end">
        {!running ? (
          <button onClick={onStart} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-xl shadow active:scale-95 transition">Start</button>
        ) : (
          <button onClick={onPause} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-xl shadow active:scale-95 transition">Pause</button>
        )}
      </div>
    </div>
  );
}
