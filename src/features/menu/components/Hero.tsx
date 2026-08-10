import type { MenuProduct } from "@/src/domain/menu/menu.types";
import { formatCurrency } from "@/src/shared/lib/format-currency";
import { Container } from "@/src/shared/components/Container";

interface HeroProps {
  featuredProduct?: MenuProduct;
}

export function Hero({ featuredProduct }: HeroProps) {
  return (
    <section id="inicio" className="overflow-hidden bg-[#17130f] text-[#fffaf1]">
      <Container className="grid min-h-[610px] items-center gap-10 py-14 md:grid-cols-[0.9fr_1.1fr] md:py-20 lg:min-h-[680px]">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#e2a52b]">
            <span className="h-px w-10 bg-[#e2a52b]" aria-hidden="true" />
            Tradição que cabe na mesa
          </div>
          <h1 className="font-display text-[clamp(4.2rem,11vw,8.6rem)] leading-[0.78] tracking-[-0.035em]">
            SABOR DE
            <span className="mt-4 block text-[#e2a52b]">BOTECO.</span>
          </h1>
          <p className="mt-8 max-w-lg text-base leading-7 text-white/68 sm:text-lg">
            Petiscos caprichados, porções generosas e bebida sempre gelada. Escolha sem pressa — aqui a mesa é sua.
          </p>
          <a
            className="mt-9 inline-flex min-h-12 items-center justify-center rounded-full bg-[#e2a52b] px-7 text-sm font-extrabold uppercase tracking-[0.12em] text-[#17130f] transition hover:-translate-y-0.5 hover:bg-[#f2b943]"
            href="#cardapio"
          >
            Ver cardápio
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-2xl md:ml-auto">
          <div className="absolute -inset-5 rotate-3 rounded-[2.5rem] border border-[#e2a52b]/35" aria-hidden="true" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[#2b241d] shadow-2xl shadow-black/35">
            <img
              src={featuredProduct?.imageUrl}
              alt={featuredProduct?.imageAlt ?? "Especialidade do Boteco do Zé"}
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            {featuredProduct ? (
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-6 sm:p-8">
                <div>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#e2a52b]">
                    Destaque da casa
                  </p>
                  <p className="font-display text-3xl tracking-wide sm:text-4xl">
                    {featuredProduct.name}
                  </p>
                </div>
                <p className="shrink-0 rounded-full bg-[#fffaf1] px-4 py-2 text-base font-black text-[#17130f]">
                  {formatCurrency(featuredProduct.priceInCents)}
                </p>
              </div>
            ) : null}
          </div>
          <div className="absolute -bottom-5 -left-3 rotate-[-4deg] bg-[#b94c35] px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-white shadow-lg sm:-left-8">
            Feito na hora
          </div>
        </div>
      </Container>
    </section>
  );
}
