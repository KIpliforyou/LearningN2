"use client";

import { useEffect, useRef, useState } from "react";

type VideoSource = {
  video_id: string;
  mulai: number | null;
  selesai: number | null;
};

type PatternVideoProps = {
  source: VideoSource;
  title: string;
};

const RATES = [0.5, 0.75, 1];

export default function PatternVideo({ source, title }: PatternVideoProps) {
  const [loaded, setLoaded] = useState(false);
  const [rate, setRate] = useState(1);
  const frameRef = useRef<HTMLIFrameElement>(null);

  const start = source.mulai;
  const end = source.selesai;
  const watchUrl = `https://youtu.be/${source.video_id}${start === null ? "" : `?t=${start}s`}`;

  function sendPlayerCommand(func: string, args: unknown[] = []) {
    frameRef.current?.contentWindow?.postMessage(JSON.stringify({
      event: "command",
      func,
      args,
    }), "https://www.youtube-nocookie.com");
  }

  function loadPlayer() {
    if (start === null) return;
    setLoaded(true);
  }

  useEffect(() => {
    if (!loaded || start === null) return;
    const seekTimer = window.setTimeout(() => {
      sendPlayerCommand("seekTo", [start, true]);
      sendPlayerCommand("playVideo");
      sendPlayerCommand("setPlaybackRate", [rate]);
    }, 500);
    const stopTimer = end === null ? undefined : window.setInterval(() => {
      sendPlayerCommand("getCurrentTime");
    }, 500);
    return () => {
      window.clearTimeout(seekTimer);
      if (stopTimer !== undefined) window.clearInterval(stopTimer);
    };
  }, [end, loaded, rate, start]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== "https://www.youtube-nocookie.com" || end === null) return;
      try {
        const payload = JSON.parse(String(event.data));
        const current = Number(payload?.info);
        if (payload?.event === "infoDelivery" && Number.isFinite(current) && current >= end) {
          sendPlayerCommand("pauseVideo");
          sendPlayerCommand("seekTo", [start ?? 0, true]);
        }
      } catch {
        // Ignore unrelated iframe messages.
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [end, start]);

  return (
    <section className="pattern-video" aria-label={`Video penjelasan ${title}`}>
      <div className="pattern-video-header">
        <strong>Video penjelasan</strong>
        {start === null && <span className="tag">Video belum tersedia</span>}
        {start !== null && <span className="muted">Mulai {formatTime(start)}{end === null ? "" : ` · selesai ${formatTime(end)}`}</span>}
      </div>
      {start === null ? (
        <a className="btn" href={watchUrl} target="_blank" rel="noreferrer">Tonton di YouTube</a>
      ) : loaded ? (
        <>
          <div className="pattern-video-frame">
            <iframe
              ref={frameRef}
              title={`Video ${title}`}
              src={`https://www.youtube-nocookie.com/embed/${source.video_id}?enablejsapi=1&start=${start}&origin=${encodeURIComponent(window.location.origin)}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="actions">
            {RATES.map((value) => <button key={value} className={`btn ${rate === value ? "primary" : ""}`} onClick={() => { setRate(value); sendPlayerCommand("setPlaybackRate", [value]); }}>{value}x</button>)}
            <button className="btn" onClick={() => { sendPlayerCommand("seekTo", [start, true]); sendPlayerCommand("playVideo"); }}>Ulangi potongan</button>
            <a className="btn" href={watchUrl} target="_blank" rel="noreferrer">Buka YouTube</a>
          </div>
        </>
      ) : (
        <button className="pattern-video-thumbnail" onClick={loadPlayer} type="button">
          {/* eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnail is loaded only after the user opens this card. */}
          <img src={`https://i.ytimg.com/vi/${source.video_id}/hqdefault.jpg`} alt="" loading="lazy" />
          <span>Putar potongan</span>
        </button>
      )}
    </section>
  );
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}
