# List of Fullstack Libraries

## Next.JS

- [Documentation](https://nextjs.org/docs)

A full-stack framework for React that makes building web applications much easier. UTD Clubs uses Next.JS's App Router, which handles page routing, faster page navigation loading, and much more.

- The `src/app/` directory maps files and folders to the routes in the Clubs website. For example, `src/app/page.tsx` maps to the [homepage](https://clubs.utdnebula.com) and `src/app/club-match/page.tsx` maps to the [club match](https://clubs.utdnebula.com/club-match) page. [_...more info_](https://nextjs.org/docs/app/getting-started/project-structure)
- Next.JS handles running files/components either on the client (the device of the user accessing the website) or the server (our backend). This is incredibly useful for caching and server-side rendering, which generally improves how fast the website loads. [_...more info_](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- The `public/` directory contains images and resources that are made available by Next.JS to the website. [_...more info_](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder)

We also use Next.JS for several other things, including: [SEO metadata](https://nextjs.org/docs/app/getting-started/metadata-and-og-images), [Open Graph preview images](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image), [prefetching](https://nextjs.org/docs/app/getting-started/linking-and-navigating#prefetching), [API route handling](https://nextjs.org/docs/app/getting-started/route-handlers), and [deployment](https://nextjs.org/docs/app/getting-started/deploying). These are features you generally don't need to worry about unless you're specifically working on an issue for one of them.

## tRPC

- [Documentation](https://trpc.io/docs)

<!-- TODO -->

## Better Auth

- [Documentation](https://better-auth.com/docs)

<!-- TODO -->
