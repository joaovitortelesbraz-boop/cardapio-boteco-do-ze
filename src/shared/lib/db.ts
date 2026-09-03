import { drizzle } from "drizzle-orm/d1";
import * as schema from "../../db/schema";

function getDbFromEnv(env: { DB?: D1Database }) {
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable.",
    );
  }
  return drizzle(env.DB, { schema });
}

export { getDbFromEnv };
