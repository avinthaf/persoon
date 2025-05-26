# Persoon

Generate user structures with auto-generated bearer tokens.

## Installation
```bash
npm install -g persoon
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
import { getUser } from 'persoon/auth';

const result = getUser(token);
if (result.valid) {
  console.log(result.user);
}