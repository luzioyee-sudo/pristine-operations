// @ts-nocheck
/**
 * Minimal Express-compatible adapter so the original Express route handlers can
 * run unchanged on the Web Request/Response (edge) runtime used by this project.
 */

export interface MiniRequest {
  method: string;
  url: string;
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
  body: any;
  headers: Record<string, string>;
  get(name: string): string | undefined;
}

export interface MiniResponse {
  status(code: number): MiniResponse;
  json(body: any): MiniResponse;
  send(body?: any): MiniResponse;
  setHeader(name: string, value: string): MiniResponse;
  set(name: string, value: string): MiniResponse;
  type(value: string): MiniResponse;
  end(body?: any): MiniResponse;
  sendStatus(code: number): MiniResponse;
  headersSent: boolean;
}

type Handler = (req: MiniRequest, res: MiniResponse) => unknown;

interface RouteDef {
  method: string;
  keys: string[];
  regex: RegExp;
  handler: Handler;
}

function compile(pattern: string): { regex: RegExp; keys: string[] } {
  const keys: string[] = [];
  const source = pattern
    .replace(/\/+$/, "")
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/:(\w+)/g, (_m, key: string) => {
      keys.push(key);
      return "([^/]+)";
    })
    .replace(/\*/g, ".*");
  return { regex: new RegExp(`^${source || "/"}/?$`), keys };
}

export function createMiniApp() {
  const routes: RouteDef[] = [];

  const register = (method: string) => (pattern: string, handler: Handler) => {
    const { regex, keys } = compile(pattern);
    routes.push({ method, regex, keys, handler });
  };

  const app = {
    get: register("GET"),
    post: register("POST"),
    put: register("PUT"),
    patch: register("PATCH"),
    delete: register("DELETE"),
    options: register("OPTIONS"),
    use: (..._args: unknown[]) => {
      /* middleware (body parsing, static files) is handled by the runtime */
    },
    listen: (..._args: unknown[]) => {
      /* no-op: the edge runtime owns the listener */
    },
    async handle(request: Request): Promise<Response> {
      const url = new URL(request.url);
      const pathname = url.pathname;

      const match = routes.find(
        (route) => route.method === request.method && route.regex.test(pathname),
      );
      if (!match) {
        return new Response(JSON.stringify({ error: "Not found", path: pathname }), {
          status: 404,
          headers: { "content-type": "application/json" },
        });
      }

      const execResult = match.regex.exec(pathname)!;
      const params: Record<string, string> = {};
      match.keys.forEach((key, index) => {
        params[key] = decodeURIComponent(execResult[index + 1] ?? "");
      });

      let body: any = undefined;
      if (request.method !== "GET" && request.method !== "HEAD") {
        const raw = await request.text();
        if (raw) {
          const contentType = request.headers.get("content-type") || "";
          if (contentType.includes("application/x-www-form-urlencoded")) {
            body = Object.fromEntries(new URLSearchParams(raw));
          } else {
            try {
              body = JSON.parse(raw);
            } catch {
              body = raw;
            }
          }
        } else {
          body = {};
        }
      }

      const headers: Record<string, string> = {};
      request.headers.forEach((value, key) => {
        headers[key.toLowerCase()] = value;
      });

      const req: MiniRequest = {
        method: request.method,
        url: pathname + url.search,
        path: pathname,
        params,
        query: Object.fromEntries(url.searchParams),
        body: body ?? {},
        headers,
        get: (name: string) => headers[name.toLowerCase()],
      };

      let statusCode = 200;
      const resHeaders = new Headers();
      let resolveResponse!: (response: Response) => void;
      const responsePromise = new Promise<Response>((resolve) => {
        resolveResponse = resolve;
      });

      const finish = (payload: BodyInit | null) => {
        if (res.headersSent) return res;
        res.headersSent = true;
        resolveResponse(new Response(payload, { status: statusCode, headers: resHeaders }));
        return res;
      };

      const res: MiniResponse = {
        headersSent: false,
        status(code: number) {
          statusCode = code;
          return res;
        },
        sendStatus(code: number) {
          statusCode = code;
          return finish(null);
        },
        setHeader(name: string, value: string) {
          resHeaders.set(name, value);
          return res;
        },
        set(name: string, value: string) {
          resHeaders.set(name, value);
          return res;
        },
        type(value: string) {
          resHeaders.set("content-type", value);
          return res;
        },
        json(payload: any) {
          resHeaders.set("content-type", "application/json");
          return finish(JSON.stringify(payload));
        },
        send(payload?: any) {
          if (payload == null) return finish(null);
          if (typeof payload === "string") {
            if (!resHeaders.has("content-type")) {
              resHeaders.set("content-type", "text/html; charset=utf-8");
            }
            return finish(payload);
          }
          if (payload instanceof Uint8Array || payload instanceof ArrayBuffer) {
            return finish(payload as BodyInit);
          }
          resHeaders.set("content-type", "application/json");
          return finish(JSON.stringify(payload));
        },
        end(payload?: any) {
          return finish(payload ?? null);
        },
      };

      try {
        await match.handler(req, res);
      } catch (error) {
        console.error("[api] unhandled route error", error);
        if (!res.headersSent) {
          statusCode = 500;
          res.json({ error: "Internal server error" });
        }
      }

      if (!res.headersSent) {
        // Handler returned without responding (e.g. fire-and-forget work).
        res.json({ ok: true });
      }

      return responsePromise;
    },
  };

  return app;
}

export type MiniApp = ReturnType<typeof createMiniApp>;
