import Image from "next/image";
import { venue } from "@/src/config/venue";
import { Container } from "./Container";
import { InstagramIcon } from "./InstagramIcon";

export function Footer() {
  return (
    <footer
      id="sobre"
      className="border-t border-[#e7a316]/35 bg-[#050403] py-12 text-[#fff0c2]"
    >
      <Container className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="flex max-w-2xl flex-col gap-5 sm:flex-row sm:items-center">
          <Image
            src="/logo-boteco-do-ze.png"
            alt="Boteco do Zé"
            width={240}
            height={160}
            sizes="120px"
            className="h-20 w-[120px] rounded-md border border-[#e7a316]/45 object-cover"
            loading="lazy"
          />
          <div>
            <p className="font-display text-xl text-[#fff0c2]">
              {venue.invitation}
            </p>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#a89568]">
              {venue.tagline}
            </p>
          </div>
        </div>

        <div className="grid gap-4 text-sm text-[#a89568] sm:grid-cols-2 lg:text-right">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#e7a316]">
              Funcionamento
            </p>
            <p className="mt-1 font-semibold text-[#fff0c2]">
              {venue.openingHours}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#e7a316]">
              Instagram
            </p>
            <a
              className="group mt-2 inline-flex min-h-11 max-w-full items-center gap-2.5 rounded-lg border border-[#e7a316]/35 bg-[#171009] px-3.5 py-2 font-bold text-[#fff0c2] shadow-[inset_0_1px_0_rgb(255_240_194/0.04)] transition-[border-color,background-color,color,box-shadow] duration-200 ease-out hover:border-[#ffbc24]/70 hover:bg-[#21160c] hover:text-[#ffbc24] hover:shadow-[inset_0_1px_0_rgb(255_240_194/0.06),0_0_18px_rgb(231_163_22/0.12)]"
              href={venue.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Abrir o Instagram oficial do ${venue.name} em uma nova aba`}
            >
              <InstagramIcon className="size-5 shrink-0 text-[#e7a316] transition-[color,filter] duration-200 group-hover:text-[#ffbc24] group-hover:drop-shadow-[0_0_4px_rgb(255_188_36/0.35)]" />
              <span className="truncate">{venue.instagram.handle}</span>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
