# SecureTicket - Security Coursework 2 (CW2)

## Project Overview
**SecureTicket** is a Laravel 11 + Inertia.js (React) event ticketing platform developed as coursework for a Security module (CW2). The application demonstrates secure development practices and intentionally includes vulnerabilities for penetration testing demonstration.

## Technology Stack
- **Backend**: Laravel 11 (PHP 8.3)
- **Frontend**: React 18 + Inertia.js 2.0
- **Styling**: Tailwind CSS 3.4 + custom glass-morphism UI components
- **Database**: PostgreSQL
- **Authentication**: Laravel Breeze + custom MFA (email OTP)
- **Payments**: Stripe (test mode)
- **QR Codes**: bacon/bacon-qr-code
- **Password Strength**: zxcvbn
- **Session**: Database-backed with strict security config
- **Security Headers**: Custom middleware (CSP, HSTS, X-Frame-Options, etc.)

## Core Features

### User Management
- Registration with **zxcvbn password strength meter** (min 12 chars, mixed case, numbers, symbols, uncompromised)
- Login with **rate limiting** (5 attempts/min/IP+email)
- **Account lockout** after 5 failed attempts (30 min)
- **Password expiry** (90 days) with forced change
- **Password history** (last 5 passwords cannot be reused)
- **Email verification** (Laravel default)

### Multi-Factor Authentication (MFA)
- **Email-based 6-digit OTP** (expires in 5 minutes)
- Enable/disable from Profile page
- OTP sent on every login when MFA enabled
- Resend capability

### Role-Based Access Control (RBAC)
- **user** - Default role, can buy tickets
- **organizer** - Can create/manage own events
- **admin** - Full admin panel access
- Middleware: `role:admin`, `role:organizer,admin`

### Event Management
- Organizers create events (draft → publish)
- Ticket pricing, quantity, venue, date/time
- Status: draft, published, cancelled
- Organizer can edit own events (or admin any)

### Ticket Purchase Flow
1. Browse published events
2. Select quantity
3. **Stripe Checkout** (PaymentElement) - card details never touch server
4. Order created with atomic ticket reservation
5. **QR codes generated** (UUID) per ticket
6. Email confirmation (not implemented but logged)

### Ticket Management
- View purchased tickets with QR codes
- QR code rendered via `qrcode.react` (level H, 140px)
- Ticket status: valid, used, cancelled
- Order history with status tracking

### Admin Panel
- Dashboard: stats (users, events, orders, revenue)
- User management: search, role change, lock/unlock, delete
- Activity logs: filterable, paginated (action, user, IP, time)
- Self-protection: admin cannot demote/lock/delete self

### Security Features Implemented
- **Security Headers Middleware**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Session Security**: HttpOnly, Secure (in prod), SameSite=Strict, database storage, JSON serialization
- **CSRF Protection**: Laravel default + Inertia
- **Rate Limiting**: Login attempts, password reset, email verification
- **Activity Logging**: All auth events, orders, profile changes, MFA toggles
- **Account Lockout**: Middleware checks on every request
- **Password Expiry**: Middleware enforces 90-day rotation

## Intentional Vulnerabilities (For Penetration Testing)

| Vuln | Type | Location | Impact |
|------|------|----------|--------|
| **V1** | IDOR | `OrderController::show()` - only checks `user_id` | User A can view User B's order |
| **V2** | IDOR | `TicketController::show()` - only checks `user_id` | User A can view User B's ticket + QR |
| **V3** | IDOR / Missing Authz | `EventController::edit()` - route accessible without role check | Any authenticated user can edit any event |
| **V4** | XSS (Attempted) | Event description - stored XSS via `<script>alert('XSS')</script>` | React JSX escaping prevents execution (remediation demo) |

## Report Requirements (CW2)
Following formal academic structure:
1. Cover page
2. Abstract
3. Table of contents
4. Table of figures
5. Table of abbreviations
6. Introduction
7. Software details
8. Design and implementation
9. Secure development and penetration testing
10. Proof of concept
11. Conclusion
12. References (min 15: books, papers, OWASP, standards, vendor docs)

## Evidence Requirements
- Clear, readable screenshots
- Deterministic, repeatable demonstrations
- Burp Suite interception for IDOR demos
- Screenshots of each vulnerability exploitation

## Deliverables
- Written report (PDF/Google Doc)
- Video demonstration (6 min: 2 min walkthrough + 4 min vuln demos)
- Source code repository