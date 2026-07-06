import { Heart, MessageCircle, Repeat2, Send, Home, Search, CircleUserRound } from 'lucide-react';
import type { Reel } from '@/lib/pitchContent';

// A faithful Instagram Reels UI chrome, overlaid on the featured reel so it reads
// as an actual reel playing in-feed. Everything is sized in container-query units
// (cqw = 1% of the reel's width) so the whole UI scales pixel-proportionally with
// the reel at any display size. Content is Varsheni's (her handle + the reel's
// caption), not a copy of any real post.
//
// Requires the parent (the reel Card) to set `container-type: inline-size`.

const HANDLE = 'varsheni';
// Believable, deterministic engagement per reel position.
const LIKES = ['1,344', '2,108', '987', '3,204', '1,562', '2,741'];
const COMMENTS = ['13', '42', '8', '67', '21', '35'];
const SHARES = ['375', '512', '96', '740', '288', '431'];

// iOS status-bar signal dots (4 ascending bars).
function Signal() {
  return (
    <svg viewBox="0 0 18 12" className="h-[3cqw] w-auto" fill="currentColor" aria-hidden>
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
      <rect x="10" y="3" width="3" height="9" rx="1" />
      <rect x="15" y="0.5" width="3" height="11.5" rx="1" />
    </svg>
  );
}
function Wifi() {
  return (
    <svg viewBox="0 0 16 12" className="h-[3cqw] w-auto" fill="currentColor" aria-hidden>
      <path d="M8 2.2c2.5 0 4.8 1 6.5 2.6l-1.3 1.4A7.4 7.4 0 0 0 8 4.3 7.4 7.4 0 0 0 2.8 6.2L1.5 4.8A9.4 9.4 0 0 1 8 2.2Zm0 3.3c1.5 0 2.9.6 3.9 1.6l-1.3 1.4A3.6 3.6 0 0 0 8 6.9c-1 0-1.9.4-2.6 1L4 6.5a5.6 5.6 0 0 1 4-1ZM8 8.6c.7 0 1.3.3 1.8.8L8 11.5 6.2 9.4A2.5 2.5 0 0 1 8 8.6Z" />
    </svg>
  );
}
function Battery() {
  return (
    <div className="flex items-center gap-[0.6cqw]">
      <div className="relative flex h-[3.2cqw] w-[6.4cqw] items-center rounded-[0.9cqw] border border-white/60 px-[0.4cqw]">
        <span className="ml-auto mr-[0.3cqw] font-sans text-[2.6cqw] font-semibold leading-none text-white">38</span>
      </div>
      <div className="h-[1.2cqw] w-[0.5cqw] rounded-r-full bg-white/60" />
    </div>
  );
}
// Instagram verified seal (blue scalloped badge + check).
function Verified() {
  return (
    <svg viewBox="0 0 24 24" className="size-[3.6cqw]" aria-hidden>
      <path
        fill="#3897F0"
        d="M12 1l2.6 2 3.2-.4 1.2 3 3 1.2-.4 3.2 2 2.6-2 2.6.4 3.2-3 1.2-1.2 3-3.2-.4L12 23l-2.6-2-3.2.4-1.2-3-3-1.2.4-3.2L1 12l2-2.6-.4-3.2 3-1.2 1.2-3 3.2.4z"
      />
      <path fill="#fff" d="M10.6 15.2l-2.9-2.9 1.3-1.3 1.6 1.6 4-4 1.3 1.3z" />
    </svg>
  );
}

function RailButton({ icon, count }: { icon: React.ReactNode; count?: string }) {
  return (
    <div className="flex flex-col items-center gap-[1.1cqw]">
      <span className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">{icon}</span>
      {count && <span className="text-[3.1cqw] font-semibold leading-none text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">{count}</span>}
    </div>
  );
}

