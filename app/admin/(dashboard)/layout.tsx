import Link from "next/link";
import { logoutAction } from "./actions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#090603] text-[#fff0c2]">
      <input type="checkbox" id="sidebar-toggle" className="peer hidden" />

      <label
        htmlFor="sidebar-toggle"
        className="fixed left-4 top-4 z-50 flex size-10 items-center justify-center rounded-md border border-[#e7a316]/30 bg-[#0d0907] md:hidden"
      >
        <svg className="size-5 text-[#cdb886]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </label>

      <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-[#e7a316]/20 bg-[#0d0907] transition-transform duration-200 -translate-x-full peer-checked:translate-x-0 md:sticky md:translate-x-0">
        <div className="border-b border-[#e7a316]/20 px-5 py-5">
          <Link href="/admin" className="font-display text-lg text-[#ffbc24]">
            Boteco do Zé
          </Link>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#9e8b62]">
            Painel Admin
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[#cdb886] transition-colors hover:bg-[#171009] hover:text-[#fff0c2]"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Dashboard
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[#cdb886] transition-colors hover:bg-[#171009] hover:text-[#fff0c2]"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            Produtos
          </Link>

          <Link
            href="/admin/categories"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[#cdb886] transition-colors hover:bg-[#171009] hover:text-[#fff0c2]"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            Categorias
          </Link>
        </nav>

        <div className="border-t border-[#e7a316]/20 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[#9e8b62] transition-colors hover:bg-[#171009] hover:text-[#fff0c2]"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Ver cardápio
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[#9e8b62] transition-colors hover:bg-[#171009] hover:text-red-400"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sair
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8 pt-16 md:pt-8">{children}</main>
    </div>
  );
}
