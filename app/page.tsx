import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-16">
      <main className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Quotation Management UI</h1>
        <p className="mt-2 text-zinc-600">Static demo with Context API, Tailwind, and toast notifications.</p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link href="/admin" className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 hover:bg-zinc-100">
            <div className="text-lg font-medium">Admin</div>
            <div className="text-sm text-zinc-600">Create, edit, and export quotations.</div>
          </Link>
          <Link href="/client" className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 hover:bg-zinc-100">
            <div className="text-lg font-medium">Client</div>
            <div className="text-sm text-zinc-600">View a quotation, remove features, negotiate.</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
