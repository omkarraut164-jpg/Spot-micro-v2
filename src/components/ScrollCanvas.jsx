import React, { useRef, useEffect, useState, useCallback } from 'react';
import './ScrollCanvas.css';

const TOTAL_FRAMES = 240;
const FRAME_PATH = (n) => `/img/ezgif-frame-${String(n).padStart(3, '0')}.jpg`;

// Copy overlay definitions per scroll phase
const OVERLAYS = [
  // Phase 0: 0–15% — Hero assembled
  {
    start: 0,
    end: 0.15,
    id: 'overview',
    position: 'center',
    content: {
      eyebrow: 'MEET YOUR NEW BEST FRIEND',
      headline: 'SPOT MICRO',
      subheadline: 'The Tiny Puppy, With Giant Loyalty.',
      body: 'Introducing Spot Micro Robot Puppy. A palm-sized, open-source quadruped with lifelike bionic movement, empathic AI, and unconditional love. It doesn\'t just walk, it wags, pounces, and cuddles.',
      cta: null,
    },
  },
  // Phase 1: 15–40% — Bionics explode
  {
    start: 0.15,
    end: 0.42,
    id: 'bionics',
    position: 'left',
    content: {
      eyebrow: 'PUPPY-GRADE BIONIC FRAMEWORK',
      headline: 'Small Size. Real Puppy Moves.',
      body: 'Inspired by the Boston Dynamics Spot, but re-engineered to be a cute companion. Spot Micro uses 32 degrees of freedom and 128 micro-servo actuators to replicate real puppy behavior — from playful jumps and head-tilts to belly-up cuddles. All in a silent, compact body.',
      specs: [
        { label: 'DOF',         value: '32' },
        { label: 'ACTUATORS',   value: '128' },
        { label: 'SILENT WAGS', value: '<18 dB' },
        { label: 'PLAY SPEED',  value: '4.2 m/s' },
      ],
    },
  },
  // Phase 2: 42–65% — Neural AI
  {
    start: 0.42,
    end: 0.67,
    id: 'neural-ai',
    position: 'right',
    content: {
      eyebrow: 'TINY BRAIN, BIG HEART',
      headline: 'It Doesn\'t Just Obey. It Bonds With You.',
      bullets: [
        { icon: '◈', text: '360° LiDAR Vision — Maps your home and follows you like a real shadow.' },
        { icon: '◉', text: 'On-Board Puppy AI — Learns your voice, face, and mood. Knows when you\'re happy or sad.' },
        { icon: '◆', text: 'Open-Source Personality — Train it, code it, raise it. Its personality evolves based on how you treat it.' },
      ],
    },
  },
  // Phase 3: 67–85% — Power & Touch
  {
    start: 0.67,
    end: 0.87,
    id: 'power',
    position: 'left',
    content: {
      eyebrow: 'MICRO ENGINEERED',
      headline: 'Every detail, obsessively crafted for a puppy.',
      body: 'From all-day playtime to lightning-fast reflexes, every spec is built for companionship.',
      specs: [
        { label: 'BATTERY LIFE', value: '18 h' },
        { label: 'FAST CHARGING', value: '45 W' },
        { label: 'AI BRAIN',      value: '64 TOPS' },
        { label: 'REFLEX',        value: '0.3 ms' },
      ],
    },
  },
  // Phase 4: 87–100% — Reassembled / Final CTA
  {
    start: 0.87,
    end: 1.0,
    id: 'reserve',
    position: 'center',
    content: {
      eyebrow: 'Limited Early Adopter Units',
      headline: 'Ready to bring Spot Micro home?',
      subheadline: 'Join the first batch of makers and dog lovers. Limited units for early adopters.',
      ctaPrimary: 'Reserve My Spot Micro',
      ctaSecondary: 'Explore technical specifications',
    },
  },
];

