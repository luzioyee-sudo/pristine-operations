// @ts-nocheck
import { useState } from 'react';

import { LanguageProvider } from '@/lib/language';
import { ExplorePage } from '@/components/explore-page';
import { WatchPage } from '@/components/watch-page';
import { LessonsPage } from '@/components/lessons-page';
import { PlayerSettingsPage } from '@/components/player-settings-page';
import { VideoGrid } from '@/components/video-grid';
import { BottomTabs, type PlayerTab } from '@/components/bottom-tabs';
import { recommendedVideos } from '@/lib/default-videos';
import { useTranslation } from 'react-i18next';

/**
 * Video player page inside the Ribble app. Keeps its own tab state (lessons /
 * explore / recommends / settings) plus the watch view, so it behaves like the
 * other sidebar pages (no route change, no full reload).
 */
export const VideoPlayerView: React.FC = () => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [tab, setTab] = useState<PlayerTab>('lessons');

  return (
    <LanguageProvider>
      <div className="watch-theme">
        {videoId ? (
          <WatchPage videoId={videoId} onBack={() => setVideoId(null)} />
        ) : (
          <div className="relative flex min-h-full flex-col">
            <div className="flex-1 pb-24">
              <PlayerTabPanel tab={tab} onOpenVideo={setVideoId} onChangeTab={setTab} />
            </div>
            <BottomTabs active={tab} onChange={setTab} />
          </div>
        )}
      </div>
    </LanguageProvider>
  );
};

function PlayerTabPanel({
  tab,
  onOpenVideo,
  onChangeTab,
}: {
  tab: PlayerTab;
  onOpenVideo: (id: string) => void;
  onChangeTab: (tab: PlayerTab) => void;
}) {
  const { t } = useTranslation();

  if (tab === 'explore') return <ExplorePage onOpenVideo={onOpenVideo} />;
  if (tab === 'recommends') {
    return (
      <VideoGrid
        eyebrow={t('recommends.eyebrow')}
        title={t('recommends.title')}
        description={t('recommends.subtitle')}
        videos={recommendedVideos}
        onOpenVideo={onOpenVideo}
      />
    );
  }
  if (tab === 'settings') return <PlayerSettingsPage />;
  return <LessonsPage onOpenVideo={onOpenVideo} onGoExplore={() => onChangeTab('explore')} />;
}
