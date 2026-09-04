import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // O vinext usa este valor como limite do corpo da requisição para toda a
      // app, não só para server actions — inclusive rotas como
      // /admin/api/upload. O padrão é 1 MB, que rejeitava qualquer foto de
      // celular com um 413 em texto puro antes mesmo do handler rodar.
      // 6mb deixa a validação de 5 MB da própria rota responder primeiro.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