const ScrollCanvas = () => {
  const canvasRef      = useRef(null);
  const imagesRef      = useRef([]);
  const frameRef       = useRef(0);
  const rafRef         = useRef(null);
  const scrollRef      = useRef(0);
  const targetFrameRef = useRef(0);
  const loadedRef      = useRef(0);

  const [progress,     setProgress]     = useState(0);
  const [activePhase,  setActivePhase]  = useState(0);
  const [phaseVisible, setPhaseVisible] = useState(false);
  const [loaded,       setLoaded]       = useState(false);
  const [loadPct,      setLoadPct]      = useState(0);

  // Refs for scroll handler to avoid stale closures
  const activePhaseRef  = useRef(0);
  const phaseVisibleRef = useRef(false);

  // ── Draw frame on canvas ───────────────────────────────
  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    const img    = imagesRef.current[frameIndex];
    if (!canvas || !img || !img.complete) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W   = canvas.width  / dpr;
    const H   = canvas.height / dpr;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Contain image with letterbox
    const imgAspect    = img.naturalWidth / img.naturalHeight;
    const canvasAspect = W / H;
    let dw, dh, dx, dy;

    if (imgAspect > canvasAspect) {
      dw = W;
      dh = W / imgAspect;
      dx = 0;
      dy = (H - dh) / 2;
    } else {
      dh = H;
      dw = H * imgAspect;
      dx = (W - dw) / 2;
      dy = 0;
    }

    ctx.drawImage(img, dx * dpr, dy * dpr, dw * dpr, dh * dpr);
  }, []);

  // ── Animation loop — lerp between frames ──────────────
  const animate = useCallback(() => {
    frameRef.current += (targetFrameRef.current - frameRef.current) * 0.12;
    const fi = Math.round(frameRef.current);
    drawFrame(fi);
    rafRef.current = requestAnimationFrame(animate);
  }, [drawFrame]);

  // ── Resize canvas ──────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    drawFrame(Math.round(frameRef.current));
  }, [drawFrame]);

  // ── Preload all frames ─────────────────────────────────
  useEffect(() => {
    let loadedCount = 0;
    let isReady = false;
    const images = [];
    const loadPromises = [];

    const isMobile = window.innerWidth < 768;
    const step = isMobile ? 2 : 1;
    const loadedThreshold = isMobile ? 25 : 50;

    for (let i = 1; i <= TOTAL_FRAMES; i += step) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      
      const promise = new Promise((resolve) => {
        const handleLoad = () => {
          loadedCount++;
          setLoadPct(Math.round((loadedCount / (TOTAL_FRAMES / step)) * 100));
          
          if (loadedCount >= loadedThreshold && !isReady) {
            isReady = true;
            setLoaded(true);
            if (images[0] && images[0].complete) {
              drawFrame(0);
            }
          }

          // If the first image finishes loading after we're ready, draw it explicitly
          if (i === 1 && isReady) {
            drawFrame(0);
          }
          
          resolve();
        };

        img.onload = handleLoad;
        img.onerror = handleLoad; // Count errors to prevent getting stuck
      });
      
      loadPromises.push(promise);
      images.push(img);
      if (isMobile && i < TOTAL_FRAMES) {
        images.push(img);
      }
    }
    
    Promise.allSettled(loadPromises).then(() => {
       if (!isReady) {
         isReady = true;
         setLoaded(true);
         if (images[0] && images[0].complete) {
           drawFrame(0);
         }
       }
    });

    imagesRef.current = images;
  }, [drawFrame]);

  // ── Scroll handler ─────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('.scroll-canvas-container');
      if (!scrollContainer) return;
      const scrollY   = window.scrollY;
      const maxScroll = scrollContainer.scrollHeight - window.innerHeight;
      const scrollFraction = Math.min(1, Math.max(0, scrollY / (maxScroll || 1)));
      const frameIndex = Math.floor(scrollFraction * (TOTAL_FRAMES - 1));
      
      scrollRef.current = scrollFraction;
      setProgress(scrollFraction);

      // Target frame
      targetFrameRef.current = frameIndex;

      // Determine active phase using refs (no stale closure)
      const phaseIdx = OVERLAYS.findIndex(
        (o) => scrollFraction >= o.start && scrollFraction <= o.end
      );

      if (phaseIdx !== -1 && phaseIdx !== activePhaseRef.current) {
        // Phase changed — cross-fade
        phaseVisibleRef.current = false;
        setPhaseVisible(false);
        setTimeout(() => {
          activePhaseRef.current  = phaseIdx;
          phaseVisibleRef.current = true;
          setActivePhase(phaseIdx);
          setPhaseVisible(true);
        }, 80);
      } else if (phaseIdx !== -1 && !phaseVisibleRef.current) {
        phaseVisibleRef.current = true;
        setPhaseVisible(true);
      } else if (phaseIdx === -1 && phaseVisibleRef.current) {
        phaseVisibleRef.current = false;
        setPhaseVisible(false);
      }
      
      // On scroll end, force draw last frame immediately
      if (scrollFraction === 1) {
        frameRef.current = TOTAL_FRAMES - 1;
        if (imagesRef.current[TOTAL_FRAMES - 1] && imagesRef.current[TOTAL_FRAMES - 1].complete) {
          drawFrame(TOTAL_FRAMES - 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, []); // no deps — reads from refs only

  // ── Start animation loop & resize ─────────────────────
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    if (loaded) {
      rafRef.current = requestAnimationFrame(animate);
    }
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loaded, animate, resizeCanvas]);

  // Trigger initial phase once loaded
  useEffect(() => {
    if (loaded) {
      activePhaseRef.current  = 0;
      phaseVisibleRef.current = true;
      setActivePhase(0);
      setPhaseVisible(true);
    }
  }, [loaded]);

  const phase = OVERLAYS[activePhase];

  return (
    <div className="scroll-canvas-container">
      {/* Anchor Links for Navbar */}
      {OVERLAYS.map((p) => (
        <div 
          key={p.id} 
          id={p.id} 
          style={{ 
            position: 'absolute', 
            top: `${p.start * 100}%`, 
            visibility: 'hidden',
            pointerEvents: 'none'
          }} 
        />
      ))}

      {/* Loading Screen */}
      {!loaded && (
        <div className="loader">
          <div className="loader__inner">
            <div className="loader__logo">
              <span className="loader__logo-k">S</span>
              <span className="loader__logo-9">M</span>
            </div>
            <p className="loader__name">SPOT MICRO</p>
            <div className="loader__bar-wrap">
              <div className="loader__bar" style={{ width: `${loadPct}%` }} />
            </div>
            <p className="loader__pct">{loadPct}%</p>
          </div>
        </div>
      )}

      {/* Sticky Canvas Wrapper */}
      <div className="sticky-canvas-wrap">
        {/* Ambient glow behind robot */}
        <div className="canvas-glow" />

        {/* The canvas */}
        <canvas ref={canvasRef} className="main-canvas" />

        {/* Overlay Copy */}
        {loaded && phase && (
          <div className={`overlay overlay--${phase.position} ${phaseVisible ? 'overlay--visible' : ''}`}>
            <OverlayContent phase={phase} />
          </div>
        )}

        {/* Bottom gradient fade */}
        <div className="canvas-bottom-fade" />
      </div>
    </div>
  );
};

