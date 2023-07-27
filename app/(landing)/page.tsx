import LandingComponent from '@/components/landing-component';
import LandingHero from '@/components/landing-hero';
import { LandingNavbar } from '@/components/landing-navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className='h-full'>
      <LandingNavbar />
      <LandingHero />
      <LandingComponent />
    </div>
  );
};

export default LandingPage;
