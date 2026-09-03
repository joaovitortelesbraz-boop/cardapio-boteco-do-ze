export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const params = await searchParams;
  const errorCode = params.error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#090603] px-4">
      <div className="w-full max-w-sm rounded-xl border border-[#e7a316]/30 bg-[#171009] p-8 shadow-[0_18px_55px_rgb(0_0_0/0.28)]">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl text-[#fff0c2]">
            Boteco do Zé
          </h1>
          <p className="mt-2 text-sm text-[#cdb886]">Painel Administrativo</p>
        </div>

        <form method="POST" action="/admin/api/login" encType="multipart/form-data" className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9e8b62]"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoFocus
              className="w-full rounded-md border border-[#e7a316]/30 bg-[#090603] px-4 py-3 text-sm text-[#fff0c2] outline-none transition-colors focus:border-[#ffbc24] focus:ring-1 focus:ring-[#ffbc24]/50"
              placeholder="Digite a senha"
            />
          </div>

          {errorCode === "1" && (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              Senha incorreta. Tente novamente.
            </p>
          )}

          {errorCode === "db" && (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              Banco de dados indisponível. Configure o D1 e execute o seed.
            </p>
          )}

          {errorCode === "no-password" && (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              Variável ADMIN_PASSWORD não configurada no servidor.
            </p>
          )}

          {errorCode === "no-secret" && (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              Variável HMAC_SECRET não configurada no servidor.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-md border border-[#ffcf62] bg-gradient-to-b from-[#ffbc24] to-[#c57908] px-6 py-3 text-sm font-black uppercase tracking-wider text-[#100b07] shadow-[0_8px_25px_rgb(231_163_22/0.2)] transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
