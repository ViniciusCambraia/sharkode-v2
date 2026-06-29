import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const ORG_NAME = 'Sharkode';
const ORG_URL = 'https://sharkode.com.br';
const ORG_LOGO = 'https://sharkode.com.br/SALVA_AI_GARAIO.webp';
const ORG_DESCRIPTION =
  'A Sharkode é especializada na criação de sites premium de altíssima performance, interfaces interativas e soluções web integradas à IA e automações.';

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: ORG_NAME,
  url: ORG_URL,
  logo: ORG_LOGO,
  description: ORG_DESCRIPTION,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'BR',
  },
  knowsAbout: [
    'Web Development',
    'AI Automation',
    'UI/UX Design',
    'React',
    'TypeScript',
    'Tailwind CSS',
  ],
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${ORG_URL}#business`,
  name: ORG_NAME,
  image: ORG_LOGO,
  url: ORG_URL,
  description: ORG_DESCRIPTION,
  priceRange: 'R$ R$',
  areaServed: {
    '@type': 'Country',
    name: 'Brasil',
  },
  serviceType: [
    'Desenvolvimento de Sites',
    'Landing Pages',
    'Sistemas Web',
    'Automações com IA',
    'SEO Técnico',
  ],
  knowsAbout: [
    'React',
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'GSAP',
    'Vite',
    'n8n',
    'OpenAI',
  ],
  sameAs: [
    'https://www.instagram.com/sharkode',
    'https://www.linkedin.com/company/sharkode',
  ],
};

/**
 * Top-level SEO for the single-page site. Renders a <Helmet> block with
 * title, description, OG, Twitter, canonical, and JSON-LD schemas
 * (Organization + LocalBusiness/ProfessionalService).
 */
export default function SEO({
  title = 'Sharkode - Websites Premium & Automações com IA',
  description = ORG_DESCRIPTION,
  image = 'https://sharkode.com.br/og-image.svg',
  url = ORG_URL,
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Sharkode" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json">
        {JSON.stringify(orgSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
}
