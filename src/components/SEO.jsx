import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = "CodeOrbits | Web & Mobile App Developer in Mumbai, India",
  description = "CodeOrbits is a Mumbai-based web and mobile app development agency. React, Node.js, Flutter experts. Hire top-rated developers in Mumbai for your next project.",
  canonical = "https://codeorbits.in/",
  ogImage = "https://codeorbits.in/og-image.jpg",
  ogType = "website",
  noIndex = false,
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />

      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
