import React from 'react';

export default function Header({ onToggleMusic, musicOn }) {
  return (
    <header className="w-full py-4 bg-gradient-to-b from-red-600 to-red-500 text-white shadow-lg relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎅</span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide drop-shadow">Santa Dash: Gift Catch!</h1>
        </div>
        <button
          onClick={onToggleMusic}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition transform active:scale-95 shadow ${
            musicOn ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-700 hover:bg-gray-800'
          }`}
          aria-label="Toggle music"
        >
          {musicOn ? 'Music: On' : 'Music: Off'}
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-2 flex gap-2 justify-center pb-1">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className={`h-2 w-2 rounded-full animate-pulse ${
              i % 4 === 0
                ? 'bg-yellow-300'
                : i % 4 === 1
                ? 'bg-green-300'
                : i % 4 === 2
                ? 'bg-red-300'
                : 'bg-blue-300'
            }`}
            style={{ animationDelay: `${(i % 5) * 200}ms` }}
          />
        ))}
      </div>
    </header>
  );
}
