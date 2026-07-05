import PortalLine from './beats/PortalLine';
import MeetHer from './beats/MeetHer';
import Problem from './beats/Problem';
import ReelBeat from './beats/ReelBeat';
import WhyHer from './beats/WhyHer';
import ReelCatalogue from './ReelCatalogue';
import WhatYouGet from './beats/WhatYouGet';
import TheAsk from './beats/TheAsk';

export default function PitchOverlay() {
  return (
    <div className="relative z-10">
      <PortalLine />
      <MeetHer />
      <Problem />
      <ReelBeat eyebrow="Proof · a review" head={'Sixty seconds.\nZero fluff.'} note="One product, one verdict, no wasted frames. This is exactly what lands on your audience's feed." />
      <WhyHer />
      <ReelBeat eyebrow="In the wild" head={'Your product,\nmade obvious.'} note="The same treatment, tuned to whatever you're launching — an app, a tool, a whole brand." />
      <ReelCatalogue />
      <WhatYouGet />
      <TheAsk />
    </div>
  );
}
