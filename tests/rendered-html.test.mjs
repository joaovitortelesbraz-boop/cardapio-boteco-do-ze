import assert from "node:assert/strict";
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
];

function getProductCardHtml(html, productId) {
  const cardStart = html.indexOf(`data-product-card="${productId}"`);
  assert.notEqual(cardStart, -1, `Card ${productId} não encontrado`);

  const cardEnd = html.indexOf("</article>", cardStart);
  assert.notEqual(cardEnd, -1, `Fim do card ${productId} não encontrado`);

  return html.slice(cardStart, cardEnd);
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

  assert.deepEqual(
    renderedProductIds,
    Array.from({ length: 35 }, (_, index) =>
      `prd_${String(index + 1).padStart(3, "0")}`,
    ),
  );
  assert.equal((html.match(/data-product-media="prd_\d{3}"/g) ?? []).length, 35);
  assert.equal((html.match(/data-image-placeholder="true"/g) ?? []).length, 0);

  for (const [productId, imagePath] of expectedProductImages) {
    const cardHtml = getProductCardHtml(html, productId);
    const encodedImageUrl = encodeURIComponent(`/images/${imagePath}`);
    assert.ok(
      cardHtml.includes(encodedImageUrl),
      `${productId} não usa /images/${imagePath}`,
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
