// @ts-nocheck
import type { VideoItem } from "@/lib/default-videos";
import { VideoCard } from "@/components/video-card";

export function VideoGrid({
  eyebrow,
  title,
  description,
  videos,
  onOpenVideo,
}: {
  eyebrow: string;
  title: string;
  description: string;
  videos: VideoItem[];
  onOpenVideo?: (id: string) => void;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        <header className="mb-10">
          <p className="eyebrow animate-fade-up text-primary-ink">{eyebrow}</p>
          <h1
            className="font-display animate-blur-in mt-2 text-4xl leading-[1.05] sm:text-5xl"
            style={{ animationDelay: "60ms" }}
          >
            {title}
          </h1>
          <p
            className="animate-fade-up mt-3 max-w-md text-sm leading-relaxed text-muted-foreground"
            style={{ animationDelay: "140ms" }}
          >
            {description}
          </p>
        </header>
        <ul className="stagger-children grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v, i) => (
            <li key={v.id} style={{ "--i": Math.min(i, 14) } as React.CSSProperties}>
              <VideoCard video={v} onOpen={onOpenVideo} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
