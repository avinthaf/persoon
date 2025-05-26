# Persoon

Generate user structures with auto-generated bearer tokens.

## Installation

```bash
npm install persoon
```

## Usage

```bash
# Initialize project
npx persoon init

# Create new user
npx persoon create
```

### Decoding Tokens

```javascript
import { getUser } from "persoon/auth";

const result = getUser(token);
if (result.valid) {
  console.log(result.user);
}
```

### Example Usage in Next.js

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
