import ScrollProvider from '@/components/scroll/ScrollProvider';
import HeroCanvas from '@/components/hero/HeroCanvas';
import HookText from '@/components/overlay/HookText';
import ScrollIndicator from '@/components/overlay/ScrollIndicator';
import Preloader from '@/components/hero/Preloader';

export default function Page() {
  return (
    <main className="relative w-full bg-background">
      <ScrollProvider>
        <section className="h-screen w-full">
          <HeroCanvas />
          <HookText />
          <ScrollIndicator />
        </section>
      </ScrollProvider>
      <section className="h-screen w-full" />{/* below-hero spacer; PortfolioHandoff replaces later */}
      {/* Gates the scene until every GLB + the HDRI have streamed in (100%). */}
      <Preloader />
    </main>
  );
}
