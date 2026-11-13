import type { Branch, Lang } from '../data/branches';
import { site } from '../config/site';
import { localize, routes } from './urls';

/**
 * schema.org Dentist (LocalBusiness) for a branch.
 * Only real data is emitted: unknown street address / phone / hours are omitted.
 */
export function branchSchema(b: Branch, lang: Lang, siteUrl: URL) {
  const url = new URL(localize(routes.branch(b.slug), lang), siteUrl).href;
  return {
    '@type': 'Dentist',
    '@id': new URL(`/branches/${b.slug}/#dentist`, siteUrl).href,
    name: `${site.brand[lang]} - ${b.name[lang]}`,
    url,
    image: new URL('/og-image.png', siteUrl).href,
    parentOrganization: { '@id': new URL('/#organization', siteUrl).href },
    address: {
      '@type': 'PostalAddress',
      ...(b.address ? { streetAddress: b.address[lang] } : {}),
      addressLocality: b.locality[lang],
      addressRegion: b.region[lang],
      addressCountry: 'EG',
    },
    areaServed: b.locality[lang],
    ...(b.phone ? { telephone: b.phone } : {}),
    ...(b.mapLink ? { hasMap: b.mapLink } : {}),
    medicalSpecialty: 'Dentistry',
  };
}
