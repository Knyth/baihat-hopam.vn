// src/components/seo/TrendingJsonLd.js
// Server component: nhúng JSON-LD ItemList cho trang Thịnh hành
// Không phụ thuộc client-side. Chỉ render một <script type="application/ld+json">.

export default function TrendingJsonLd({ items = [], baseUrl, days = 7 }) {
  const list = items.map((it, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    url: `${baseUrl}/songs/${it.slug}`,
    name: it.title,
  }));

  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListOrder: "http://schema.org/ItemListOrderAscending",
    name: `Thịnh hành ${days} ngày`,
    numberOfItems: list.length,
    itemListElement: list,
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD phải là chuỗi
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
