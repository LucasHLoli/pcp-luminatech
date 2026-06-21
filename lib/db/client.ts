// Cliente Turso (libSQL). Em dev, cai para um arquivo local (file:local.db)
// quando TURSO_DATABASE_URL não está definida.

import { createClient, type Client } from "@libsql/client";

let _client: Client | null = null;

export function getClient(): Client {
  if (_client) return _client;
  const url = process.env.TURSO_DATABASE_URL || "file:local.db";
  const authToken = process.env.TURSO_AUTH_TOKEN || undefined;
  _client = createClient({ url, authToken });
  return _client;
}
