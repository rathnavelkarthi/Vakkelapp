import type { NextApiRequest, NextApiResponse } from "next";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createApp } from "../../server";

export const config = { api: { bodyParser: false } };

let application: ReturnType<typeof createApp> | undefined;

export default async function api(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (!application) {
    const database =
      process.env.DATABASE_PATH || resolve(".runtime/legal-os.sqlite");
    if (database !== ":memory:")
      mkdirSync(dirname(database), { recursive: true });
    application = createApp(database);
  }
  await application.handleRequest(request, response);
}
