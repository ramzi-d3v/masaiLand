"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Pause, Play } from "@phosphor-icons/react";

/*
  The lodge's own film, held behind a poster frame. The source file is 65MB, so
  it is never preloaded and never autoplays; it loads the moment someone asks
  for it. Same behaviour as the current site, which puts the video behind a
  click.
*/
export default function VideoCell({ src, poster, alt, title }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      setStarted(true);
      v.play();
    } else {
      v.pause();
    }
  }

  return (
    <div className="group relative h-full min-h-[320px] overflow-hidden rounded-surface bg-basalt">
      <video
        ref={ref}
        src={src}
        preload="none"
        playsInline
        controls={started}
        controlsList="nodownload"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setStarted(false);
        }}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          started ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Poster and label sit on top until the film starts. */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          started ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <Image
          src={`/img/${poster}.webp`}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        />
        <span className="absolute inset-0 bg-gradient-to-b from-basalt/55 via-transparent to-basalt/45" />
        <span className="absolute left-7 top-7 font-display text-2xl text-paper lg:text-3xl">
          {title}
        </span>
      </div>

      <button
        type="button"
        onClick={toggle}
        className={`absolute bottom-6 left-7 inline-flex items-center gap-3 rounded-full py-2 pl-2 pr-5 text-sm font-medium text-paper transition-all duration-300 ${
          started ? "pointer-events-none opacity-0" : "glass opacity-100"
        }`}
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-paper text-basalt">
          {playing ? (
            <Pause size={15} weight="fill" />
          ) : (
            <Play size={15} weight="fill" className="ml-0.5" />
          )}
        </span>
        Watch the film
      </button>
    </div>
  );
}
