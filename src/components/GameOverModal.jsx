import React from 'react';

export default function GameOverModal({ open, score, onRestart }) {
  if (!open) return null;

  const canShare = typeof navigator !== 'undefined' && !!navigator.share;
  const share = async () => {
    const text = `I scored ${score} points in Santa Dash! 🎄🎁 Can you beat me?`;
    const url = window.location.href;
    if (canShare) {
      try {
        await navigator.share({ title: 'Merry Christmas! ❄️', text, url });
      } catch (e) {
        // ignore
      }
    } else {
      const twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      window.open(twitter, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 text-center border-4 border-red-500">
        <h2 className="text-3xl font-extrabold text-red-600">Merry Christmas!</h2>
        <p className="mt-2 text-gray-700">Your final score</p>
        <div className="text-5xl font-black text-green-600 mt-1">{score}</div>
        <div className="flex gap-3 mt-6">
          <button onClick={onRestart} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-xl shadow active:scale-95 transition">Play Again</button>
          <button onClick={share} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-xl shadow active:scale-95 transition">Share</button>
        </div>
        <p className="mt-4 text-sm text-gray-500">🎅 Ho ho ho! Thanks for playing.</p>
      </div>
    </div>
  );
}
