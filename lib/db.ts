import { createClient, type Client } from "@libsql/client/web";

const DEFAULT_TURSO_URL = "libsql://biolink-tlmenu.aws-eu-west-1.turso.io";
const DEFAULT_TURSO_AUTH_TOKEN =
  "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODgwODU1NDEsImlkIjoiMDFhMDUyMmEtYzkwMS03NmQ1LWJjOTYtOGM3ZmZkZDdhNzBhIiwia2lkIjoiWWVqdWZKNThUTVZmeWFUZUFLdHJKcVBoeXA5c0dWemhJVXllU3Z3UFlSVSIsInJpZCI6ImY2NWJkMDIyLWRhYjktNGUwOC04ZTJhLWQ5OWZiZGZiYTQyNCJ9.k9RM2wgDYnVkcXOFzrnFHw7L7Kl73h_CY-8KIpuHrohNneQAjLQrVDolF7WF3mk30OOCNiF9L8nmpj0GiMDuCQ";

const globalForDb = globalThis as unknown as {
  __biolinkDb?: Client;
};

export const db: Client =
  globalForDb.__biolinkDb ??
  createClient({
    url: process.env.TURSO_DATABASE_URL || DEFAULT_TURSO_URL,
    authToken: process.env.TURSO_AUTH_TOKEN || DEFAULT_TURSO_AUTH_TOKEN,
  });

if (!globalForDb.__biolinkDb) {
  globalForDb.__biolinkDb = db;
}

export const dbReady: Promise<void> = Promise.resolve();
