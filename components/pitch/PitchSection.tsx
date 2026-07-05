import PitchProvider from '@/components/scroll/PitchProvider';
import PitchCanvas from './PitchCanvas';
import PitchOverlay from './PitchOverlay';
import PitchFooter from './PitchFooter';

export default function PitchSection() {
  return (
    <PitchProvider>
      {/* No background here — the fixed PitchCanvas (z-0) IS the black ground +
          phone; the beats (z-10, transparent) sit above it. An opaque bg here
          would paint over the canvas and hide the phone. */}
      <div className="relative w-full">
        <PitchCanvas />
        <PitchOverlay />
      </div>
      <PitchFooter />
    </PitchProvider>
  );
}
