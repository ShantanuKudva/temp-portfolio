import PortfolioReveal from './PortfolioReveal';
import PortfolioPage from './PortfolioPage';
import PitchFooter from './PitchFooter';

// The whole post-landing half. The landing's 3D phone sequence (in the parent
// page) ends with its push-through to black; from there the portfolio simply
// crossfades in on scroll. There is no second phone-review section anymore.
export default function PitchSection() {
  return (
    <>
      <PortfolioReveal>
        <PortfolioPage />
      </PortfolioReveal>
      <PitchFooter />
    </>
  );
}
