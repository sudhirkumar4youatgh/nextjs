import Link from "next/link";

async function fetchCategories() {
  const res = await fetch('http://127.0.0.1:8000/myapp/api/categories', {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    console.error('Failed to fetch categories:', res.status);
    return [];
  }

  const data = await res.json();
  return Array.isArray(data) ? data : data?.categories || [];
}

export default async function Categories() {
  const categories = await fetchCategories();

  if (!categories.length) {
    return (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
        No categories available.
      </div>
    );
  }

  return (
    <ul className="mt-6 space-y-4">
      {categories.map((category) => (
        <li key={category.slug} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <Link href={`/categories/${category.slug}`} className="text-lg font-semibold text-slate-900 hover:text-blue-600">
            {category.name}
          </Link> {category.posts_count ? ` (${category.posts_count})` : ''} posts
        </li>
      ))}
    </ul>
  );
}

 