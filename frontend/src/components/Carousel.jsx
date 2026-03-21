import React, { useEffect, useMemo, useRef, useState } from "react";

export default function Carousel({ slides, interval = 5000, autoplay = true }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);
  const startRef = useRef({ x: 0, y: 0 });

  const count = slides?.length || 0;
  const active = useMemo(() => Math.min(Math.max(idx, 0), Math.max(0, count - 1)), [idx, count]);

  const go = (n) => {
    if (!count) return;
    if (n < 0) n = count - 1;
    if (n >= count) n = 0;
    setIdx(n);
  };

  const stopAuto = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const startAuto = () => {
    if (!autoplay || !count) return;
    stopAuto();
    timerRef.current = setInterval(() => go(active + 1), interval);
  };

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [autoplay, interval, count, active]);

  useEffect(() => {
    const vids = document.querySelectorAll(".carousel__slide video");
    vids.forEach((v, i) => {
      if (!v) return;
      if (i === active) v.play().catch(() => {});
      else v.pause();
    });
  }, [active]);

  return (
    <section
      className="carousel"
      id="heroCarousel"
      tabIndex={0}
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(active - 1);
        if (e.key === "ArrowRight") go(active + 1);
      }}
      onTouchStart={(e) => {
        const t = e.touches[0];
        startRef.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(e) => {
        const t = e.changedTouches[0];
        const dx = t.clientX - startRef.current.x;
        const dy = t.clientY - startRef.current.y;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
          dx < 0 ? go(active + 1) : go(active - 1);
        }
      }}
    >
      <div className="carousel__dots" role="tablist" aria-label="Carousel indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            className={i === active ? "is-active" : ""}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === active ? "true" : "false"}
            onClick={() => go(i)}
          />
        ))}
      </div>

      <div className="carousel__track">
        {slides.map((s, i) => (
          <article key={i} className={`carousel__slide ${i === active ? "is-active" : ""}`}>
            <div className="ratio ratio--21x9">
              <div className="overlay" />
              <video className="carousel__video" src={s.video} muted loop playsInline preload="metadata" autoPlay />
            </div>

            <div className="wrap">
              <div className={`carousel__caption ${s.align || "align-left"}`}>
                <h1>{s.title}</h1>
                <h6>{s.subtitle}</h6>
                <p className="muted">{s.desc}</p>
                <p>
                  <a className="btn btn--lg btn--primary" href={s.ctaHref}>
                    {s.ctaText}
                  </a>
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <button className="carousel__control prev" type="button" aria-label="Previous slide" onClick={() => go(active - 1)}>
        <span className="icon icon--left" aria-hidden="true" />
      </button>

      <button className="carousel__control next" type="button" aria-label="Next slide" onClick={() => go(active + 1)}>
        <span className="icon icon--right" aria-hidden="true" />
      </button>
    </section>
  );
}