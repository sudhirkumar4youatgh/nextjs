import AddPostButton from "../components/addPostButton";

import Categories from "../components/categories";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6">
      <main className="w-full max-w-6xl space-y-10">
        <section className="rounded-3xl bg-white p-10 shadow-lg shadow-slate-200/50">
          <h1 className="text-4xl font-semibold text-slate-900">Post Forum</h1>
          <p className="mt-4 text-slate-600">
            Browse posts and categories in a simple Next.js app.
          </p>
        </section>

        <section className="rounded-3xl bg-white p-10 shadow-lg shadow-slate-200/50">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-slate-900">All Categories</h2>
            <AddPostButton />
          </div>
          <Categories />
        </section>
      </main>
    </div>
  );
}
