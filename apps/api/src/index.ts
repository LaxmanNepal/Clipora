import { Elysia, t } from "elysia";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";

const jsonHeaders = { "Cache-Control": "no-store" };

export default new Elysia({ adapter: CloudflareAdapter })
  .onError(({ code, error, set }) => {
    set.status = code === "VALIDATION" ? 400 : 500;
    return { ok: false, error: code === "VALIDATION" ? "Invalid request" : "Internal server error" };
  })
  .get("/", () => ({ ok: true, service: "clipora-api", version: 1 }), { detail: { tags: ["system"] } })
  .get("/health", () => ({ ok: true, healthy: true, timestamp: new Date().toISOString() }), { detail: { tags: ["system"] }, response: t.Object({ ok: t.Boolean(), healthy: t.Boolean(), timestamp: t.String() }) })
  .get("/api/v1/capabilities", () => ({ ok: true, capabilities: { projects: false, transcription: false, rendering: false, storage: false } }), { detail: { tags: ["system"] } })
  .post("/api/v1/echo", ({ body }) => ({ ok: true, message: body.message }), { body: t.Object({ message: t.String({ minLength: 1, maxLength: 2000 }) }), detail: { tags: ["system"] } })
  .compile();
