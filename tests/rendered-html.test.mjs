import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

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
  assert.match(html, /NOSSO CARDÁPIO/);
  assert.match(html, /Coxinha do Zé/);
  assert.match(html, /Zé Burguer/);
  assert.match(html, /Caipirinha Clássica/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("keeps ordering out of the first release", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /apenas para consulta/i);
  assert.doesNotMatch(html, /adicionar ao carrinho|finalizar pedido/i);
});
