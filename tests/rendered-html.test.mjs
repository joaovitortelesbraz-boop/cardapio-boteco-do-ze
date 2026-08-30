import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";

const expectedProductImages = [
  ["prd_001", "cervejas/Heineken Latão.jfif"],
  ["prd_002", "cervejas/Antarctica Latão .png"],
  ["prd_003", "cervejas/Brahma Latão.png"],
  ["prd_004", "cervejas/Amstel Latão .jfif"],
  ["prd_005", "cervejas/Chopp Stempel.png"],
  ["prd_006", "cervejas/Cerveja Piriguete.png"],
  ["prd_007", "cervejas/Long Neck Heineken.jfif"],
  ["prd_008", "cervejas/Long Neck Budweiser.jfif"],
  ["prd_009", "sem-alcool/Refrigerante 2 litros.png"],
  ["prd_010", "sem-alcool/Água.jfif"],
  ["prd_011", "sem-alcool/start energético.png"],
  ["prd_012", "sem-alcool/Refrigerante lata.jfif"],
  ["prd_013", "drinks/Caipirinha.jfif"],
  ["prd_014", "drinks/Caipivodka.jfif"],
  ["prd_015", "drinks/Copão.png"],
  ["prd_016", "drinks/Gin com Tônica.jpg"],
  ["prd_017", "doses/Gin.jpg"],
  ["prd_018", "doses/campari.jpg"],
  ["prd_019", "doses/Black Fire.png"],
  ["prd_020", "doses/Cachaça.png"],
  ["prd_021", "doses/Paratudo.png"],
  ["prd_022", "doses/Cachaça 51.png"],
  ["prd_023", "doses/Vodka.jpg"],
  ["prd_024", "doses/Canelinha.png"],
  ["prd_025", "doses/Bananinha.png"],
  ["prd_026", "doces/Bala Halls.png"],
  ["prd_027", "doces/Trident.png"],
  ["prd_028", "cigarros/Cigarro Varejo.jpg"],
  ["prd_029", "cigarros/Cigarro de Sabor.jpg"],
  ["prd_030", "porçoes/Batata .jpg"],
  ["prd_031", "porçoes/Calabresa Acebolada .png"],
  ["prd_032", "porçoes/Batata, Calabresa e Cebola.png"],
  ["prd_033", "porçoes/Batata e Porco Acebolado.png"],
  ["prd_034", "jogos/Sinuca .png"],
  ["prd_035", "jogos/Fliperama .png"],
  ["prd_036", "drinks/Ice Off.jpg"],
  ["prd_037", "drinks/Skoll Beats.webp"],
  ["prd_038", "drinks/We mix.jpg"],
  ["prd_039", "sem-alcool/H20.jpg"],
  ["prd_040", "sem-alcool/Água com gás.png"],
  ["prd_041", "doses/Whisky Ballantines.webp"],
  ["prd_042", "doses/Dreher.webp"],
  ["prd_043", "sem-alcool/Guaravita.png"],
  ["prd_044", "sem-alcool/Água de coco.png"],
  ["prd_045", "sem-alcool/Suco Del Valle.png"],
  ["prd_046", "doses/Whisky Red Label.webp"],
  ["prd_047", "doses/Whisky Cavalo Branco.webp"],
  ["prd_048", "doses/Vodka Smirnoff.webp"],
  ["prd_049", "doces/Fandangos.webp"],
];

const legacyMenuHash =
  "8243a61227e8ae170151bc3127f604a405a5b1c9a31341d7043090ed13f13529";

