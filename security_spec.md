# Security Specification — King Pro Digital (`/empresasparceiras`)

## 1. Data Invariants
1. Every document in `/partner_companies/{companyId}` MUST have a valid alphanumeric/hyphen/underscore `companyId` (`^[a-zA-Z0-9_\-]+$`, max 128 chars).
2. Public visitors may read partner company directory listings (`get` and `list`), while `create`, `update`, and `delete` operations on `/partner_companies/{companyId}` are strictly restricted to the verified owner administrator (`request.auth != null`, `request.auth.token.email_verified == true`, and either `request.auth.token.email == 'contatokingprodigital@gmail.com'` or an existing `/admins/$(request.auth.uid)` record).
3. Every `create` and `update` must satisfy `isValidPartnerCompany(incoming())` with strict key whitelisting (`hasAll` + `hasOnly` on create, `affectedKeys().hasOnly(...)` on update), strict type checks, and explicit string `.size()` bounds (`logoUrl <= 500000`, `name <= 120`, etc.).
4. `ownerId` and `createdAt` are immutable after creation (`incoming().ownerId == existing().ownerId && incoming().createdAt == existing().createdAt`).
5. Timestamps `createdAt` (on create) and `updatedAt` (on create and update) MUST equal `request.time`.
6. The `/admins/{adminId}` collection is never writable from client SDKs (`allow write: if false`).

## 2. The "Dirty Dozen" Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Create**: Unauthenticated user attempts `POST /partner_companies/comp1` with valid data.
2. **Non-Admin Authenticated Create**: Authenticated user `attacker@gmail.com` (`email_verified: true`) attempts to create a partner company.
3. **Email Spoofing Attack**: Authenticated user with `email: 'contatokingprodigital@gmail.com'` and `email_verified: false` attempts to create or update a company.
4. **Shadow / Ghost Field Injection**: Admin sends `{ ...validCompany, isFeatured: true, role: 'superadmin' }`.
5. **OwnerId Spoofing on Create**: Admin attempts to set `ownerId: 'someone-else'` instead of `request.auth.uid`.
6. **Immutable OwnerId Mutation on Update**: Admin attempts to change `ownerId` during an update.
7. **Immutable CreatedAt Mutation on Update**: Admin attempts to alter `createdAt` during an update.
8. **Client-Forged Timestamp**: Admin sends a static Date for `createdAt` or `updatedAt` instead of `request.time`.
9. **Resource Poisoning (Oversized ID)**: Admin attempts to create `/partner_companies/<200-char-id>` or invalid characters in `companyId`.
10. **Value Poisoning (Invalid Type / Oversized Name)**: Admin sends `name: 12345` or `name` of 500 characters or invalid `logoBg: 'rainbow'`.
11. **Non-Admin Delete**: Authenticated non-admin user attempts to delete `/partner_companies/comp1`.
12. **Privilege Escalation on `/admins`**: Attacker attempts to write `/admins/<attackerUid>` to grant themselves admin privileges.
