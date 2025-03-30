import { InfiniteSlider } from '@/components/ui/infinite-slider';

export function SponsorSlider() {
  return (
    <InfiniteSlider gap={24} reverse>
      <img
        src='/exa-logo.svg'
        alt='EXA logo'
        className='h-[40px] w-auto'
      />
      <img
        src='/supabase-logo.svg'
        alt='Supabase logo'
        className='h-[40px] w-auto'
      />
      <img
        src='/netlify-logo.svg'
        alt='Netlify logo'
        className='h-[40px] w-auto'
      />
      <img
        src='/cloudflare-logo.svg'
        alt='Cloudflare logo'
        className='h-[40px] w-auto'
      />
      <img
        src='/sentry-logo.svg'
        alt='Sentry logo'
        className='h-[40px] w-auto'
      />
    </InfiniteSlider>
  );
}