const expectedNewProducts = [
  {
    id: "prd_036",
    slug: "ice-off",
    categoryId: "drinks",
    name: "Ice Off",
    priceInCents: 700,
    imageUrl: "/images/drinks/Ice Off.jpg",
    imageFit: "contain",
    imagePosition: "21% 50%",
    imageScale: 0.85,
    available: true,
  },
  {
    id: "prd_037",
    slug: "skoll-beats",
    categoryId: "drinks",
    name: "Skoll Beats",
    priceInCents: 1000,
    imageUrl: "/images/drinks/Skoll Beats.webp",
    imageFit: "contain",
    imagePosition: "28% 52%",
    available: true,
  },
  {
    id: "prd_038",
    slug: "we-mix",
    categoryId: "drinks",
    name: "We Mix",
    priceInCents: 1000,
    imageUrl: "/images/drinks/We mix.jpg",
    imageFit: "contain",
    imagePosition: "28% 52%",
    available: true,
  },
  {
    id: "prd_039",
    slug: "h2o",
    categoryId: "sem-alcool",
    name: "H2O",
    priceInCents: 800,
    imageUrl: "/images/sem-alcool/H20.jpg",
    imageFit: "contain",
    imagePosition: "28% 50%",
    available: true,
  },
  {
    id: "prd_040",
    slug: "agua-com-gas",
    categoryId: "sem-alcool",
    name: "Água com gás",
    priceInCents: 400,
    imageUrl: "/images/sem-alcool/Água com gás.png",
    imageFit: "contain",
    imagePosition: "28% 52%",
    available: true,
  },
  {
    id: "prd_041",
    slug: "dose-whisky-ballantines",
    categoryId: "doses",
    name: "Dose de Whisky Ballantine's",
    priceInCents: 1200,
    imageUrl: "/images/doses/Whisky Ballantines.webp",
    imageFit: "cover",
    imagePosition: "48% 55%",
    available: true,
  },
  {
    id: "prd_042",
    slug: "dose-dreher",
    categoryId: "doses",
    name: "Dose Dreher",
    priceInCents: 600,
    imageUrl: "/images/doses/Dreher.webp",
    imageFit: "cover",
    imagePosition: "48% 51%",
    available: true,
  },
  {
    id: "prd_043",
    slug: "guaravita",
    categoryId: "sem-alcool",
    name: "Guaravita",
    priceInCents: 400,
    imageUrl: "/images/sem-alcool/Guaravita.png",
    imageFit: "contain",
    imagePosition: "28% 52%",
    available: true,
  },
  {
    id: "prd_044",
    slug: "agua-de-coco",
    categoryId: "sem-alcool",
    name: "Água de coco",
    priceInCents: 600,
    imageUrl: "/images/sem-alcool/Água de coco.png",
    imageFit: "contain",
    imagePosition: "28% 52%",
    available: true,
  },
  {
    id: "prd_045",
    slug: "suco-del-valle",
    categoryId: "sem-alcool",
    name: "Suco Del Valle",
    priceInCents: 500,
    imageUrl: "/images/sem-alcool/Suco Del Valle.png",
    imageFit: "contain",
    imagePosition: "28% 52%",
    available: true,
  },
  {
    id: "prd_046",
    slug: "dose-whisky-red-label",
    categoryId: "doses",
    name: "Dose de Whisky Red Label",
    priceInCents: 2000,
    imageUrl: "/images/doses/Whisky Red Label.webp",
    imageFit: "cover",
    imagePosition: "28% 50%",
    available: true,
  },
  {
    id: "prd_047",
    slug: "dose-whisky-cavalo-branco",
    categoryId: "doses",
    name: "Dose de Whisky Cavalo Branco",
    priceInCents: 1700,
    imageUrl: "/images/doses/Whisky Cavalo Branco.webp",
    imageFit: "cover",
    imagePosition: "28% 70%",
    available: true,
  },
  {
    id: "prd_048",
    slug: "dose-vodka-smirnoff",
    categoryId: "doses",
    name: "Dose de Vodka Smirnoff",
    priceInCents: 1200,
    imageUrl: "/images/doses/Vodka Smirnoff.webp",
    imageFit: "cover",
    imagePosition: "28% 50%",
    available: true,
  },
  {
    id: "prd_049",
    slug: "salgadinho",
    categoryId: "doces",
    name: "Salgadinho",
    priceInCents: 400,
    imageUrl: "/images/doces/Fandangos.webp",
    imageFit: "cover",
    imagePosition: "48% 60%",
    available: true,
  },
];

const expectedCategoryCounts = {
  cervejas: 8,
  "sem-alcool": 9,
  drinks: 7,
  doses: 14,
  doces: 3,
  cigarros: 2,
  porcoes: 4,
  jogos: 2,
};

function getProductCardHtml(html, productId) {
  const cardStart = html.indexOf(`data-product-card="${productId}"`);
  assert.notEqual(cardStart, -1, `Card ${productId} não encontrado`);

  const cardEnd = html.indexOf("</article>", cardStart);
  assert.notEqual(cardEnd, -1, `Fim do card ${productId} não encontrado`);

  return html.slice(cardStart, cardEnd);
}

