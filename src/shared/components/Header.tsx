import { Container } from "./Container";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#17130f]/95 text-[#fffaf1] backdrop-blur-md">
      <Container className="flex h-[72px] items-center justify-between gap-5">
        <a className="group flex items-center gap-3" href="#inicio" aria-label="Boteco do Zé — início">
          <span className="grid size-10 place-items-center rounded-full border border-[#e2a52b]/60 bg-[#e2a52b] font-display text-xl tracking-wide text-[#17130f] transition-transform group-hover:-rotate-3">
            ZÉ
          </span>
          <span>
            <span className="block font-display text-xl leading-none tracking-[0.08em]">
              BOTECO DO ZÉ
            </span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.24em] text-[#e2a52b]">
              Desde 1998
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-semibold md:flex" aria-label="Navegação principal">
          <a className="transition-colors hover:text-[#e2a52b]" href="#cardapio">
            Cardápio
          </a>
          <a className="transition-colors hover:text-[#e2a52b]" href="#sobre">
            Nossa casa
          </a>
        </nav>

        <div className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs font-semibold sm:text-sm">
          <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgb(52_211_153/0.12)]" aria-hidden="true" />
          <span>Aberto hoje</span>
        </div>
      </Container>
    </header>
  );
}
