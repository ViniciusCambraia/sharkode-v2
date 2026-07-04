import { lazy, Suspense } from 'react';
import Layout from '../components/Layout';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import Ticker from '../components/Ticker';
import Stats from '../components/Stats';
import Manifesto from '../components/Manifesto';
import KineticText from '../components/KineticText';
import Bento from '../components/Bento';
import Capabilities from '../components/Capabilities';
import Process from '../components/Process';
import Work from '../components/Work';
import Integrations from '../components/Integrations';
import WhyTrust from '../components/WhyTrust';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import CTABanner from '../components/CTABanner';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import SectionSkeleton from '../components/SectionSkeleton';

// Lazy-loaded heavy sections
const BlurSection = lazy(() => import('../components/BlurSection'));
const Calculator  = lazy(() => import('../components/Calculator'));

export default function Home() {
  return (
    <Layout>
      <SEO />
      <a href="#main" className="skip-link">
        Pular para o conteúdo
      </a>
      <Nav />
      <main id="main" className="relative">
        <Hero />
        <Ticker />
        <Stats />
        <Manifesto />
        <KineticText />
        <Bento />
        <Capabilities />
        <Process />
        <Work />
        <Suspense fallback={<SectionSkeleton height="h-screen" />}>
          <BlurSection />
        </Suspense>
        <Integrations />
        <div className="cv-auto">
          <WhyTrust />
        </div>
        <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
          <Calculator />
        </Suspense>
        <div className="cv-auto">
          <Testimonials />
        </div>
        <div className="cv-auto">
          <FAQ />
        </div>
        <CTABanner />
      </main>
      <Footer />
    </Layout>
  );
}