// ── Overlay Content Renderer ───────────────────────────────
const OverlayContent = ({ phase }) => {
  const c = phase.content;

  if (phase.position === 'center' && c.ctaPrimary) {
    // Final CTA phase
    return (
      <div className="oc oc--center">
        <span className="oc__eyebrow">{c.eyebrow}</span>
        <h1 className="oc__headline t-display">{c.headline}</h1>
        <p className="oc__sub t-subtitle" style={{ color: 'var(--text-secondary)' }}>
          {c.subheadline}
        </p>
        <div className="oc__actions">
          <button className="btn-primary">
            <span>{c.ctaPrimary}</span>
          </button>
          <button className="btn-ghost">
            {c.ctaSecondary} <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>
    );
  }

  if (phase.position === 'center') {
    // Hero phase
    return (
      <div className="oc oc--center">
        <span className="oc__eyebrow">{c.eyebrow}</span>
        <h1 className="oc__headline t-hero gradient-text">{c.headline}</h1>
        <p className="oc__tagline t-display"
           style={{ color: 'var(--text-secondary)', fontWeight: 300, marginTop: 8 }}>
          {c.subheadline}
        </p>
        {c.body && (
          <p className="oc__body t-body" style={{ marginTop: 16, color: 'var(--text-tertiary)' }}>
            {c.body}
          </p>
        )}
        <div className="hero-scroll-hint">
          <div className="hero-scroll-hint__line" />
          <span className="hero-scroll-hint__text t-caption">Scroll to explore</span>
          <div className="hero-scroll-hint__line" />
        </div>
      </div>
    );
  }

  if (c.bullets) {
    // Neural AI phase (right)
    return (
      <div className="oc oc--side">
        <span className="oc__eyebrow">{c.eyebrow}</span>
        <h2 className="oc__headline t-title">{c.headline}</h2>
        <ul className="oc__bullets">
          {c.bullets.map((b, i) => (
            <li key={i} className="oc__bullet-item">
              <span className="oc__bullet-icon">{b.icon}</span>
              <span className="oc__bullet-text t-body">{b.text}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Bionics / Power phase (left)
  return (
    <div className="oc oc--side">
      <span className="oc__eyebrow">{c.eyebrow}</span>
      <h2 className="oc__headline t-title">{c.headline}</h2>
      {c.body && <p className="oc__body t-body">{c.body}</p>}
      {c.specs && (
        <div className="oc__specs">
          {c.specs.map((s, i) => (
            <div key={i} className="oc__spec-item">
              <span className="oc__spec-value">{s.value}</span>
              <span className="oc__spec-label t-caption">{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScrollCanvas;
