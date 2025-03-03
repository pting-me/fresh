---
description: |
  You can write HTTP tests for your Fresh project by creating an application handler.
---

You can write tests for your Fresh project by creating an application handler
through
[`createHandler()`](https://deno.land/x/fresh/server.ts?doc=&s=createHandler).

## 1. Create your routes

```tsx
// routes/index.tsx

import { MultiHandler } from "$fresh/server.ts";

export const handler: MultiHandler = {
  async POST(req) {
    const form = await req.formData();

    // Processing something

    return new Response(null, {
      status: 303,
      headers: { location: "/" },
    });
  },
};

export default function HomePage() {
  return (
    <div>
      Hello Deno!
    </div>
  );
}
```

```tsx
// routes/foo.tsx

export default function FooPage() {
  return (
    <div>
      Hello Foo!
    </div>
  );
}
```

## 2. Write your tests

```ts
// tests/main_test.ts

import { createHandler } from "$fresh/server.ts";
import manifest from "../fresh.gen.ts";
import { assert, assertEquals } from "$std/testing/asserts.ts";
import type { ConnInfo } from "$std/http/server.ts";

const CONN_INFO: ConnInfo = {
  localAddr: { hostname: "127.0.0.1", port: 8000, transport: "tcp" },
  remoteAddr: { hostname: "127.0.0.1", port: 53496, transport: "tcp" },
};

Deno.test("HTTP assert test.", async (t) => {
  const handler = await createHandler(manifest);

  await t.step("#1 GET /", async () => {
    const resp = await handler(new Request("http://127.0.0.1/"), CONN_INFO);
    assertEquals(resp.status, 200);
  });

  await t.step("#2 POST /", async () => {
    const formData = new FormData();
    formData.append("text", "Deno!");
    const req = new Request("http://127.0.0.1/", {
      method: "POST",
      body: formData,
    });
    const resp = await handler(req, CONN_INFO);
    assertEquals(resp.status, 303);
  });

  await t.step("#3 GET /foo", async () => {
    const resp = await handler(
      new Request("http://127.0.0.1/foo"),
      CONN_INFO,
    );
    const text = await resp.text();
    assert(text.includes("<div>Hello Foo!</div>"));
  });
});
```

## 3. Run the tests

```sh
$ deno test --allow-read --allow-env --allow-net
running 1 test from ./tests/main_test.ts
HTTP assert test. ...
  #1 GET / ... ok (31ms)
  #2 POST / ... ok (35ms)
  #3 GET /foo ... ok (12ms)
HTTP assert test. ... ok (118ms)

ok | 1 passed (3 steps) | 0 failed (236ms)
```
