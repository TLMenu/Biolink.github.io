"use client";

import { useEffect, useRef, useState } from "react";

export default function AudioPlayer({
  src,
  autoplay,
}: {
  src: string;
  autoplay: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (autoplay && audioRef.current) {
      audioRef.current.play().then(
        () => setPlaying(true),
        () => setPlaying(false) // browser blocked autoplay
      );
    }
  }, [autoplay]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-20">
      <audio ref={audioRef} src={src} loop />
      <button
        onClick={toggle}
        className="w-11 h-11 rounded-full bg-black/50 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition"
        aria-label={playing ? "Musik pausieren" : "Musik abspielen"}
      >
        {playing ? "⏸" : "▶"}
      </button>
    </div>
  );
}
