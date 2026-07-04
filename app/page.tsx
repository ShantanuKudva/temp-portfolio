import ScrollProvider from '@/components/scroll/ScrollProvider';
import HeroCanvas from '@/components/hero/HeroCanvas';

export default function Page() {
  return (
    <main className="relative w-full bg-background">
      <ScrollProvider>
        <section className="h-screen w-full">
          <HeroCanvas />
        </section>
      </ScrollProvider>
      <section className="h-screen w-full" />{/* below-hero spacer; PortfolioHandoff replaces later */}
    </main>
  );
}
