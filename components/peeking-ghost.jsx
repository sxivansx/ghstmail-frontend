"use client";

import { useEffect, useRef } from "react";

// The mascot looking over the top edge of a card. Put it inside a relatively
// positioned wrapper, before the card. Its eyes follow the pointer, and now and
// then it blinks or squeezes them shut.
export function PeekingGhost() {
  const ghost = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const svg = ghost.current;
    const eyes = svg.querySelector("g");
    let frame = 0;
    let timer = 0;

    function follow(event) {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const box = svg.getBoundingClientRect();
        const dx = event.clientX - (box.left + box.width / 2);
        const dy = event.clientY - (box.top + box.height * 0.4);
        const distance = Math.hypot(dx, dy) || 1;
        const reach = Math.min(1, distance / 260) * 1.1;
        eyes.style.transform = `translate(${(dx / distance) * reach}px, ${(dy / distance) * reach}px)`;
      });
    }

    function idle() {
      timer = setTimeout(() => {
        const look = Math.random() < 0.3 ? "squint" : "blink";
        svg.dataset.look = look;
        timer = setTimeout(() => {
          delete svg.dataset.look;
          idle();
        }, look === "squint" ? 900 : 130);
      }, 1800 + Math.random() * 2600);
    }

    window.addEventListener("pointermove", follow);
    idle();
    return () => {
      window.removeEventListener("pointermove", follow);
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute right-6 bottom-full h-[46px] w-[72px] overflow-hidden">
      <svg ref={ghost} className="peeking-ghost block w-[72px] h-[72px] text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C7.58 2 4 5.58 4 10v9a1 1 0 001.7.7L7.4 18l1.7 1.7a1 1 0 001.4 0L12 18.2l1.5 1.5a1 1 0 001.4 0L16.6 18l1.7 1.7A1 1 0 0020 19v-9c0-4.42-3.58-8-8-8z" fill="hsl(var(--background))" />
        <g>
          <circle className="eye" cx="9" cy="9.2" r="1.5" fill="currentColor" stroke="none" />
          <circle className="eye" cx="15" cy="9.2" r="1.5" fill="currentColor" stroke="none" />
          <path className="squeeze" d="M7.8 7.9l2.3 1.3-2.3 1.3" />
          <path className="squeeze" d="M16.2 7.9l-2.3 1.3 2.3 1.3" />
        </g>
      </svg>
    </div>
  );
}
