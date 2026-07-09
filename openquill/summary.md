# Project Summary - SecureTicket CW2

## Current State

### Application Status: **FEATURE COMPLETE**
All core features implemented and tested:
- ✅ User authentication (register, login, logout, email verification)
- ✅ Password security (strength meter, history, expiry, bcrypt)
- ✅ Account lockout (rate limiting + automatic lockout)
- ✅ Multi-factor authentication (email OTP, 5-min expiry)
- ✅ Role-based access control (user, organizer, admin)
- ✅ Event management (CRUD, publish, organizer ownership)
- ✅ Ticket purchasing (Stripe PaymentElement, atomic reservation)
- ✅ QR code tickets (UUID, Level H error correction)
- ✅ Admin panel (users, logs, dashboard stats)
- ✅ Security headers (CSP, HSTS, frame options, etc.)
- ✅ Activity logging (all auth events + key actions)
- ✅ Intentional vulnerabilities for pentest (3x IDOR, 1x XSS vector)

### Vulnerabilities Verified Working
| ID | Type | Endpoint | Test Status |
|----|------|----------|-------------|
| V1 | IDOR | `GET /orders/{id}` | ✅ User A sees User B's order |
| V2 | IDOR | `GET /tickets/{id}` | ✅ User A sees User B's ticket + QR |
| V3 | AuthZ Bypass | `GET /events/{id}/edit` | ✅ Any auth user loads edit form |
| V4 | XSS | Event description | ✅ React escapes (defense demo) |

### Test Accounts Ready
```bash
# User A (Attacker)
usera@test.com / SecurePass123!

# User B (Victim - has orders/tickets)
userb@test.com / SecurePass123!

# Organizer (for XSS test)
organizer@test.com / SecurePass123!

# Admin
admin@test.com / SecurePass123!
```

### Database Schema: Finalized
- `users` (with security fields: role, mfa_secret, mfa_enabled, password_history, lockout, expiry)
- `events` (organizer_id, title, description, venue, event_date, price, tickets, status)
- `orders` (user_id, event_id, quantity, amount, stripe_payment_id, status)
- `tickets` (event_id, user_id, order_id, qr_code, status)
- `otp_codes` (user_id, code, expires_at, used)
- `activity_logs` (user_id, action, ip, user_agent, metadata)
- `sessions` (database driver)
- `password_reset_tokens`, `cache`, `jobs` (Laravel defaults)

### Code Quality
- Laravel 11 modern syntax (PHP 8.3 attributes, closures)
- Inertia.js 2.0 with React 18 (functional components, hooks)
- Strict TypeScript-ready prop validation (via Inertia)
- Component-based UI (GlassCard, Button, Form components)
- Service layer for payments (Stripe) and OTP
- Middleware for cross-cutting concerns (security, auth checks, logging)

---

## Report Generation Requirements

### Target Output: Google Docs
- **Format**: Formal academic report (CU Harvard/APA citations)
- **Structure**: 12 sections per ReportFormat.md
- **References**: Minimum 15 (books, papers, OWASP, standards, vendor docs)
- **Evidence**: Screenshots for all 16 key pages + 4 vulnerability PoCs
- **Captions**: Each screenshot labeled with page, purpose, vulnerability reference

### Screenshots Needed (16 Pages + 4 PoC)

