import Link from 'next/link'
import AddPostButton from "../../../components/addPostButton";

async function fetchCategory(slug) {
  const res = await fetch(`http://127.0.0.1:8000/myapp/api/categories/${slug}`, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!res.ok) {
    return null
  }

  return res.json()
}

export default async function CategoryDetails({ params }) {
  const { slug } = await params
  const category = await fetchCategory(slug)

  if (!category) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-semibold text-slate-900">Category not found</h1>
        <p className="mt-4 text-slate-600">We could not load this category. Please check the slug and try again.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-semibold text-slate-900">{category.category.name}</h1>
        <AddPostButton />
      </div>

      {category.posts?.length ? (
        <div className="mt-8 space-y-4">
          <h3 className="text-2xl font-semibold text-slate-900">All posts in {category.category.name} category</h3>
          <ul className="space-y-3">
              {category.posts.map((post) => {
                const createdDate = post.created_at ? new Date(post.created_at).toISOString().split('T')[0] : ''
                return (
                  <li key={post.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between w-full">
                      <p className="text-lg font-semibold text-slate-900">{post.title}</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{post.content}</p>
                    <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                      <span>Posted on: {createdDate}</span>
                      <span className="text-right">({post.views} views)</span>
                    </div>
                  </li>
                )
              })}
          </ul>
        </div>
      ) : (
        <p className="mt-8 text-slate-600">No posts are currently associated with this category.</p>
      )}
    </div>
  )
}