function getCategorySectionHtml(html, categoryId) {
  const sectionMarker = `<section aria-labelledby="category-${categoryId}">`;
  const sectionStart = html.indexOf(sectionMarker);
  assert.notEqual(sectionStart, -1, `Categoria ${categoryId} não encontrada`);

  const nextSection = html.indexOf(
    '<section aria-labelledby="category-',
    sectionStart + sectionMarker.length,
  );

  return html.slice(sectionStart, nextSection === -1 ? undefined : nextSection);
}

function normalizeRenderedHtml(html) {
  return html.replaceAll("<!-- -->", "").replaceAll("&#x27;", "'");
}

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  return (await import(workerUrl.href)).default;
}

async function render() {
  const worker = await loadWorker();

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the menu content", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="pt-BR">/i);
  assert.match(html, /<title>Boteco do Zé \| Cardápio<\/title>/i);
  assert.match(html, /CARDÁPIO DIGITAL/);
  assert.match(html, /Heineken/);
  assert.match(html, /Gin com Tônica/);
  assert.match(html, /Canelinha/);
  assert.match(html, /Batata e Porco Acebolado/);
  assert.match(html, /Fliperama/);
  assert.match(html, /Se a semana foi pesada/);
  assert.match(html, /19h às 02h/);
  assert.match(html, /20h às 04h/);
  assert.match(html, /@botecodo_ze_/);
  assert.match(html, /data-venue-status="(?:open|closed)"/);
  assert.match(html, /role="status"/);
  assert.match(html, /Aberto agora|Fechado/);
  assert.match(html, /Fecha às (?:02:00|04:00)|Abre às (?:19:00|20:00)/);
  assert.doesNotMatch(html, />Cardápio digital</);
  assert.doesNotMatch(html, /Atrás do Churrasquinho da Ilha|Bairro Ilha da Luz/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("renders the official Instagram profile as a secure new-tab link", async () => {
  const response = await render();
  const html = await response.text();
  const linkStart = html.indexOf(
    'href="https://www.instagram.com/botecodo_ze_?igsh=bzRxcDRiMWxwNmRx"',
  );

  assert.notEqual(linkStart, -1, "Link oficial do Instagram não encontrado");

  const linkEnd = html.indexOf("</a>", linkStart);
  const instagramLink = html.slice(linkStart, linkEnd);

  assert.match(instagramLink, /target="_blank"/);
  assert.match(instagramLink, /rel="noopener noreferrer"/);
  assert.match(instagramLink, /aria-label="Abrir o Instagram oficial do Boteco do Zé em uma nova aba"/);
  assert.match(instagramLink, /data-instagram-icon="true"/);
  assert.match(instagramLink, /@botecodo_ze_/);
  assert.doesNotMatch(html, /@boteco_do_ze/);
});

test("calculates every opening boundary in the venue timezone", async () => {
  const { createServer } = await import("vite");
  const projectRoot = fileURLToPath(new URL("../", import.meta.url));
  const vite = await createServer({
    root: projectRoot,
    configFile: false,
    appType: "custom",
    logLevel: "silent",
    resolve: {
      alias: {
        "@": projectRoot,
      },
    },
    server: {
      middlewareMode: true,
    },
  });

  try {
    const [{ getVenueOpeningStatus }, { venue }] = await Promise.all([
      vite.ssrLoadModule("/src/domain/venue/opening-hours.ts"),
      vite.ssrLoadModule("/src/config/venue.ts"),
    ]);
    const cases = [
      ["segunda 18:59", "2026-08-10T21:59:00Z", "closed", "Abre às 19:00"],
      ["segunda 19:00", "2026-08-10T22:00:00Z", "open", "Fecha às 02:00"],
      ["terça 01:59", "2026-08-11T04:59:00Z", "open", "Fecha às 02:00"],
      ["terça 02:00", "2026-08-11T05:00:00Z", "closed", "Abre às 19:00"],
      ["sexta 19:00", "2026-08-14T22:00:00Z", "open", "Fecha às 02:00"],
      ["sábado 01:00", "2026-08-15T04:00:00Z", "open", "Fecha às 02:00"],
      ["sábado 03:00", "2026-08-15T06:00:00Z", "closed", "Abre às 20:00"],
      ["sábado 19:59", "2026-08-15T22:59:00Z", "closed", "Abre às 20:00"],
      ["sábado 20:00", "2026-08-15T23:00:00Z", "open", "Fecha às 04:00"],
      ["domingo 03:59", "2026-08-16T06:59:00Z", "open", "Fecha às 04:00"],
      ["domingo 04:00", "2026-08-16T07:00:00Z", "closed", "Abre às 20:00"],
      ["domingo 20:00", "2026-08-16T23:00:00Z", "open", "Fecha às 04:00"],
      ["segunda 03:59", "2026-08-17T06:59:00Z", "open", "Fecha às 04:00"],
      ["segunda 04:00", "2026-08-17T07:00:00Z", "closed", "Abre às 19:00"],
    ];

    assert.equal(venue.openingSchedule.timeZone, "America/Sao_Paulo");

    for (const [label, instant, expectedState, expectedDetail] of cases) {
      const status = getVenueOpeningStatus(
        venue.openingSchedule,
        new Date(instant),
      );

      assert.equal(status.state, expectedState, label);
      assert.equal(status.detail, expectedDetail, label);
      assert.equal(
        status.nextTransition.kind,
        expectedState === "open" ? "closes" : "opens",
        label,
      );
    }
  } finally {
    await vite.close();
  }
});

test("keeps ordering out and omits the former menu notice", async () => {
  const response = await render();
  const html = await response.text();

  assert.doesNotMatch(
    html,
    /Valores e disponibilidade podem mudar|apenas para consulta|pedidos são feitos no salão/i,
  );
  assert.doesNotMatch(html, /adicionar ao carrinho|finalizar pedido/i);
});

test("renders the category transition and reduced-motion contract", async () => {
  const response = await render();
  const html = await response.text();
  const styles = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(html, /id="menu-results"/);
  assert.match(html, /data-transition-phase="idle"/);
  assert.equal((html.match(/aria-controls="menu-results"/g) ?? []).length, 9);
  assert.equal((html.match(/aria-pressed="true"/g) ?? []).length, 1);
  assert.equal((html.match(/aria-pressed="false"/g) ?? []).length, 8);

  assert.match(styles, /transition-duration:\s*110ms/);
  assert.match(styles, /transition-duration:\s*240ms/);
  assert.match(styles, /animation:\s*menu-card-enter\s+180ms/);
  assert.match(styles, /animation-delay:\s*60ms/);
  assert.match(styles, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(styles, /animation-delay:\s*0ms\s*!important/);
  assert.match(styles, /transition-delay:\s*0ms\s*!important/);
});

test("renders one consistent vector icon set for the menu categories", async () => {
  const response = await render();
  const html = await response.text();
  const categoryIds = [
    "cervejas",
    "sem-alcool",
    "drinks",
    "doses",
    "doces",
    "cigarros",
    "porcoes",
    "jogos",
  ];

  assert.equal((html.match(/data-category-icon="all"/g) ?? []).length, 1);

  for (const categoryId of categoryIds) {
    assert.equal(
      (html.match(new RegExp(`data-category-icon="${categoryId}"`, "g")) ?? [])
        .length,
      2,
    );
  }

  assert.equal((html.match(/data-category-icon=/g) ?? []).length, 17);
  assert.doesNotMatch(html, /🍺|🥤|🍹|🥃|🍬|🚬|🍟|🎮|✦/u);
});

test("preserves the legacy menu except the authorized chopp price and adds exactly thirteen products", async () => {
  const menuDataUrl = new URL(
    "../src/data/menu/menu.data.ts",
    import.meta.url,
  );
  menuDataUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { menuCategories, menuProducts } = await import(menuDataUrl.href);
  const legacyProducts = menuProducts
    .filter((product) => Number(product.id.slice(4)) <= 35)
    .toSorted((first, second) => first.id.localeCompare(second.id));
  const newProducts = menuProducts
    .filter((product) => Number(product.id.slice(4)) >= 36)
    .toSorted((first, second) => first.id.localeCompare(second.id));
  const legacyPriceOverrides = {
    prd_003: 900,
    prd_004: 800,
    prd_005: 1600,
  };
  const normalizedLegacyProducts = legacyProducts.map((product) =>
    product.id in legacyPriceOverrides
      ? { ...product, priceInCents: legacyPriceOverrides[product.id] }
      : product,
  );
  const choppProducts = menuProducts.filter(
    (product) => product.slug === "chopp-stengel",
  );

  assert.equal(menuProducts.length, 49);
  assert.equal(new Set(menuProducts.map((product) => product.id)).size, 49);
  assert.equal(new Set(menuProducts.map((product) => product.slug)).size, 49);
  assert.equal(
    createHash("sha256")
      .update(JSON.stringify(normalizedLegacyProducts))
      .digest("hex"),
    legacyMenuHash,
  );
  assert.equal(choppProducts.length, 1);
  assert.equal(choppProducts[0].name, "Chopp Stengel");
  assert.equal(choppProducts[0].priceInCents, 1800);
  assert.deepEqual(newProducts, expectedNewProducts);

  assert.deepEqual(
    Object.fromEntries(
      menuCategories.map((category) => [
        category.id,
        menuProducts.filter((product) => product.categoryId === category.id)
          .length,
      ]),
    ),
    expectedCategoryCounts,
  );

  for (const [categoryId, expectedNames] of [
    ["drinks", ["Ice Off", "Skoll Beats", "We Mix"]],
    [
      "sem-alcool",
      [
        "H2O",
        "Água com gás",
        "Guaravita",
        "Água de coco",
        "Suco Del Valle",
      ],
    ],
    [
      "doses",
      [
        "Dose de Whisky Ballantine's",
        "Dose Dreher",
        "Dose de Whisky Red Label",
        "Dose de Whisky Cavalo Branco",
        "Dose de Vodka Smirnoff",
      ],
    ],
    ["doces", ["Bala Halls", "Trident", "Salgadinho"]],
  ]) {
    const categoryNames = menuProducts
      .filter((product) => product.categoryId === categoryId)
      .map((product) => product.name);

    assert.deepEqual(categoryNames.slice(-expectedNames.length), expectedNames);
  }
});

test("renders the new products inside their existing category sections", async () => {
  const response = await render();
  const html = await response.text();

  for (const [categoryId, expectedCount, productIds] of [
    [
      "sem-alcool",
      9,
      ["prd_039", "prd_040", "prd_043", "prd_044", "prd_045"],
    ],
    ["drinks", 7, ["prd_036", "prd_037", "prd_038"]],
    [
      "doses",
      14,
      ["prd_041", "prd_042", "prd_046", "prd_047", "prd_048"],
    ],
    ["doces", 3, ["prd_049"]],
  ]) {
    const sectionHtml = normalizeRenderedHtml(
      getCategorySectionHtml(html, categoryId),
    );

    assert.match(sectionHtml, new RegExp(`${expectedCount} opções`));

    for (const productId of productIds) {
      assert.match(sectionHtml, new RegExp(`data-product-card="${productId}"`));
    }
  }

  for (const categoryId of [
    "cervejas",
    "drinks",
    "doses",
    "doces",
    "cigarros",
    "porcoes",
    "jogos",
  ]) {
    const sectionHtml = getCategorySectionHtml(html, categoryId);

    for (const productId of ["prd_043", "prd_044", "prd_045"]) {
      assert.doesNotMatch(
        sectionHtml,
        new RegExp(`data-product-card="${productId}"`),
      );
    }
  }

  for (const categoryId of [
    "cervejas",
    "sem-alcool",
    "drinks",
    "doces",
    "cigarros",
    "porcoes",
    "jogos",
  ]) {
    const sectionHtml = getCategorySectionHtml(html, categoryId);

    for (const productId of ["prd_046", "prd_047", "prd_048"]) {
      assert.doesNotMatch(
        sectionHtml,
        new RegExp(`data-product-card="${productId}"`),
      );
    }
  }

  for (const categoryId of [
    "cervejas",
    "sem-alcool",
    "drinks",
    "doses",
    "cigarros",
    "porcoes",
    "jogos",
  ]) {
    assert.doesNotMatch(
      getCategorySectionHtml(html, categoryId),
      /data-product-card="prd_049"/,
    );
  }

  assert.match(normalizeRenderedHtml(html), />49 itens</);
});

test("renders the updated Chopp Stengel price without duplicating the product", async () => {
  const response = await render();
  const html = normalizeRenderedHtml(await response.text());
  const choppCard = getProductCardHtml(html, "prd_005");

  assert.equal((html.match(/data-product-card="prd_005"/g) ?? []).length, 1);
  assert.match(choppCard, /Chopp Stengel/);
  assert.ok(
    choppCard.includes(
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(18),
    ),
  );
});

test("applies the custom framing only to the Ice Off foreground image", async () => {
  const response = await render();
  const html = await response.text();
  const iceOffCard = getProductCardHtml(html, "prd_036");
  const nextProductCard = getProductCardHtml(html, "prd_037");

  assert.match(iceOffCard, /object-fit:contain/);
  assert.match(iceOffCard, /object-position:21% 50%/);
  assert.match(iceOffCard, /--product-image-scale:0\.85/);
  assert.match(iceOffCard, /--product-image-hover-scale:0\.87/);
  assert.doesNotMatch(nextProductCard, /--product-image-scale/);
  assert.doesNotMatch(nextProductCard, /--product-image-hover-scale/);
});

test("renders local image support for every menu product", async () => {
  await Promise.all(
    expectedProductImages.map(([, imagePath]) =>
      access(
        new URL(`../public/images/${imagePath}`, import.meta.url),
      ),
    ),
  );
  const response = await render();
  const html = await response.text();
  const renderedProductIds = [
    ...html.matchAll(/data-product-card="(prd_\d{3})"/g),
  ].map((match) => match[1]);

  const expectedRenderedProductIds = [
    ...Array.from({ length: 12 }, (_, index) =>
      `prd_${String(index + 1).padStart(3, "0")}`,
    ),
    "prd_039",
    "prd_040",
    "prd_043",
    "prd_044",
    "prd_045",
    ...Array.from({ length: 4 }, (_, index) =>
      `prd_${String(index + 13).padStart(3, "0")}`,
    ),
    "prd_036",
    "prd_037",
    "prd_038",
    ...Array.from({ length: 9 }, (_, index) =>
      `prd_${String(index + 17).padStart(3, "0")}`,
    ),
    "prd_041",
    "prd_042",
    "prd_046",
    "prd_047",
    "prd_048",
    "prd_026",
    "prd_027",
    "prd_049",
    ...Array.from({ length: 8 }, (_, index) =>
      `prd_${String(index + 28).padStart(3, "0")}`,
    ),
  ];

  assert.deepEqual(renderedProductIds, expectedRenderedProductIds);
  assert.deepEqual(
    renderedProductIds.filter((productId) => Number(productId.slice(4)) <= 35),
    Array.from({ length: 35 }, (_, index) =>
      `prd_${String(index + 1).padStart(3, "0")}`,
    ),
  );
  assert.equal((html.match(/data-product-media="prd_\d{3}"/g) ?? []).length, 49);
  assert.equal((html.match(/data-image-placeholder="true"/g) ?? []).length, 0);

  for (const [productId, imagePath] of expectedProductImages) {
    const cardHtml = getProductCardHtml(html, productId);
    const encodedImageUrl = encodeURIComponent(`/images/${imagePath}`);
    assert.ok(
      cardHtml.includes(encodedImageUrl),
      `${productId} não usa /images/${imagePath}`,
    );
  }

  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  for (const product of expectedNewProducts) {
    const cardHtml = normalizeRenderedHtml(getProductCardHtml(html, product.id));

    assert.ok(cardHtml.includes(product.name), `${product.name} não renderizado`);
    assert.ok(
      cardHtml.includes(currencyFormatter.format(product.priceInCents / 100)),
      `Preço de ${product.name} não renderizado no padrão brasileiro`,
    );
  }

  assert.doesNotMatch(html, /(?:src|srcset)="https?:\/\//i);
});

test("falls back to the local asset when image bindings are unavailable", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request(
      "http://localhost/_vinext/image?url=%2Flogo-boteco-do-ze.png&w=640&q=75",
    ),
    {},
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 307);
  assert.equal(
    response.headers.get("location"),
    "http://localhost/logo-boteco-do-ze.png",
  );
});
