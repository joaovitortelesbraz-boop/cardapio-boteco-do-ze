import { Container } from "./Container";

export function Footer() {
  return (
    <footer id="sobre" className="bg-[#17130f] py-12 text-[#fffaf1]">
      <Container className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="font-display text-3xl tracking-[0.08em]">BOTECO DO ZÉ</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/60">
            Comida honesta, cerveja gelada e mesa cheia. Este cardápio é apenas para consulta.
          </p>
        </div>
        <div className="text-sm leading-6 text-white/60 sm:text-right">
          <p>Terça a domingo · 17h às 00h</p>
          <p>Rua da Boa Mesa, 98 · Centro</p>
        </div>
      </Container>
    </footer>
  );
}
