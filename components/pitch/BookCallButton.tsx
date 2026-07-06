'use client';
import { useEffect } from 'react';
import { getCalApi } from '@calcom/embed-react';
import { Button } from '@/components/ui/button';
import { CAL_LINK } from '@/lib/pitchContent';

export default function BookCallButton() {
  useEffect(() => {
    (async () => {
      try {
        const cal = await getCalApi();
        cal('ui', { hideEventTypeDetails: false, layout: 'month_view' });
      } catch {
        /* embed unavailable → anchor fallback below still works */
      }
    })();
  }, []);

  return (
    <Button
      nativeButton={false}
      render={
        <a
          href={`https://cal.com/${CAL_LINK}`}
          data-cal-link={CAL_LINK}
          data-cal-config='{"layout":"month_view"}'
        />
      }
      size="lg"
      className="rounded-full"
    >
      Book a call →
    </Button>
  );
}
