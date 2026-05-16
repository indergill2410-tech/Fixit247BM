interface LocalBusinessInput {
  name: string; suburb: string; state: string; postcode?: string;
  trade: string; phone?: string; rating?: number; reviewCount?: number;
}

export function localBusinessSchema(input: LocalBusinessInput): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: input.name,
    description: `Professional ${input.trade.toLowerCase()} services in ${input.suburb}, ${input.state}`,
    areaServed: { '@type': 'City', name: input.suburb },
    address: { '@type': 'PostalAddress', addressLocality: input.suburb, addressRegion: input.state, addressCountry: 'AU', ...(input.postcode && { postalCode: input.postcode }) },
    telephone: input.phone,
    aggregateRating: input.rating ? { '@type': 'AggregateRating', ratingValue: input.rating, reviewCount: input.reviewCount ?? 1, bestRating: 5, worstRating: 1 } : undefined,
    openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '00:00', closes: '23:59' },
    priceRange: '$$',
  };
}

export function serviceSchema(trade: string, suburb: string, isEmergency: boolean): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${isEmergency ? 'Emergency ' : ''}${trade} Service in ${suburb}`,
    description: `${isEmergency ? '24/7 emergency' : 'Same-day'} ${trade.toLowerCase()} services in ${suburb}. Verified and licensed professionals.`,
    areaServed: suburb,
    availableChannel: { '@type': 'ServiceChannel', serviceUrl: 'https://fixit247.com.au', servicePhone: '1800-FIXIT-247' },
    hoursAvailable: { '@type': 'OpeningHoursSpecification', opens: '00:00', closes: '23:59' },
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
