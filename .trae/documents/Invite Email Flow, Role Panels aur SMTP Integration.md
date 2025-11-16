## System Analysis
- Landing page alag aur clean hai: `app/page.tsx:26` par Admin/Client ke CTAs.
- Login/Signup alag routes par maujood: `app/auth/page.tsx:5`, `app/login/page.tsx:5`, `app/signup/page.tsx:5`; main page par auth nahi aata.
- Client panel: `app/client/page.tsx` — Google OAuth optional (`components/ClientProviders.tsx:10`) aur client ke quotations filter (`app/client/page.tsx:12`).
- Admin panel: `app/admin/page.tsx` — quotations create/update, features add/remove, totals, PDF export.
- Quotations logic: `context/QuotationContext.tsx` — create (`123`), update (`145`), negotiation (`198`), status set (`210`).
- Client activity/history: `context/ClientContext.tsx` — login (`58`), logAction (`72`).
- Email/SMTP abhi nahi hai; axios mock (`utils/axios.ts:7`), PDF export hai (`components/ExportButtons.tsx:9`, `utils/pdf.ts`).

## Aapki Requirements Mapping
- Separate landing + separate auth: already done.
- Admin aur Client ke alag panels: already done (routing se). Role gating abhi basic hai, RBAC guard add karenge.
- Admin clients/quotations multiple: supported (client select `app/admin/page.tsx:141`).
- Invite-by-email, accept ke baad hi quotation dikhna: pending — implement karenge.
- Google SMTP se mailing: pending — implement karenge (secure env ke sath).

## Implementation Plan
- Auth/RBAC guard
  - Client pages par visible quotations already filter ho rahe (`app/client/page.tsx:12`).
  - Light RBAC: Admin features sirf `/admin` par; Client view sirf `/client` par. Simple guards add karenge ke without login client detail par “Invite/Access Required” aaye.
- Invite Email Flow (Admin → Client)
  - Admin panel me “Invite Client” button add (quotation card/action area).
  - Invite modal: client email, optional message.
  - Serverless API route `app/api/invite/route.ts`: `nodemailer` se Gmail SMTP par email bhejega.
  - Per‑quotation `inviteToken` generate karein (UUID) + `status: "sent"` set karein (`context/QuotationContext.tsx`).
  - Email link: `https://<domain>/client/<quotationId>?token=<inviteToken>`.
- Client Acceptance Flow
  - `app/client/[id]/page.tsx` par token read karein; agar `token !== inviteToken` tu “Access Required” banner dikhe.
  - “Accept” action existing hai (`app/client/[id]/page.tsx:48`); accept par `status: "accepted"` set hota hai.
  - Acceptance ke baad client history me log (`context/ClientContext.tsx:72`).
- Visibility Rules
  - Client index par: agar login hai tu sirf `clientId === currentClient.id` quotations (`app/client/page.tsx:12`).
  - Detail page par: token/assignment validate; warna restricted message.
- UI Updates
  - Admin: Invite button + status badges already (`app/admin/page.tsx:245`), email bhejne ke baad toast.
  - Client: Detail me “Access Required” notice jab token/assignment missing.
- PDF/Export unchanged, already kaam kar raha.

## Technical Steps
- Dependencies: `nodemailer` add karenge (server only).
- API Route: `app/api/invite/route.ts` — POST `{ quotationId, email }` → token create, quotation status “sent”, email send.
- Env Secrets: `.env.local` me `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` set; Gmail ke liye App Password use karein. Plain password commit nahi hoga.
- Token Storage: `Quotation` me fields add karenge: `inviteToken?: string`, `inviteEmail?: string`, `invitedAt?: number`.
- Client Validation: `client/[id]/page.tsx` me `searchParams.token` compare karein; agar mismatch tu block.

## Security
- Gmail ke sath recommended way: 2FA + App Password; `.env.local` me rakhein. Repo/console me kabhi password/logs expose nahi karenge.
- API route server‑only; client bundle me SMTP secrets nahi jayenge.

## Milestones
- M1: Nodemailer + API route (invite email bhejna).
- M2: Quotation model extension + Admin UI me Invite.
- M3: Client token validation + restricted view.
- M4: Light RBAC guards + landing polish if needed.

## Deliverables
- Working email invites via Gmail SMTP.
- Tokenized links; accept/decline history & status updates.
- Separate landing + auth, role‑specific panels maintained.

Agar aap confirm karein tu isi plan par implement kar deta hoon (env me SMTP set karke).