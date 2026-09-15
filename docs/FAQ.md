# Frequently Asked Questions

## Where to import...?

### `api`

Accesses the tRPC API, allowing you to call server-side procedures from either the client or server.

<table>
<tr>
<th>Client</th>
<th>Server</th>
</tr>
<tr>
<td>

_Recommended:_

```tsx
import { useTRPC } from '@/trpc/react';

// A React Client Component
function Component() {
  const api = useTRPC();

  // ...
}
```

_Or (doesn't work yet):_

```ts
// Using the singleton pattern
import { trpc as api } from '@/trpc/server';
```

</td>
<td>

```ts
import { api } from '@/trpc/server';
```

</td>
</tr>
</table>

### `db`

Accesses the database using Drizzle, allowing you to call queries and mutations on the database. **This only works on the server (for security)!**

<table>
<tr>
<th>Client</th>
<th>Server</th>
</tr>
<tr>
<td>

_Not possible!_

</td>
<td>

```ts
import { db } from '@/server/db';
```

</td>
</tr>
</table>

### `auth`

The Better Auth configuration. Grants access to managing the logged in user and their account.

<table>
<tr>
<th>Client</th>
<th>Server</th>
</tr>
<tr>
<td>

```ts
import { authClient } from '@/lib/utils/auth-client';
```

</td>
<td>

```ts
import { auth } from '@/server/auth';
```

</td>
</tr>
</table>

### `session`

Accesses information and data related to the currently logged in user and their account.

<table>
<tr>
<th>Client</th>
<th>Server</th>
</tr>
<tr>
<td>

_Recommended:_

```tsx
import { authClient } from '@/lib/utils/auth-client';

// A React Client Component
function Component() {
  const { data: session } = authClient.useSession();

  // ...
}
```

_Or (not recommended because this isn't reactive):_

```ts
import { authClient } from '@/lib/utils/auth-client';

const { data: session } = authClient.getSession();
```

</td>
<td>

```ts
// headers contain the user's session token
import { headers } from 'next/headers';
import { auth } from '@/server/auth';

const session = await auth.api.getSession({
  headers: await headers(),
});
```

</td>
</tr>
</table>

### `searchParams`

Accesses the query parameters in the webpage URL (e.g. `?q=Nebula` or `?page=2`)

<table>
<tr>
<th>Client</th>
<th>Server</th>
</tr>
<tr>
<td>

_Recommended:_

```tsx
import { useSearchParams } from 'next/navigation';

// A React Client Component
function Component() {
  // Untyped ReadonlyURLSearchParams object
  const searchParams = useSearchParams();

  // ...
}
```

_Or (not recommended because this isn't reactive):_

```ts
// Untyped URLSearchParams object
const searchParams = new URLSearchParams(window.location.search);
```

</td>
<td>

_See [Next.JS's documentation](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional)_

_Generic searchParams example:_

```tsx
// Any page.tsx file in `src/app/`
export default async function Page(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Mapped object typed as `Record<string, string | string[] | undefined>`
  const searchParams = await props.searchParams;

  // ...
}
```

_searchParams with schema example:_

```tsx
type TypedSearchParams = {
  q?: string;
  tag?: string | string[];
};

// Any page.tsx file in `src/app/`
export default async function Page(props: {
  searchParams: Promise<TypedSearchParams>;
}) {
  // Mapped object typed as `TypedSearchParams`
  const searchParams = await props.searchParams;

  // ...
}
```

</td>
</tr>
</table>
