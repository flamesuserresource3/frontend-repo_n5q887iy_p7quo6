import React, { useCallback, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import HUD from './components/HUD.jsx';
import GameCanvas from './components/GameCanvas.jsx';
import GameOverModal from './components/GameOverModal.jsx';
import Snowfall from './components/Snowfall.jsx';

export default function App() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [running, setRunning] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  const level = useMemo(() => 1 + Math.floor((60 - timeLeft) / 10), [timeLeft]);

  const start = () => {
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setRunning(true);
  };
  const pause = () => setRunning(false);
  const restart = () => start();

  const onScore = useCallback((delta) => setScore((s) => s + delta), []);
  const onTimeTick = useCallback(() => {
    setTimeLeft((t) => {
      if (t <= 1) {
        setRunning(false);
        setGameOver(true);
        return 0;
      }
      return t - 1;
    });
  }, []);

  const requestMusic = useCallback((startFn) => {
    // iOS needs user gesture; this function will be called after state changes
    try { startFn(); } catch (_) {}
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-300 to-sky-500 relative text-gray-900">
      <Snowfall />
      <Header musicOn={musicOn} onToggleMusic={() => setMusicOn((m) => !m)} />

      <main className="max-w-5xl mx-auto px-4">
        <div className="mt-4 bg-green-600/10 border border-green-600/30 rounded-2xl p-3 md:p-4 text-center">
          <p className="text-sm md:text-base text-green-900 font-medium">
            Help Santa catch the falling gifts in his sleigh! Drag with your finger or move your mouse.
          </p>
        </div>

        <HUD
          score={score}
          timeLeft={timeLeft}
          level={level}
          onStart={start}
          onPause={pause}
          running={running}
        />

        <GameCanvas
          running={running}
          onScore={onScore}
          onTimeTick={onTimeTick}
          onEnd={() => {}}
          requestMusic={requestMusic}
          musicOn={musicOn}
        />

        <section className="max-w-5xl mx-auto px-4 mt-6 mb-20 text-center text-white">
          <div className="inline-block bg-red-600/90 px-4 py-2 rounded-full shadow">Joyful • Family-friendly • Festive • Simple • Addictive</div>
        </section>
      </main>

      <footer className="py-6 text-center text-white bg-gradient-to-t from-green-700 to-green-600">
        <p>Made with love and holiday cheer 🎄✨</p>
      </footer>

      <GameOverModal open={gameOver} score={score} onRestart={restart} />
    </div>
  );
}
