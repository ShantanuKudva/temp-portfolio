import ReelCatalogue from './ReelCatalogue';
import About from './beats/About';
import WhatYouGet from './beats/WhatYouGet';
import TheAsk from './beats/TheAsk';

// The "post-scroll" portfolio — a normal-flow page that begins once the 3D
// phone has faded out. It is NOT inside the phone-scroll q region, so sections
// can be added/reordered here without affecting the phone choreography above.
//
// Its opaque warm ground covers the fixed black phone canvas (z-0) as it
// scrolls up; the top gradient softens the black-cinema → warm-portfolio seam.
export default function PortfolioPage() {
  return (
    <div className="relative z-10 bg-[#160C0E]">
      <About />
      <ReelCatalogue />
      <WhatYouGet />
      <TheAsk />
    </div>
  );
}