export default function InstagramReelUI({ reel, index }: { reel: Reel; index: number }) {
  const k = index % LIKES.length;
  const icon = 'size-[7.6cqw] stroke-[1.7]';

  return (
    <div className="absolute inset-0 z-20 select-none font-sans text-white">
      {/* Status bar */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-[6cqw] pt-[3.4cqw]">
        <span className="text-[4.6cqw] font-semibold tracking-tight">4:20</span>
        <div className="flex items-center gap-[1.6cqw]">
          <Signal />
          <Wifi />
          <Battery />
        </div>
      </div>

      {/* Right action rail */}
      <div className="absolute bottom-[24cqw] right-[3.5cqw] flex flex-col items-center gap-[5cqw]">
        <RailButton icon={<Heart className={icon} />} count={LIKES[k]} />
        <RailButton icon={<MessageCircle className={icon} />} count={COMMENTS[k]} />
        <RailButton icon={<Repeat2 className={icon} />} />
        <RailButton icon={<Send className={`${icon} -rotate-12`} />} count={SHARES[k]} />
        {/* "more" — two short bars */}
        <div className="flex flex-col items-center gap-[1cqw] pt-[0.5cqw]">
          <span className="h-[0.7cqw] w-[5.5cqw] rounded-full bg-white" />
          <span className="h-[0.7cqw] w-[5.5cqw] rounded-full bg-white" />
        </div>
      </div>

      {/* Bottom-left: account + caption (cleared above the nav, and kept off the rail) */}
      <div className="absolute inset-x-0 bottom-[18cqw] pl-[4.5cqw] pr-[14cqw]">
        <div className="flex items-center gap-[2.6cqw]">
          {/* avatar with gradient ring */}
          <div className="rounded-full bg-[conic-gradient(from_0deg,#FEDA75,#FA7E1E,#D62976,#962FBF,#4F5BD5,#FEDA75)] p-[0.7cqw]">
            <div className="flex size-[8.2cqw] items-center justify-center rounded-full bg-[#2A1A1C] text-[3.6cqw] font-bold uppercase text-white ring-[0.5cqw] ring-black">
              {HANDLE[0]}
            </div>
          </div>
          <span className="text-[4cqw] font-semibold">{HANDLE}</span>
          <Verified />
          <button className="ml-[1.5cqw] rounded-[2cqw] border border-white/70 px-[3.4cqw] py-[1cqw] text-[3.5cqw] font-semibold">
            Follow
          </button>
        </div>
        <p className="mt-[2.6cqw] line-clamp-1 text-[3.7cqw] text-white/95">
          {reel.caption.replace(/\n/g, ' ')} — my honest take …
        </p>
        <div className="mt-[1.8cqw] flex items-center gap-[1.6cqw] text-[3.3cqw] text-white/80">
          <span aria-hidden>♪</span>
          <span>Original audio · {HANDLE}</span>
        </div>
      </div>

      {/* Bottom nav — a floating translucent pill */}
      <div className="absolute inset-x-[3cqw] bottom-[2.6cqw] flex items-center justify-between rounded-full bg-black/40 px-[6.5cqw] py-[3cqw] backdrop-blur-md">
        <Home className="size-[6.2cqw] stroke-[1.8]" />
        <span className="flex size-[9cqw] items-center justify-center rounded-[2.6cqw] bg-white">
          <svg viewBox="0 0 24 24" className="size-[4.6cqw]" fill="#0a0a0a" aria-hidden><path d="M8 5v14l11-7z" /></svg>
        </span>
        <span className="relative">
          <Send className="size-[6.2cqw] -rotate-6 stroke-[1.8]" />
          <span className="absolute right-[-0.6cqw] top-[-0.4cqw] size-[2.4cqw] rounded-full bg-[#FF3040] ring-[0.7cqw] ring-black/40" />
        </span>
        <Search className="size-[6.2cqw] stroke-[1.8]" />
        <CircleUserRound className="size-[6.6cqw] stroke-[1.7]" />
      </div>
    </div>
  );
}
