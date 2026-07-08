'use client';
import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import InstagramReelUI from './InstagramReelUI';
import { cn } from '@/lib/utils';
import { CATALOGUE, type Reel } from '@/lib/pitchContent';

// A reel is shown on a phone screen, so the frame uses the source screenshot's
// phone aspect (736×1624 ≈ 9:19.9), not the 9:16 of the raw video — this is what
// gives the Instagram chrome (status bar → tall content → caption + nav) its
// correct proportions. Featured reel + thumbnails share it so heights stay consistent.
const REEL_AR = 736 / 1624;

// The big featured reel (9:16), dressed as a live Instagram reel (InstagramReelUI
// overlays the chrome). Autoplays its clip while it's the active slide; pauses
// otherwise. Until a real /assets/reels/*.mp4 lands it's just the gradient. The
// Card is a container so the overlay's cqw units scale with the reel.
function FeaturedReel({ reel, index, active }: { reel: Reel; index: number; active: boolean }) {
  const vid = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  // Play only while this reel is the active slide AND not paused.
  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    if (active && !paused) v.play().catch(() => {}); else v.pause();
  }, [active, paused]);

  // Swiping to a reel restarts it playing (Instagram behaviour).
  useEffect(() => {
    if (!active) return;
    setPaused(false);
    const v = vid.current;
    if (v) v.currentTime = 0;
  }, [active]);

  return (
    <Card
      className="relative h-full w-full overflow-hidden rounded-[20px] border-0 bg-transparent p-0 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)] ring-0"
      style={{ containerType: 'inline-size' }}
    >
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(160deg, ${reel.gradient[0]}, ${reel.gradient[1]} 55%, ${reel.gradient[2]})` }}
      />
      {reel.videoSrc && (
        <video
          ref={vid}
          muted
          loop
          playsInline
          preload="none"
          src={reel.videoSrc}
          className={cn('absolute inset-0 h-full w-full object-cover transition-opacity duration-500', active ? 'opacity-100' : 'opacity-0')}
        />
      )}
      <InstagramReelUI reel={reel} index={index} />
      {/* Tap anywhere to pause/play; the play glyph shows only while paused. Sits
          above the chrome (z-30) so a tap toggles playback like a real reel. */}
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? 'Play reel' : 'Pause reel'}
        className="absolute inset-0 z-30 flex items-center justify-center outline-none"
      >
        <Play
          className={cn(
            'size-[17cqw] fill-white text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] transition-opacity duration-200',
            paused ? 'opacity-95' : 'opacity-0',
          )}
        />
      </button>
    </Card>
  );
}

// The "reel wall", reimagined as a HERO CAROUSEL: one featured vertical reel with
// a shadcn thumbnail carousel to switch, and — on the left — a description that
// tracks the reel you're currently on. Selecting a thumbnail (or dragging the
// reel) updates both the featured player and the left-hand copy.
export default function ReelCatalogue() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => { api.off('select', onSelect); };
  }, [api]);

  const activeReel = CATALOGUE[current] ?? CATALOGUE[0];

  return (
    <section id="work" className="flex min-h-screen flex-col justify-center px-[7vw] py-28 scroll-mt-24">
      <div className="mx-auto w-full max-w-[1150px]">
        <SectionHead index="N° 02" title="A reel for every product." kicker="The work" ghost="02" />
        <div className="mt-14 grid grid-cols-1 items-center gap-14 md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] md:gap-20">
        {/* LEFT — the currently-featured reel's description */}
        <div>
          {/* This block swaps with the active reel */}
          <Reveal delay={140}>
            <div className="border-t border-[#B08D4C]/20 pt-8">
              <Badge variant="secondary" className="font-mono text-[10px] uppercase tracking-[0.16em]">{activeReel.brand}</Badge>
              <p className="mt-4 min-h-[2.2em] whitespace-pre-line text-white font-bold leading-[1.06] text-[clamp(24px,3.2vw,38px)]">{activeReel.caption}</p>
              <p className="mt-3 font-mono text-[13px] uppercase tracking-[0.18em] text-[#EADFCF]/55">{activeReel.sub}</p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-7 max-w-[42ch] text-[15px] leading-relaxed text-[#EADFCF]/55">
              Sixty seconds each, made for the feed. Tap a thumbnail to switch — {current + 1} / {CATALOGUE.length}.
            </p>
          </Reveal>
        </div>

        {/* RIGHT — featured reel carousel + thumbnail carousel */}
        <Reveal delay={120}>
          <div className="mx-auto w-full max-w-[340px]">
            <Carousel setApi={setApi} opts={{ loop: true, align: 'center' }}>
              <CarouselContent>
                {CATALOGUE.map((reel, i) => (
                  <CarouselItem key={reel.brand}>
                    <AspectRatio ratio={REEL_AR}>
                      <FeaturedReel reel={reel} index={i} active={i === current} />
                    </AspectRatio>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Thumbnails — shadcn carousel; the active one is simply brighter. */}
            <Carousel opts={{ dragFree: true, containScroll: 'keepSnaps' }} className="mt-4">
              <CarouselContent className="my-1">
                {CATALOGUE.map((reel, i) => (
                  <CarouselItem
                    key={reel.brand}
                    onClick={() => api?.scrollTo(i)}
                    className={cn('basis-1/4 cursor-pointer transition-opacity', i === current ? 'opacity-100' : 'opacity-40 hover:opacity-75')}
                  >
                    <AspectRatio ratio={REEL_AR}>
                      <div
                        className="h-full w-full overflow-hidden rounded-md"
                        style={{ background: `linear-gradient(160deg, ${reel.gradient[0]}, ${reel.gradient[1]} 55%, ${reel.gradient[2]})` }}
                      />
                    </AspectRatio>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </Reveal>
        </div>
      </div>
    </section>
  );
}
