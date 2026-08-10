import type {
  MenuCategory,
  MenuProduct,
} from "@/src/domain/menu/menu.types";

export const menuCategories = [
  {
    id: "petiscos",
    name: "Petiscos",
    shortDescription: "Pra abrir o apetite",
  },
  {
    id: "porcoes",
    name: "Porções",
    shortDescription: "Feitas para dividir",
  },
  {
    id: "lanches",
    name: "Lanches",
    shortDescription: "Caprichados de verdade",
  },
  {
    id: "bebidas",
    name: "Bebidas",
    shortDescription: "Sempre no ponto",
  },
] as const satisfies readonly MenuCategory[];

export const menuProducts = [
  {
    id: "prd_001",
    slug: "coxinha-do-ze",
    categoryId: "petiscos",
    name: "Coxinha do Zé",
    description:
      "Massa leve, frango bem temperado e requeijão cremoso. Vem com molho da casa.",
    priceInCents: 2490,
    imageUrl:
      "https://images.unsplash.com/photo-1607329367978-0a651fdd8edb?auto=format&fit=crop&w=1200&q=82",
    imageAlt: "Porção de salgados dourados com molho",
    featured: true,
    badge: "Queridinha da casa",
    available: true,
  },
  {
    id: "prd_002",
    slug: "pasteis-da-vila",
    categoryId: "petiscos",
    name: "Pastéis da Vila",
    description:
      "Oito unidades sequinhas nos sabores carne, queijo e queijo com alho-poró.",
    priceInCents: 3290,
    imageUrl:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=82",
    imageAlt: "Pastéis crocantes servidos em uma travessa",
    badge: "Para compartilhar",
    available: true,
  },
  {
    id: "prd_003",
    slug: "calabresa-acebolada",
    categoryId: "porcoes",
    name: "Calabresa Acebolada",
    description:
      "Calabresa na chapa com cebola dourada, cheiro-verde e pão francês fatiado.",
    priceInCents: 4290,
    imageUrl:
      "https://images.unsplash.com/photo-1533060328534-2db4d2602877?auto=format&fit=crop&w=1200&q=82",
    imageAlt: "Linguiças douradas preparadas na grelha",
    featured: true,
    available: true,
  },
  {
    id: "prd_004",
    slug: "batata-rustica",
    categoryId: "porcoes",
    name: "Batata Rústica",
    description:
      "Batatas crocantes com páprica, alecrim, parmesão e maionese de alho.",
    priceInCents: 3490,
    imageUrl:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1200&q=82",
    imageAlt: "Porção de batatas fritas crocantes",
    badge: "Vegetariano",
    available: true,
  },
  {
    id: "prd_005",
    slug: "ze-burguer",
    categoryId: "lanches",
    name: "Zé Burguer",
    description:
      "Blend de 160g, queijo meia cura, cebola caramelizada e maionese da casa.",
    priceInCents: 3890,
    imageUrl:
      "https://images.unsplash.com/photo-1521791853374-e56df02d24e4?auto=format&fit=crop&w=1200&q=82",
    imageAlt: "Hambúrguer artesanal com queijo e salada",
    featured: true,
    badge: "Mais pedido",
    available: true,
  },
  {
    id: "prd_006",
    slug: "sanduiche-de-pernil",
    categoryId: "lanches",
    name: "Sanduíche de Pernil",
    description:
      "Pernil desfiado lentamente, vinagrete, provolone e pão crocante.",
    priceInCents: 3690,
    imageUrl:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=82",
    imageAlt: "Sanduíche recheado servido sobre uma tábua",
    available: true,
  },
  {
    id: "prd_007",
    slug: "caipirinha-classica",
    categoryId: "bebidas",
    name: "Caipirinha Clássica",
    description:
      "Cachaça prata, limão fresco, açúcar e bastante gelo. Também na versão sem álcool.",
    priceInCents: 2290,
    imageUrl:
      "https://images.unsplash.com/photo-1544145945-b4744b209fc2?auto=format&fit=crop&w=1200&q=82",
    imageAlt: "Coquetel gelado com limão fresco",
    badge: "Refrescante",
    available: true,
  },
  {
    id: "prd_008",
    slug: "cerveja-puro-malte",
    categoryId: "bebidas",
    name: "Cerveja Puro Malte",
    description:
      "Garrafa 600 ml servida trincando. Consulte os rótulos disponíveis no dia.",
    priceInCents: 1490,
    imageUrl:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=82",
    imageAlt: "Cerveja dourada servida gelada",
    available: true,
  },
] as const satisfies readonly MenuProduct[];
