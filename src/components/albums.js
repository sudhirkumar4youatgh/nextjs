import Link from "next/link";

export default function Albums() {
  const albums = [
    { id: "1", title: "Ocean Dreams", artist: "Blue Horizon", genre: "Ambient" },
    { id: "2", title: "Electric Nights", artist: "Neon Pulse", genre: "Electronic" },
    { id: "3", title: "Sunset Vinyl", artist: "Golden Echo", genre: "Indie" },
  ];

  return (
    <ul className="mt-6 space-y-4">
      {albums.map((album) => (
        <li key={album.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <Link href={`/albums/${album.id}`} className="text-lg font-semibold text-slate-900 hover:text-blue-600">
            {album.title}
          </Link>
          <p className="text-sm text-slate-600">{album.artist} · {album.genre}</p>
        </li>
      ))}
    </ul>
  );
}

 