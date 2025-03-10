---
description: |
  Error pages can be used to customize the page that is shown when an error occurs in the application.
---

Fresh supports customizing the `404 Not Found`, and the
`500 Internal Server Error` pages. These are shown when a request is made but no
matching route exists, and when a middleware, route handler, or page component
throws an error respectively.

### 404: Not Found

The 404 page can be customized by creating a `_404.tsx` file in the `routes/`
folder. The file must have a default export that is a regular Preact component.
A props object of type `UnknownPageProps` is passed in as an argument.

```tsx
import { UnknownPageProps } from "$fresh/server.ts";

export default function NotFoundPage({ url }: UnknownPageProps) {
  return <p>404 not found: {url.pathname}</p>;
}
```

#### Manually render 404 pages

The `_404.tsx` file will be invoked automatically when no route matches the URL.
In some cases, one needs to manually trigger the rendering of the 404 page, for
example when the route did match, but the requested resource does not exist.
This can be achieved with `ctx.renderNotFound`.

```tsx
import { MultiHandler, PageProps } from "$fresh/server.ts";

export const handler: MultiHandler = {
  async GET(req, ctx) {
    const blogpost = await fetchBlogpost(ctx.params.slug);
    if (!blogpost) {
      return ctx.renderNotFound({
        custom: "prop",
      });
    }
    return ctx.render({ blogpost });
  },
};

export default function BlogpostPage({ data }) {
  return (
    <article>
      <h1>{data.blogpost.title}</h1>
      {/* rest of your page */}
    </article>
  );
}
```

### 500: Internal Server Error

The 500 page can be customized by creating a `_500.tsx` file in the `routes/`
folder. The file must have a default export that is a regular Preact component.
A props object of type `ErrorPageProps` is passed in as an argument.

```tsx
import { ErrorPageProps } from "$fresh/server.ts";

export default function Error500Page({ error }: ErrorPageProps) {
  return <p>500 internal error: {(error as Error).message}</p>;
}
```
