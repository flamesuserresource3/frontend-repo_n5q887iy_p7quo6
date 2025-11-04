import React, { useEffect, useRef } from 'react';

// Simple WebAudio bell sound
function playBell() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioCtx();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(880, ctx.currentTime);
  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
  o.connect(g);
  g.connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + 0.45);
}

// Fun "Ho ho ho" using speech synthesis
function hoHoHo() {
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance('Ho ho ho!');
    u.pitch = 0.7;
    u.rate = 0.9;
    u.volume = 0.8;
    window.speechSynthesis.speak(u);
  }
}

// Light background music with WebAudio
let bgCtx;
let bgNodes = [];
function startMusic() {
  if (bgCtx) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  bgCtx = new AudioCtx();
  const tempo = 110; // bpm
  const quarter = 60 / tempo;
  const melody = [
    659, 659, 659, 523, 659, 783, 392,
    523, 392, 329, 440, 494, 466, 440,
  ];
  const now = bgCtx.currentTime + 0.1;
  for (let i = 0; i < 64; i++) {
    const t = now + i * quarter * 0.5;
    const f = melody[i % melody.length];
    const o = bgCtx.createOscillator();
    const g = bgCtx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    o.connect(g);
    g.connect(bgCtx.destination);
    o.start(t);
    o.stop(t + 0.45);
    bgNodes.push(o, g);
  }
}
function stopMusic() {
  if (bgNodes.length) {
    bgNodes.forEach((n) => {
      try { n.disconnect(); } catch(_) {}
    });
    bgNodes = [];
  }
  if (bgCtx) {
    try { bgCtx.close(); } catch(_) {}
    bgCtx = undefined;
  }
}

export default function GameCanvas({ running, onScore, onTimeTick, onEnd, requestMusic, musicOn }) {
  const canvasRef = useRef(null);
  const animRef = useRef(0);
  const sleighRef = useRef({ x: 150, y: 0, w: 90, h: 28 });
  const giftsRef = useRef([]);
  const lastSpawnRef = useRef(0);
  const speedRef = useRef(120); // px/s base
  const startRef = useRef(0);
  const elapsedRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.offsetWidth * dpr);
      canvas.height = Math.floor(canvas.offsetHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sleighRef.current.y = canvas.offsetHeight - 60;
    }

    function spawnGift() {
      const colors = ['#ef4444', '#22c55e', '#eab308'];
      const size = 24 + Math.random() * 10;
      const x = 10 + Math.random() * (canvas.offsetWidth - size - 10);
      const color = colors[Math.floor(Math.random() * colors.length)];
      giftsRef.current.push({ x, y: -size, size, color, vx: (Math.random() - 0.5) * 40 });
    }

    function drawSleigh() {
      const s = sleighRef.current;
      // body
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(s.x, s.y, s.w, s.h);
      // runners
      ctx.strokeStyle = '#a16207';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(s.x + 10, s.y + s.h);
      ctx.quadraticCurveTo(s.x + s.w * 0.3, s.y + s.h + 16, s.x + s.w - 8, s.y + s.h);
      ctx.stroke();
      // trim
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(s.x + 6, s.y + 6, s.w - 12, 6);
    }

    function drawGift(g) {
      ctx.fillStyle = g.color;
      ctx.fillRect(g.x, g.y, g.size, g.size);
      // ribbon
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(g.x + g.size * 0.45, g.y, g.size * 0.1, g.size);
      ctx.fillRect(g.x, g.y + g.size * 0.45, g.size, g.size * 0.1);
    }

    function clear() {
      const grd = ctx.createLinearGradient(0, 0, 0, canvas.offsetHeight);
      grd.addColorStop(0, '#0ea5e9');
      grd.addColorStop(1, '#0b3b66');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      // snow ground
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, canvas.offsetHeight - 30, canvas.offsetWidth, 30);
    }

    let last = 0;
    function tick(t) {
      if (!running) {
        animRef.current = requestAnimationFrame(tick);
        return;
      }
      if (!startRef.current) startRef.current = t;
      const dt = (t - last) / 1000 || 0;
      last = t;
      elapsedRef.current += dt;
      clear();

      // increase difficulty gradually
      const difficulty = 1 + Math.min(2.5, Math.floor(elapsedRef.current / 10) * 0.25 + elapsedRef.current * 0.02);
      const fall = speedRef.current * difficulty;
      const spawnEvery = Math.max(250, 800 - elapsedRef.current * 20);

      // spawn gifts
      if (t - lastSpawnRef.current > spawnEvery) {
        spawnGift();
        lastSpawnRef.current = t;
      }

      // update and draw gifts
      for (let i = giftsRef.current.length - 1; i >= 0; i--) {
        const g = giftsRef.current[i];
        g.y += fall * dt;
        g.x += g.vx * dt;
        if (g.x < 0) g.x = 0;
        if (g.x + g.size > canvas.offsetWidth) g.x = canvas.offsetWidth - g.size;
        drawGift(g);
        const s = sleighRef.current;
        const caught =
          g.x < s.x + s.w &&
          g.x + g.size > s.x &&
          g.y < s.y + s.h &&
          g.y + g.size > s.y;
        if (caught) {
          giftsRef.current.splice(i, 1);
          onScore(1);
          playBell();
        } else if (g.y > canvas.offsetHeight + 10) {
          giftsRef.current.splice(i, 1);
        }
      }

      // draw sleigh
      drawSleigh();

      animRef.current = requestAnimationFrame(tick);
    }

    function onMove(clientX) {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const s = sleighRef.current;
      s.x = Math.min(rect.width - s.w - 6, Math.max(6, x - s.w / 2));
    }

    const onMouse = (e) => onMove(e.clientX);
    const onTouch = (e) => {
      if (e.touches && e.touches[0]) onMove(e.touches[0].clientX);
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMouse);
    canvas.addEventListener('touchmove', onTouch, { passive: true });

    animRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('touchmove', onTouch);
    };
  }, [running, onScore]);

  // Timer + hohoho events
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      onTimeTick();
    }, 1000);
    const laugh = setInterval(() => {
      hoHoHo();
    }, 8000);
    return () => {
      clearInterval(interval);
      clearInterval(laugh);
    };
  }, [running, onTimeTick]);

  // Music control from parent
  useEffect(() => {
    if (musicOn) {
      requestMusic(() => startMusic());
    } else {
      stopMusic();
    }
    return () => {};
  }, [musicOn, requestMusic]);

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-4 rounded-2xl overflow-hidden border-4 border-green-600 shadow-xl bg-blue-500">
      <canvas ref={canvasRef} className="w-full h-[58vh] md:h-[60vh]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-blue-900/10 via-transparent to-white/0" />
      <div className="absolute top-2 left-2 text-xs bg-white/80 px-2 py-1 rounded-full text-gray-700">Move: mouse or touch</div>
    </div>
  );
}
