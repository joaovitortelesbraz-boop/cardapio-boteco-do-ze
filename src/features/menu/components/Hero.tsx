import Image from "next/image";
import { venue } from "@/src/config/venue";
import { Container } from "@/src/shared/components/Container";

export function Hero() {
  return (
    <section
      id="inicio"
      className="wood-texture overflow-hidden border-b border-[#e7a316]/30 text-[#fff0c2]"
    >
      <Container className="grid min-h-[650px] items-center gap-12 py-14 md:grid-cols-[0.82fr_1.18fr] md:py-20 lg:min-h-[720px]">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#e7a316]">
            <span className="h-px w-10 bg-[#e7a316]" aria-hidden="true" />
            O verdadeiro clima de boteco
          </div>
          <h1 className="font-display text-[clamp(3.5rem,8vw,7.1rem)] leading-[0.88] tracking-[-0.055em] text-[#fff0c2] [text-shadow:0_5px_0_#080503]">
            COMIDA BOA.
            <span className="gold-text mt-3 block">CERVEJA GELADA.</span>
          </h1>
          <p className="mt-8 max-w-lg text-base font-semibold leading-7 text-[#cdb886] sm:text-lg">
            “{venue.tagline}”
          </p>
          <p className="mt-3 max-w-lg text-sm leading-6 text-[#8f7d58]">
            Porções deliciosas, drinks especiais e aquela boa resenha que faz a
            noite render.
          </p>
          <a
            className="mt-9 inline-flex min-h-12 items-center justify-center rounded-md border border-[#ffcf62] bg-gradient-to-b from-[#ffbc24] to-[#c57908] px-7 text-sm font-black uppercase tracking-[0.12em] text-[#100b07] shadow-[0_8px_25px_rgb(231_163_22/0.2),inset_0_1px_0_rgb(255_255_255/0.35)] transition hover:-translate-y-0.5 hover:brightness-110"
            href="#cardapio"
          >
            Ver cardápio
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-3xl md:ml-auto">
          <div
            className="absolute -inset-3 rounded-[1.35rem] bg-[#e7a316]/10 blur-xl"
            aria-hidden="true"
          />
          <div className="relative aspect-[3/2] overflow-hidden rounded-xl border-2 border-[#d8920b] bg-black p-1 shadow-[0_24px_70px_rgb(0_0_0/0.65),0_0_38px_rgb(231_163_22/0.12)]">
            <Image
              src="/logo-boteco-do-ze.png"
              alt="Logo do Boteco do Zé em uma placa de madeira com detalhes dourados"
              fill
              sizes="(min-width: 768px) 55vw, calc(100vw - 2.5rem)"
              className="h-full w-full rounded-lg object-cover"
              priority
            />
          </div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[#ffbc24]/55 bg-[#090603] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#ffbc24] shadow-xl">
            Tradição · sabor · resenha
          </div>
        </div>
      </Container>
    </section>
  );
}
