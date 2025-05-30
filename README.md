# Persoon

A CLI tool for generating user personas with auto-generated bearer tokens, designed for both development and production environments.

## Installation

```bash
npm install -g persoon  # For global CLI usage
# OR
npm install persoon    # As project dependency
```

## Usage

### 1. Initialize Project

```bash
npx persoon init
```

Creates the base structure:

```bash
your-project/
└── persoon/
    ├── schema/
    │   └── user.ts    # TypeScript interface
    └── users/         # Generated JSON files
```

### 2. Create Users

```bash
npx persoon create
```

Interactively creates a new user JSON file with:

- Required fields: `firstName`, `lastName`

- Optional fields: `email`, `phone`, etc.

- Auto-generated `token`

### 3. Customize User Schema

Edit `persoon/schema/user.ts` to modify fields:

```javascript
interface User {
  firstName: string; // Required
  lastName: string; // Required
  email?: string; // Optional
  phone?: string; // New optional field
  token?: string; // Auto-generated
}

export default User;
```

Now if you run `npx persoon create`, you will be prompted to enter a value for `phone`.

## Authentication

### Token Verification

```javascript
import { verifyToken } from "persoon/auth";

const { valid, user } = verifyToken(token);
if (valid) {
  console.log("Authenticated user:", user);
}
```

## Integration Examples

### Next.js

#### Authentication Check in `src/middleware.ts`

```javascript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Array of public paths that do not require authentication
  const publicPaths = ["/login", "/signup", "/forgot-password"];

  // If it's a public path, skip checking for auth token
  if (publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Assuming the token is saved as a cookie named 'authToken'
  const authToken = request.cookies.get("authToken")?.value;

  // If no authToken and not already going to login, redirect to login
  if (!authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Otherwise, continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
```

#### Auth Hook

The following example assumes that you're using Auth0 in production.

```javascript
"use client";

import { useUser as useAuth0User } from "@auth0/nextjs-auth0";
import { getUser as getPersoon } from "persoon/auth";
import { useEffect, useState } from "react";

export const useAuthUser = () => {
  const [user, setUser] = (useState < any) | (null > null);
  const [isLoading, setIsLoading] = useState(true);

  // Auth0 implementation for production
  const { user: auth0User, isLoading: auth0Loading } = useAuth0User();

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      if (!auth0Loading) {
        setUser(
          auth0User
            ? {
                firstName:
                  auth0User.given_name || auth0User.name?.split(" ")[0] || "",
                lastName:
                  auth0User.family_name ||
                  auth0User.name?.split(" ").slice(1).join(" ") ||
                  "",
                email: auth0User.email || "",
                iat: auth0User.iat?.toString(),
                exp: auth0User.exp?.toString(),
              }
            : null
        );
        setIsLoading(false);
      }
    } else {
      // Dev implementation with persoon/auth
      setIsLoading(true);
      try {
        const authToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("authToken="))
          ?.split("=")[1];

        const { user: persoonUser } = getPersoon(authToken ?? "");
        setUser(persoonUser);
      } catch (error) {
        console.error("Error getting dev user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
  }, [auth0User, auth0Loading]);

  return { user, isLoading };
};
```
