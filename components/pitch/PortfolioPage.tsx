import EditorialBackdrop from './EditorialBackdrop';
import About from './beats/About';
import ReelCatalogue from './ReelCatalogue';
import CaseStudy from './beats/CaseStudy';
import Process from './beats/Process';
import Reviewed from './beats/Reviewed';
import WhatYouGet from './beats/WhatYouGet';
import Pricing from './beats/Pricing';
import Faq from './beats/Faq';
import TheAsk from './beats/TheAsk';

// The "post-scroll" portfolio — an editorial, magazine-numbered page that begins
// once the 3D phone has faded out. EditorialBackdrop (-z-10 within this z-10
// stacking context) is the warm ground + glows + grain that covers the fixed 3D
// canvas; every section paints above it. Sections are ordered as a contents page:
//   01 Meet · 02 Work · 03 Case study · 04 Process · 05 Reviewed
//   06 What you get · 07 Pricing · 08 FAQ · then the closing ask.
export default function PortfolioPage() {
  return (
    <div className="relative z-10">
      <EditorialBackdrop />
      <About />
      <ReelCatalogue />
      <CaseStudy />
      <Process />
      <Reviewed />
      <WhatYouGet />
      <Pricing />
      <Faq />
      <TheAsk />
    </div>
  );
}
