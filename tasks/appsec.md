# Fitrams — Application Security Referential

> All code generation must comply with these rules. No exceptions.

## 1. Transport Security
- All communications must be encrypted (HTTPS/TLS only)
- No plaintext endpoints in any environment

## 2. API Contract
- JSON only for all request and response bodies
- **No parameters passed via query string** — all data goes in the JSON body
- Content-Type must be `application/json` on all API calls

## 3. Session Management
- Sessions are managed **server-side only** (e.g., server-side session store)
- No sensitive session data stored in cookies, localStorage, or sessionStorage on the client
- Session tokens must be HttpOnly, Secure, SameSite=Strict cookies

## 4. Request Validation Interceptor
- A middleware/interceptor must validate the legitimacy of every request before it reaches any handler
- This includes: authentication check, authorization check, input schema validation
- Reject and log any request that fails validation — never pass it through

## 5. Password Hashing
- All passwords must be hashed using **Argon2** (argon2id variant preferred)
- Never store plaintext or weakly-hashed passwords
- Never use MD5, SHA-1, SHA-256 alone, or bcrypt for new code

## 6. Data Encryption at Rest
- When data encryption is required, use **AES-256-GCM**
- Always generate a unique IV/nonce per encryption operation
- Store IV alongside the ciphertext; never reuse IVs
