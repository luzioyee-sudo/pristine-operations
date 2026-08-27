// @ts-nocheck
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { VideoItem } from "@/lib/default-videos";

export function VideoCard({ video, onOpen }: { video: VideoItem; onOpen?: (id: string) => void }) {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const Wrapper: any = onOpen ? "button" : Link;
  const wrapperProps: any = onOpen
    ? { type: "button", onClick: () => onOpen(video.id) }
    : { to: "/watch", search: { v: video.id } };

  return (
    <Wrapper
      {...wrapperProps}
      className="shadow-soft group relative block w-full text-start overflow-hidden rounded-3xl border border-border/70 bg-card transform-gpu transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform hover:z-10 hover:scale-[1.02] hover:border-primary/30 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-secondary">
        <div
          aria-hidden
          className={`skeleton-shimmer absolute inset-0 bg-secondary transition-opacity duration-500 ${
            loaded ? "opacity-0" : "opacity-100"
          }`}
        />
        <img
          src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
          alt={video.title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            hovered ? "scale-105 opacity-0" : "scale-100 opacity-100 blur-0"
          } ${loaded ? "opacity-100" : "opacity-0"}`}
        />
        {hovered && (
          <div className="absolute inset-0 animate-pop-in overflow-hidden rounded-t-3xl">
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${video.id}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="pointer-events-none h-full w-full scale-105 object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-card/60 via-transparent to-transparent" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="font-display line-clamp-2 text-lg leading-snug text-foreground transition-colors duration-300 group-hover:text-primary-ink">
          {video.title}
        </h2>
        {video.channel && (
          <p className="eyebrow mt-2 text-muted-foreground transition-colors duration-300 group-hover:text-foreground/70">
            {video.channel}
          </p>
        )}
      </div>
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-primary/70 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />
    </Wrapper>
  );
}
