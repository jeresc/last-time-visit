import { Hono } from "https://deno.land/x/hono@v3.12.10/mod.ts";
import { serveStatic } from "https://deno.land/x/hono@v3.12.10/middleware.ts";
import { streamSSE } from "https://deno.land/x/hono@v3.12.10/helper/streaming/index.ts";

const app = new Hono();
let i = 0;

app.get("/", serveStatic({ path: "./index.html" }));

app.get("/counter", (c) => {
  return streamSSE(c, async (stream) => {
    while (true) {
      const message = `time: ${new Date().toLocaleTimeString()}`;
      await stream.writeSSE({
        data: message,
        event: "update",
        id: String(i++),
      });
      await stream.sleep(1000); // 2s delay
    }
  });
});

Deno.serve(app.fetch);
