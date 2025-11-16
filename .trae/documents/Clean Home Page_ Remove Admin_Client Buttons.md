## Goal
Index (home) page should not show Admin/Client buttons or their sections; keep it as a pure landing page. Auth pages remain separate.

## Changes
- Update `app/page.tsx`:
  - Remove the two portal cards linking to `/admin` and `/client` (lines 26–69).
  - Remove any admin/client-specific sections within the same grid (only keep the hero and features blocks).
  - Keep the existing hero header and the three feature highlights (lines 71–99).

## Header Navigation (Options)
- Option A (minimal): Keep current header nav in `app/layout.tsx` as-is (links to `/admin` and `/client`). Only the index page content changes.
- Option B (cleaner homepage): On `/` only, hide the header nav or replace it with `Login` and `Signup` links to keep landing focused. This involves conditional rendering in `app/layout.tsx` based on pathname.

## Verification
- Run a production build to confirm no errors.
- Manually open `/` to ensure only landing content is visible; ensure `/admin` and `/client` still work via direct URLs or header nav (per chosen option).

## Notes
- No routing logic changes required; only UI content updates on the home page.
- If you prefer Option B, I’ll implement conditional header nav for the homepage and keep admin/client accessible via their dedicated pages or via auth flows.

Please confirm whether you want Option A or Option B for the header. Once confirmed, I’ll implement and verify the build.