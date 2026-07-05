import PitchProvider from '@/components/scroll/PitchProvider';
import PitchCanvas from './PitchCanvas';
import PitchOverlay from './PitchOverlay';
import PitchFooter from './PitchFooter';

export default function PitchSection() {
  return (
    <PitchProvider>
      <div className="relative w-full bg-[#0B0708]">
        <PitchCanvas />
        <PitchOverlay />
      </div>
      <PitchFooter />
    </PitchProvider>
  );
}
