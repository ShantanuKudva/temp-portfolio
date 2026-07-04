import ScenePreview from '@/components/hero/ScenePreview';

// Live build preview: the real scene + a `p` scrubber (drag or click a beat) so you can
// watch the whole choreography without scrolling. New rigs appear here as they land.
export default function SpikePage() {
  return (
    <main className="h-screen w-full">
      <ScenePreview />
    </main>
  );
}
