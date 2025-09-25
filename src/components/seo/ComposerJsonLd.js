/**
 * src/components/seo/ComposerJsonLd.js
 * JSON-LD cho trang Composer: Person + ItemList các bài hát
 */
export default function ComposerJsonLd({ composer, songs, baseUrl }) {
  if (!composer) return null;

  const composerUrl = `${baseUrl}/composers/${composer.slug}`;

  const itemList = (songs || []).map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${baseUrl}/songs/${s.slug}`,
    name: s.title,
  }));

  const payload = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: composer.name,
      url: composerUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Bài hát của ${composer.name}`,
      itemListOrder: "http://schema.org/ItemListOrderDescending",
      numberOfItems: itemList.length,
      itemListElement: itemList,
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
