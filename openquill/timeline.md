# Timeline (Development & Testing Milestones)

## Phase 1: Foundation (Week 1-2)
- [x] Laravel 11 project initialization
- [x] PostgreSQL database setup
- [x] Laravel Breeze + Inertia.js + React scaffolding
- [x] Tailwind CSS configuration
- [x] Basic routing structure
- [x] User model with security fields migration

## Phase 2: Authentication & Security Core (Week 2-3)
- [x] Registration with zxcvbn password strength meter
- [x] Login with rate limiting (5/min/IP+email)
- [x] Account lockout after 5 failures (30 min)
- [x] Password history (last 5) enforcement
- [x] Password expiry (90 days) with forced change middleware
- [x] Email verification (Laravel default)
- [x] Session security configuration (HttpOnly, Secure, SameSite=Strict, DB driver)

## Phase 3: Multi-Factor Authentication (Week 3)
- [x] OTP model (6-digit, 5-min expiry, single-use)
- [x] OtpService (generate, verify, email delivery)
- [x] MFA Controller (enable, disable, verify, resend)
- [x] Login flow integration (redirect to MFA verify)
- [x] Profile page MFA toggle
- [x] MFA Verify page (6-digit input, auto-focus, resend)

## Phase 4: Role-Based Access Control (Week 3-4)
- [x] Role field on User (user, organizer, admin)
- [x] RoleMiddleware (supports multiple roles)
- [x] Admin routes group with `role:admin`
- [x] Organizer routes with `role:organizer,admin`
- [x] Admin Panel: Dashboard, Users, Logs
- [x] User management: role change, lock/unlock, delete (self-protection)

## Phase 5: Event Management (Week 4)
- [x] Event model (organizer, title, description, venue, date, price, tickets, status)
- [x] Organizer: create, edit, publish, my-events
- [x] Public: index, show (with purchase form)
- [x] Authorization: owner/admin only for edit/publish/destroy
- [x] Status enum: draft, published, cancelled

## Phase 6: Ticketing & Payments (Week 4-5)
- [x] Order model (user, event, quantity, amount, stripe_id, status)
- [x] Ticket model (event, user, order, qr_code, status)
- [x] Stripe PaymentService (PaymentIntent create/confirm)
- [x] Checkout page with Stripe PaymentElement
- [x] Atomic ticket reservation (DB raw update with check)
- [x] QR code generation (UUID v4, bacon-qr-code)
- [x] Order confirmation page with ticket list
- [x] Ticket detail page with QR code display (qrcode.react)

## Phase 7: Security Hardening (Week 5)
- [x] SecurityHeaders middleware (CSP, HSTS, X-Frame-Options, etc.)
- [x] ActivityLogger middleware (all auth requests)
- [x] CheckAccountLockout middleware
- [x] CheckPasswordExpiry middleware
- [x] Referrer-Policy, Permissions-Policy
- [x] Server/X-Powered-By header removal

## Phase 8: Intentional Vulnerabilities (Week 5)
- [x] V1: IDOR on Order show (missing ownership check)
- [x] V2: IDOR on Ticket show (missing ownership check)
- [x] V3: Event edit accessible without role check on GET
- [x] V4: XSS vector in event description (React escapes)

## Phase 9: Testing & Documentation (Week 6)
- [x] Test account creation (User A, User B, Organizer, Admin)
- [x] Penetration testing script (To Do.txt)
- [x] Video recording plan (6 min: 2 walkthrough + 4 vulns)
- [ ] Report writing (this document)
- [ ] Google Doc generation
- [ ] Screenshot capture for all 16 key pages
- [ ] Reference compilation (15+ sources)

## Phase 10: Submission (Week 6-7)
- [ ] Final report review
- [ ] Video editing & compression
- [ ] Repository cleanup
- [ ] Submission package assembly

---

## Key Milestones

| Date | Milestone |
|------|-----------|
| Day 1 | Project init, DB, Breeze + Inertia |
| Day 7 | Auth complete (reg, login, lockout, pwd history/expiry) |
| Day 10 | MFA complete (OTP email, verify flow, profile toggle) |
| Day 14 | RBAC + Admin panel functional |
| Day 18 | Events CRUD + public browsing |
| Day 22 | Stripe checkout + QR tickets |
| Day 25 | Security headers + activity logging |
| Day 28 | Vulnerabilities verified + test accounts ready |
| Day 35 | Report + video + submission ready |

---

## Penetration Testing Schedule (Video Recording)

### Part 1: App Walkthrough (2 min)
1. Login page → show rate limit / lockout
2. Register → show password strength meter
3. Login → dashboard
4. Browse events
5. Buy ticket → Stripe checkout
6. Order confirmation
7. Ticket with QR code
8. Profile → MFA toggle
9. Enable MFA → logout → login → OTP flow

### Part 2: Vulnerability Demos (4 min)
1. **V1 IDOR Orders**: User A → own order → Burp → change ID → User B's order loads
2. **V2 IDOR Tickets**: User A → `/tickets/{userB_ticket_id}` → loads ticket + QR
3. **V3 IDOR Event Edit**: User A (regular) → `/events/1/edit` → form loads → change title → saves
4. **V4 XSS Attempt**: Organizer → create event with `<script>alert('XSS')</script>` → view → no alert (React escapes)

---

## Current Status (as of report writing)
- ✅ All code complete
- ✅ Vulnerabilities verified working
- ✅ Test accounts documented
- ✅ Report structure defined (this file)
- ⏳ Screenshots needed (16 pages)
- ⏳ Report content writing (in progress)
- ⏳ Google Doc upload
- ⏳ Video recording