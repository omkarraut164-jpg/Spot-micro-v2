import React, { useEffect, useRef } from 'react';
import './SpecsSection.css';

const modules = import.meta.glob('../assets/imgSec2/*.{jpg,png,webp,jpeg}', { eager: true });
const imagePaths = Object.keys(modules).sort().map((key) => modules[key].default);

const specs = [
  {
    category: 'Locomotion',
    icon: '⟨⟩',
    items: [
      { label: 'Degrees of Freedom',     value: '32 DoF'       },
      { label: 'Micro-Actuators',        value: '128 units'    },
      { label: 'Max Speed',              value: '4.2 m/s'      },
      { label: 'Acoustic Signature',     value: '< 18 dB'      },
      { label: 'Payload Capacity',       value: '2.4 kg'       },
      { label: 'Jump Height',            value: '0.9 m'        },
    ],
  },
  {
    category: 'Neural AI',
    icon: '◈',
    items: [
      { label: 'Neural Processor',       value: 'K9-NPU α7'   },
      { label: 'TOPS Performance',       value: '38 TOPS'      },
      { label: 'LiDAR Resolution',       value: '0.1 mm'       },
      { label: 'Camera Array',           value: '4× 4K SLAM'   },
      { label: 'Voice Recognition',      value: '< 120 ms'     },
      { label: 'Emotion Detection',      value: '97.3% acc.'   },
    ],
  },
  {
    category: 'Power',
    icon: '⚡',
    items: [
      { label: 'Battery Technology',     value: 'Solid-State'  },
      { label: 'Continuous Runtime',     value: '18 hours'     },
      { label: 'Fast Charge',            value: '45 W'         },
      { label: 'Wireless Charging',      value: 'Qi2 Pro'      },
      { label: 'Standby Duration',       value: '72 hours'     },
      { label: 'Power Reserve Mode',     value: '4 hours'      },
    ],
  },
  {
    category: 'Materials',
    icon: '◆',
    items: [
      { label: 'Outer Shell',            value: 'Ceramic Composite' },
      { label: 'Skeleton',               value: 'Grade-5 Titanium'  },
      { label: 'Touch Sensors',          value: '64-point Array'    },
      { label: 'Haptic Response',        value: '0.3 ms latency'    },
      { label: 'Weight',                 value: '4.8 kg'            },
      { label: 'IP Rating',              value: 'IP68'              },
    ],
  },
];

const SpecsSection = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const targetFrameRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    let loadedCount = 0;
    const images = [];
    const isMobile = window.innerWidth < 768;
    const step = isMobile ? 2 : 1;

    for (let i = 0; i < imagePaths.length; i += step) {
      const img = new Image();
      img.src = imagePaths[i];
      img.onload = () => {
        loadedCount++;
      };
      images.push(img);
      if (isMobile && i + 1 < imagePaths.length) {
        images.push(img);
      }
    }

    imagesRef.current = images;

    let animationFrameId;

    const animate = () => {
      if (loadedCount > 0 && imagesRef.current.length > 0) {
        // Lerp for buttery smoothness matching the main scroll
        frameRef.current += (targetFrameRef.current - frameRef.current) * 0.1;
        const currentIdx = Math.round(frameRef.current);
        const img = imagesRef.current[currentIdx];
        const canvas = canvasRef.current;
        
        if (canvas && img && img.complete) {
          const ctx = canvas.getContext('2d');
          if (canvas.width !== img.width || canvas.height !== img.height) {
            canvas.width = img.width;
            canvas.height = img.height;
          }
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
          const x = (canvas.width / 2) - (img.width / 2) * scale;
          const y = (canvas.height / 2) - (img.height / 2) * scale;
          
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.min(Math.max((-rect.top) / (rect.height - window.innerHeight), 0), 1);
      const frameIndex = Math.floor(progress * (imagesRef.current.length - 1));
      targetFrameRef.current = frameIndex;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="specs-section" id="specs">
      <div className="specs-scroll-container" ref={sectionRef}>
        <div className="specs-sticky-wrapper">
          <div className="container specs-sticky-inner">
            <div className="specs-header-left">
              <canvas id="specs-canvas" ref={canvasRef} className="specs-canvas"></canvas>
            </div>
            <div className="specs-header-right">
              <span className="t-caption" style={{ color: 'var(--accent-cyan)' }}>
                MICRO ENGINEERED
              </span>
              <h2 className="t-display" style={{ marginTop: 16, letterSpacing: '-0.025em' }}>
                Every detail,<br />obsessively crafted for a puppy.
              </h2>
              <p className="t-body specs-section__subtitle">
                From all-day playtime to lightning-fast reflexes, every spec is built for companionship.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="specs-grid">
          {specs.map((cat, i) => (
            <div key={i} className="specs-card">
              <div className="specs-card__header">
                <span className="specs-card__icon">{cat.icon}</span>
                <h3 className="specs-card__title">{cat.category}</h3>
              </div>
              <ul className="specs-card__list">
                {cat.items.map((item, j) => (
                  <li key={j} className="specs-card__row">
                    <span className="specs-card__label">{item.label}</span>
                    <span className="specs-card__value">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal note */}
        <p className="specs-legal">
          Specifications subject to change. Final production hardware may vary.
          Spot Micro Robot Puppy is an open-source quadruped companion built for makers and dog lovers.
        </p>
      </div>
    </section>
  );
};

export default SpecsSection;
