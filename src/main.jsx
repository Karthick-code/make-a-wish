import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const PHASES = {
  IDLE: "idle",
  FOLDING: "folding",
  LAUNCH: "launch",
  DEEP_SPACE: "deep-space",
  RETURN: "return",
  MESSAGE: "message",
};

function createStars(count = 180) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.2 + 0.35,
    opacity: Math.random() * 0.75 + 0.2,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 2,
  }));
}

function Universe({ phase }) {
  const canvasRef = useRef(null);
  const starsRef = useRef(createStars(260));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let frame = 0;
    let animationId;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const cx = width / 2;
      const cy = height / 2;
      const t = frame * 0.004;

      ctx.clearRect(0, 0, width, height);

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * 0.75);
      bg.addColorStop(0, "rgba(86, 50, 33, 0.40)");
      bg.addColorStop(0.28, "rgba(20, 18, 35, 0.34)");
      bg.addColorStop(0.7, "rgba(4, 7, 18, 0.18)");
      bg.addColorStop(1, "rgba(1, 2, 8, 0)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const visible = phase !== PHASES.IDLE;

      if (visible) {
        starsRef.current.forEach((star) => {
          const twinkle = 0.65 + Math.sin(t * star.duration + star.delay) * 0.35;
          ctx.beginPath();
          ctx.arc(
            (star.x / 100) * width,
            (star.y / 100) * height,
            star.size,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(255, 242, 218, ${star.opacity * twinkle})`;
          ctx.fill();
        });

        const maxRadius = Math.min(width, height) * 0.43;

        for (let i = 0; i < 7; i++) {
          const radius = maxRadius * (0.14 + i * 0.13);
          const rotation = t * (0.12 + i * 0.025);
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(rotation * (i % 2 ? -1 : 1));
          ctx.scale(1, 0.37 + i * 0.018);
          ctx.beginPath();
          ctx.ellipse(0, 0, radius, radius, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(202, 157, 111, ${0.11 + (6 - i) * 0.018})`;
          ctx.lineWidth = i === 0 ? 1.5 : 1;
          ctx.stroke();
          ctx.restore();
        }

        for (let i = 0; i < 38; i++) {
          const angle = t * (0.08 + (i % 5) * 0.014) + i;
          const radius = maxRadius * (0.16 + ((i * 37) % 80) / 100);
          const px = cx + Math.cos(angle) * radius;
          const py = cy + Math.sin(angle) * radius * 0.42;
          const planetSize = 1.5 + (i % 5) * 1.4;

          const gradient = ctx.createRadialGradient(
            px - planetSize * 0.35,
            py - planetSize * 0.35,
            0,
            px,
            py,
            planetSize * 2
          );
          gradient.addColorStop(0, "rgba(255, 222, 176, .95)");
          gradient.addColorStop(0.55, "rgba(146, 91, 67, .72)");
          gradient.addColorStop(1, "rgba(38, 26, 39, .2)");

          ctx.beginPath();
          ctx.arc(px, py, planetSize, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius * 0.42);
        glow.addColorStop(0, "rgba(255, 224, 170, .92)");
        glow.addColorStop(0.08, "rgba(247, 171, 98, .62)");
        glow.addColorStop(0.32, "rgba(149, 81, 55, .18)");
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(cx - maxRadius, cy - maxRadius, maxRadius * 2, maxRadius * 2);

        for (let i = 0; i < 4; i++) {
          const angle = t * (0.15 + i * 0.03);
          const radius = maxRadius * (0.05 + i * 0.035);
          ctx.beginPath();
          ctx.arc(
            cx + Math.cos(angle) * radius,
            cy + Math.sin(angle) * radius * 0.55,
            2 + i,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = "rgba(255, 241, 210, .9)";
          ctx.fill();
        }
      }

      frame += 1;
      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [phase]);

  return <canvas ref={canvasRef} className={`universe-canvas phase-${phase}`} aria-hidden="true" />;
}

function PaperPlane({ phase }) {
  return (
    <div className={`plane-wrap plane-${phase}`} aria-hidden="true">
      <div className="plane-trail" />
      <svg className="paper-plane" viewBox="0 0 300 180">
        <defs>
          <linearGradient id="paperTop" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff9ec" />
            <stop offset="60%" stopColor="#ead7b7" />
            <stop offset="100%" stopColor="#cba982" />
          </linearGradient>
          <linearGradient id="paperBottom" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f1e3ca" />
            <stop offset="100%" stopColor="#b98f67" />
          </linearGradient>
        </defs>
        <path d="M17 89 L280 16 L183 164 L149 103 Z" fill="url(#paperTop)" />
        <path d="M17 89 L149 103 L183 164 L120 112 Z" fill="url(#paperBottom)" />
        <path d="M17 89 L149 103 L280 16 L149 122 Z" fill="#fffaf0" opacity=".54" />
        <path d="M149 103 L280 16 L183 164" fill="none" stroke="rgba(93,62,42,.28)" strokeWidth="2" />
        <path d="M149 103 L120 112 L183 164" fill="none" stroke="rgba(93,62,42,.25)" strokeWidth="2" />
      </svg>
    </div>
  );
}

function App() {
  const [phase, setPhase] = useState(PHASES.IDLE);
  const [wish, setWish] = useState("");
  const [submittedWish, setSubmittedWish] = useState("");

  const submitWish = () => {
    const value = wish.trim();
    if (!value || phase !== PHASES.IDLE) return;

    setSubmittedWish(value);
    setPhase(PHASES.FOLDING);

    window.setTimeout(() => setPhase(PHASES.LAUNCH), 950);
    window.setTimeout(() => setPhase(PHASES.DEEP_SPACE), 1900);
    window.setTimeout(() => setPhase(PHASES.RETURN), 3900);
    window.setTimeout(() => setPhase(PHASES.MESSAGE), 5050);
  };

  const reset = () => {
    setPhase(PHASES.IDLE);
    setWish("");
    setSubmittedWish("");
  };

  const isJourney = phase !== PHASES.IDLE;
  const showMessage = phase === PHASES.MESSAGE;

  return (
    <main className={`app phase-${phase}`}>
      <Universe phase={phase} />

      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <header className={`topbar ${isJourney ? "topbar-hidden" : ""}`}>
        <div className="brand">MAKE A WISH</div>
        <div className="top-links">
          <span>Wishes</span>
          <span>About</span>
        </div>
      </header>

      <section className={`landing ${isJourney ? "landing-journey" : ""}`}>
        <div className="intro">
          <div className="spark">✦</div>
          <h1>Make a Wish</h1>
          <p>Somewhere between imagination and possibility.</p>
        </div>

        <div className="wish-form">
          <input
            value={wish}
            onChange={(event) => setWish(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submitWish();
            }}
            disabled={isJourney}
            placeholder="What do you wish for?"
            maxLength={180}
            aria-label="Your wish"
          />
          <button
            type="button"
            className="send-button"
            onClick={submitWish}
            disabled={!wish.trim() || isJourney}
            aria-label="Send wish to the universe"
          >
            <span>➤</span>
          </button>
        </div>

        <div className="hint">
          <span>Write it down. Send it away.</span>
        </div>

        <div className="sand-orbit orbit-one" />
        <div className="sand-orbit orbit-two" />
      </section>

      <section className={`journey-copy ${isJourney ? "visible" : ""}`}>
        {phase === PHASES.FOLDING && <span>Fold your wish...</span>}
        {phase === PHASES.LAUNCH && <span>Your wish is leaving you...</span>}
        {phase === PHASES.DEEP_SPACE && <span>Sending it to the universe...</span>}
        {phase === PHASES.RETURN && <span>Something is returning...</span>}
      </section>

      <PaperPlane phase={phase} />

      {showMessage && (
        <div className="message-scene">
          <div className="note-shadow" />
          <article className="message-note">
            <div className="note-star">✦</div>
            <p className="note-small">A message from the universe</p>
            <h2>Message sent<br />to the universe.</h2>
            <p className="note-main">
              Hope the universe makes<br />your wish come true.
            </p>
            <div className="note-line" />
            <p className="note-wish">“{submittedWish}”</p>
            <button type="button" onClick={reset}>
              Make another wish <span>↗</span>
            </button>
          </article>
        </div>
      )}

      <footer className={`footer ${isJourney ? "footer-hidden" : ""}`}>
        <span>© {new Date().getFullYear()} Make a Wish</span>
        <span>Send something into the unknown.</span>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
