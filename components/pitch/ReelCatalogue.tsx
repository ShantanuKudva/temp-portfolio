'use client';
import { useRef } from 'react';
import { Play } from 'lucide-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CATALOGUE, type Reel } from '@/lib/pitchContent';

// Deterministic per-position variance so the wall reads as a natural scatter,
// not a ruled row: staggered widths, vertical offsets, and a slight tilt.
const WIDTHS = [224, 204, 240, 212, 232, 208];
const OFFY = [0, 22, -12, 16, -20, 8];
const ROT = [-1.4, 1.0, -0.7, 1.5, -1.1, 0.6];

// One reel card. Composed from shadcn primitives (Card / AspectRatio / Badge /
// Button). The organic placement lives on the OUTER wrapper (inline transform);
// the hover pop lives on the INNER wrapper (transform via classes) so they don't
// fight. On hover the card pops + plays its video; siblings desaturate because
// the whole wall is a `group/wall` and only the hovered card overrides it back.
function ReelCard({ reel, i }: { reel: Reel; i: number }) {
  const vid = useRef<HTMLVideoElement>(null);
  const play = () => { const v = vid.current; if (v) { v.currentTime = 0; v.play().catch(() => {}); } };
  const stop = () => { const v = vid.current; if (v) v.pause(); };
  const k = i % WIDTHS.length;

  return (
    <div style={{ transform: `translateY(${OFFY[k]}px) rotate(${ROT[k]}deg)`, width: `${WIDTHS[k]}px` }}>
      <div
        onMouseEnter={play}
        onMouseLeave={stop}
        className="group/card transition-all duration-300 ease-out group-hover/wall:opacity-40 group-hover/wall:saturate-[0.35] hover:z-20 hover:!scale-[1.12] hover:!opacity-100 hover:-translate-y-3 hover:!saturate-100"
      >
        <AspectRatio ratio={9 / 16}>
          <Card className="relative h-full w-full overflow-hidden rounded-2xl border-white/10 p-0 shadow-2xl transition-shadow duration-300 group-hover/card:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
            <div
              className="absolute inset-0 transition-transform duration-[6000ms] ease-out group-hover/card:scale-110"
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
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
              />
            )}
            <Badge variant="secondary" className="absolute left-3 top-3 z-10 font-mono text-[10px] uppercase tracking-[0.14em]">
              {reel.brand}
            </Badge>
            <Button
              size="icon"
              variant="secondary"
              onClick={play}
              aria-label={`Play ${reel.brand} reel`}
              className="absolute left-1/2 top-1/2 z-10 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
            >
              <Play className="size-5" />
            </Button>
            <div className="absolute inset-x-0 bottom-0 z-10 p-4">
              <p className="whitespace-pre-line text-[19px] font-extrabold leading-[1.04] tracking-[-0.01em] text-white drop-shadow">{reel.caption}</p>
              <p className="mt-2 font-mono text-[11px] text-white/75">{reel.sub}</p>
            </div>
          </Card>
        </AspectRatio>
      </div>
    </div>
  );
}

// The "reel wall": a full-bleed horizontal marquee (shadcn Carousel + Embla
// AutoScroll) that keeps moving, pauses on hover, and spotlights the hovered
// card (it pops; the rest desaturate). The body of work, distinct from the
// single hero reel the phone plays.
export default function ReelCatalogue() {
  // Repeat the set so the track is comfortably wider than the viewport — Embla's
  // loop + AutoScroll need surplus content to cycle seamlessly.
  const cards = [...CATALOGUE, ...CATALOGUE, ...CATALOGUE];
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden py-24">
      <div className="mb-10 px-[7vw]">
        <p className="mb-6 font-mono text-[13px] uppercase tracking-[0.32em] text-[#B08D4C]">The work</p>
        <h2 className="max-w-[16ch] text-white font-extrabold leading-[0.98] tracking-[-0.02em] text-[clamp(34px,5vw,64px)]">A reel for every product.</h2>
        <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-[#EADFCF]/55">Hover any one to watch it. Each is sixty seconds, made for the feed.</p>
      </div>
      <Carousel
        opts={{ loop: true, dragFree: true, align: 'start', containScroll: false }}
        plugins={[AutoScroll({ speed: 1, startDelay: 0, stopOnInteraction: false, stopOnMouseEnter: true, stopOnFocusIn: false })]}
        className="group/wall w-full [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
      >
        <CarouselContent className="items-center py-20">
          {cards.map((reel, i) => (
            <CarouselItem key={`${reel.brand}-${i}`} className="basis-auto">
              <ReelCard reel={reel} i={i} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
