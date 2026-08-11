import Image from "next/image";
import { venue } from "@/src/config/venue";
import { getVenueOpeningStatus } from "@/src/domain/venue/opening-hours";
import { Container } from "./Container";
import { VenueOpeningStatus } from "./VenueOpeningStatus";

export function Header() {
  const initialOpeningStatus = getVenueOpeningStatus(
    venue.openingSchedule,
    new Date(),
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[#e7a316]/35 bg-[#070503]/95 text-[#fff0c2] shadow-[0_8px_30px_rgb(0_0_0/0.45)] backdrop-blur-md">
      <Container className="flex h-[88px] items-center justify-between gap-4">
        <a
          className="group flex items-center gap-3"
          href="#inicio"
          aria-label="Boteco do Zé — início"
        >
          <span className="block h-[58px] w-[87px] overflow-hidden rounded-md border border-[#e7a316]/55 bg-black shadow-[0_0_20px_rgb(231_163_22/0.12)] sm:h-[68px] sm:w-[102px]">
            <Image
              src="/logo-boteco-do-ze.png"
              alt="Boteco do Zé"
              width={306}
              height={204}
              sizes="(min-width: 640px) 102px, 87px"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              priority
            />
          </span>
          <span className="hidden border-l border-[#e7a316]/30 pl-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#cdb886] lg:block">
            Comida boa
            <br />e cerveja gelada
          </span>
        </a>

        <nav
          className="hidden items-center gap-8 text-sm font-semibold md:flex"
          aria-label="Navegação principal"
        >
          <a className="transition-colors hover:text-[#ffbc24]" href="#cardapio">
            Cardápio
          </a>
          <a className="transition-colors hover:text-[#ffbc24]" href="#sobre">
            Nossa casa
          </a>
        </nav>

        <VenueOpeningStatus initialStatus={initialOpeningStatus} />
      </Container>
    </header>
  );
}