| # | Page | Route | Component | Caption Tag |
|---|------|-------|-----------|-------------|
| 1 | Homepage | `/` | Welcome.jsx | [FIG 1] |
| 2 | Events List | `/events` | Events/Index.jsx | [FIG 2] |
| 3 | Event Detail | `/events/{id}` | Events/Show.jsx | [FIG 3] |
| 4 | Login | `/login` | Auth/Login.jsx | [FIG 4] |
| 5 | Register + Strength | `/register` | Auth/Register.jsx | [FIG 5] |
| 6 | Dashboard | `/dashboard` | Dashboard.jsx | [FIG 6] |
| 7 | Profile + MFA | `/profile` | Profile/Edit.jsx | [FIG 7] |
| 8 | MFA Verify | `/mfa/verify` | Auth/MfaVerify.jsx | [FIG 8] |
| 9 | Create Event | `/events/create` | Events/Create.jsx | [FIG 9] |
| 10 | **Edit Event (V3)** | `/events/{id}/edit` | Events/Edit.jsx | [FIG 10] [VULN: V3] |
| 11 | Checkout | `/checkout` | Orders/Checkout.jsx | [FIG 11] |
| 12 | **Order Show (V1)** | `/orders/{id}` | Orders/Show.jsx | [FIG 12] [VULN: V1] |
| 13 | **Ticket + QR (V2)** | `/tickets/{id}` | Tickets/Show.jsx | [FIG 13] [VULN: V2] |
| 14 | Admin Dashboard | `/admin` | Admin/Dashboard.jsx | [FIG 14] |
| 15 | Admin Users | `/admin/users` | Admin/Users.jsx | [FIG 15] |
| 16 | Admin Logs | `/admin/logs` | Admin/Logs.jsx | [FIG 16] |

### Vulnerability PoC Screenshots
| PoC | Vulnerability | Steps | Caption |
|-----|--------------|-------|---------|
| P1 | V1 IDOR Orders | Burp intercept `/orders/1` → change to `/orders/2` (User B) | [FIG 17] V1 PoC |
| P2 | V2 IDOR Tickets | Direct navigation `/tickets/{userB_ticket_id}` | [FIG 18] V2 PoC |
| P3 | V3 Event Edit | Regular user → `/events/1/edit` → form loads → change title | [FIG 19] V3 PoC |
| P4 | V4 XSS Attempt | Organizer → create event with `<script>alert('XSS')</script>` → view | [FIG 20] V4 PoC |

---

## References to Include (15+)

### Books (3+)
1. Stuttard, D. and Pinto, M. (2023) *The Web Application Hacker's Handbook*, 3rd edn. Wiley.
2. Howard, M., LeBlanc, D. and Viega, J. (2010) *24 Deadly Sins of Software Security*. McGraw-Hill.
3. Seacord, R.C. (2013) *Secure Coding in C and C++*, 2nd edn. Addison-Wesley.

### Research Papers (3+)
4. Jovanovic, N., Kruegel, C. and Vigna, G. (2006) 'Pixy: A Static Analysis Tool for Detecting Web Application Vulnerabilities', *IEEE Symposium on Security and Privacy*.
5. Halfond, W.G.J., Viegas, J. and Orso, A. (2006) 'A Classification of SQL Injection Attacks and Countermeasures', *IEEE ISSRE*.
6. Krsul, I. (1998) 'Software Vulnerability Analysis', *PhD Thesis, Purdue University*.

### OWASP Documentation (3+)
7. OWASP Foundation (2021) *OWASP Top 10 2021*. https://owasp.org/Top10/
8. OWASP Foundation (2023) *OWASP Authentication Cheat Sheet*. https://cheatsheetseries.owasp.org/
9. OWASP Foundation (2023) *OWASP Session Management Cheat Sheet*. https://cheatsheetseries.owasp.org/

### Security Standards (2+)
10. NIST (2017) *SP 800-63B: Digital Identity Guidelines - Authentication and Lifecycle Management*.
11. PCI Security Standards Council (2022) *PCI DSS v4.0: Requirements and Security Assessment Procedures*.

### Vendor/Framework Documentation (4+)
12. Laravel Framework (2024) *Laravel 11.x Documentation - Security*. https://laravel.com/docs/11.x/security
13. Stripe (2024) *Stripe Security Guide*. https://stripe.com/docs/security
14. Mozilla (2024) *Content Security Policy (CSP) - MDN Web Docs*. https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
15. zxcvbn (2016) *Dropbox Tech Blog: zxcvbn: Realistic Password Strength Estimation*. https://dropbox.tech/security/zxcvbn-realistic-password-strength-estimation

---

## Next Actions
1. Capture all 20 screenshots (16 pages + 4 PoCs)
2. Write full report content in Google Docs
3. Insert screenshots with captions
4. Format references (CU Harvard)
5. Export PDF + share Google Doc link
6. Record 6-minute demonstration video
7. Final submission