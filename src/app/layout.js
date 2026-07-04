// app/layout.tsx
import Image from "next/image";
import NavLogin from '@/components/navlogin';
import './globals.css'; // Ensure your Tailwind CSS is imported

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
        {/* HEADER / NAVIGATION */}
        <header className="sticky top-0 z-50 border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="font-bold text-xl tracking-tight">
              <a href="/" className="hover:text-blue-600 transition">
                <Image
                  className="dark:invert"
                  src="/next.svg"
                  alt="Next.js logo"
                  width={100}
                  height={20}
                  priority
                />
              </a>
            </div>
            <nav className="flex items-center space-x-6 font-medium text-sm">
              <a href="/" className="hover:text-blue-600 transition">Home</a>
              <a href="/albums/1" className="hover:text-blue-600 transition">Album</a>
              <NavLogin />
            </nav>
          </div>
        </header>

        <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
          <main className="flex-1 min-w-0 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            {children}
          </main>

          <aside className="w-full md:w-80 shrink-0 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit sticky top-22">
            <h2 className="font-semibold text-lg border-b pb-2 mb-4">Trending Tags</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="hover:underline cursor-pointer">#NextJS</li>
              <li className="hover:underline cursor-pointer">#TailwindCSS</li>
              <li className="hover:underline cursor-pointer">#React</li>
            </ul>
          </aside>
        </div>

        <footer className="bg-gray-900 text-gray-400 mt-auto border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
            <p>&copy; 2026 Your Company. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
