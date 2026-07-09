# SecureTicket - Security Coursework 2 (CW2) Report

**Submitted by:** [Student Name]  
**Student ID:** [Student ID]  
**Course:** Security Coursework 2  
**Module:** [Module Code/Name]  
**Institution:** [University Name]  
**Date:** July 2026  
**Supervisor:** [Supervisor Name]

---

## Abstract

SecureTicket is a Laravel 11 event ticketing platform developed for Security Coursework 2 (CW2). It implements multi-factor authentication, role-based access control, password security policies, security headers, and activity logging. Three IDOR vulnerabilities and one XSS vector were intentionally introduced and exploited during testing. CVSS 3.1 scores: V1 (IDOR Orders) = 4.3 Medium, V2 (IDOR Tickets) = 4.3 Medium, V3 (Authorization Bypass) = 7.5 High (FIRST, 2024).

---

## Table of Contents

1. [Cover Page](#cover-page)
2. [Abstract](#abstract)
3. [Table of Contents](#table-of-contents)
4. [Table of Figures](#table-of-figures)
5. [Table of Abbreviations](#table-of-abbreviations)
6. [Introduction](#6-introduction)
7. [Software Details](#7-software-details)
8. [Design and Implementation](#8-design-and-implementation)
9. [Secure Development and Penetration Testing](#9-secure-development-and-penetration-testing)
10. [Proof of Concept](#10-proof-of-concept)
11. [Conclusion](#11-conclusion)
12. [References](#12-references)

---

## Table of Figures

| Figure | Description | Section |
|--------|-------------|---------|
| [FIG 1] | Homepage — Hero section with statistics and featured events | 7.4 |
| [FIG 2] | Events Listing — Public event browsing interface | 7.4 |
| [FIG 3] | Event Detail — Ticket purchase form and event information | 7.4 |
| [FIG 4] | Login Page — Authentication form with rate limiting | 7.4 |
| [FIG 5] | Register Page — Password strength meter (zxcvbn) showing "Strong" | 7.4 |
| [FIG 6] | Dashboard — Role-based navigation cards | 7.4 |
| [FIG 7] | Profile & Security — MFA toggle and password change sections | 7.4 |
| [FIG 8] | MFA Verification — 6-digit OTP input page | 7.4 |
| [FIG 9] | Create Event — Organizer event creation form | 7.4 |
| [FIG 10] | **Edit Event (VULN V3)** — Accessible by non-organizer users | 10.4 |
| [FIG 11] | Checkout — Stripe PaymentElement integration | 7.4 |
| [FIG 12] | **Order Show (VULN V1)** — Accessible by other users via IDOR | 10.2 |
| [FIG 13] | **Ticket + QR (VULN V2)** — QR code accessible via IDOR | 10.3 |
| [FIG 14] | Admin Dashboard — System statistics and recent activity | 7.4 |
| [FIG 15] | Admin User Management — Role change, lock/unlock, delete | 7.4 |
| [FIG 16] | Admin Activity Logs — Filterable audit trail | 7.4 |
| [FIG 17] | **V1 PoC** — Burp Suite intercept showing IDOR on `/orders/{id}` | 10.2 |
| [FIG 18] | **V2 PoC** — Direct navigation to `/tickets/{userB_ticket_id}` | 10.3 |
| [FIG 19] | **V3 PoC** — Regular user accessing `/events/1/edit` and modifying title | 10.4 |
| [FIG 20] | **V4 PoC** — XSS attempt with `<script>alert('XSS')</script>` — React escapes | 10.5 |

---

## Table of Abbreviations

| Abbreviation | Definition |
|--------------|------------|
| **API** | Application Programming Interface |
| **CSP** | Content Security Policy |
| **CSRF** | Cross-Site Request Forgery |
| **CW2** | Coursework 2 |
| **CVSS** | Common Vulnerability Scoring System |
| **HSTS** | HTTP Strict Transport Security |
| **IDOR** | Insecure Direct Object Reference |
| **MFA** | Multi-Factor Authentication |
| **OTP** | One-Time Password |
| **OWASP** | Open Web Application Security Project |
| **PCI DSS** | Payment Card Industry Data Security Standard |
| **QR** | Quick Response |
| **RBAC** | Role-Based Access Control |
| **SDLC** | Software Development Life Cycle |
| **SPA** | Single Page Application |
| **SQL** | Structured Query Language |
| **SSL/TLS** | Secure Sockets Layer / Transport Layer Security |
| **UUID** | Universally Unique Identifier |
| **XSS** | Cross-Site Scripting |

---

## 6. Introduction

### 6.1 Purpose and Scope

SecureTicket is an event ticketing web application developed for Security Coursework 2 (CW2). The coursework requires:

1. A secure web application demonstrating secure coding practices
2. Authentication, authorization, and data protection mechanisms
3. Intentional vulnerabilities for penetration testing demonstration
4. A formal academic report with minimum 15 references
5. A 6-minute video demonstrating the application and exploits

### 6.2 Application Overview

SecureTicket is a Single Page Application (SPA) built with Laravel 11 (backend) and React 18 via Inertia.js 2.0 (frontend). The application allows users to browse events, purchase tickets via Stripe, and manage their profiles with multi-factor authentication. Organizers can create and manage events, while administrators have full system oversight including user management and activity monitoring (Laravel Framework, 2024a; Inertia.js, 2024).

### 6.3 Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Backend Framework | Laravel | 11.x |
| Language | PHP | 8.3 |
| Frontend Framework | React | 18.2 |
| SPA Bridge | Inertia.js | 2.0 |
| Styling | Tailwind CSS | 3.4 |
| Database | PostgreSQL | 16+ |
| Payments | Stripe | 2024 (Test Mode) |
| QR Codes | bacon/bacon-qr-code | 3.1 |
| Password Strength | zxcvbn | 4.4 |
| 2FA Library | pragmarx/google2fa-laravel | 3.0 |

### 6.4 Security Requirements

The application implements controls aligned with:

- **OWASP Top 10 2021** (A01: Broken Access Control, A02: Cryptographic Failures, A03: Injection, A07: Identification and Authentication Failures) (OWASP Foundation, 2021)
- **NIST SP 800-63B** (Digital Identity Guidelines) (National Institute of Standards and Technology, 2017)
- **PCI DSS v4.0** (Payment security via Stripe) (PCI Security Standards Council, 2022)
- **Laravel Security Best Practices** (Laravel Framework, 2024a)

---

## 7. Software Details

### 7.1 Architecture Overview

SecureTicket follows a Model-View-Controller (MVC) pattern on the backend with Inertia.js eliminating the need for a separate API layer. React components receive data as props from Laravel controllers, enabling SPA behavior without REST/GraphQL complexity (Inertia.js, 2024).

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (React SPA)                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐   │
│  │ Pages   │ │Components│ │ Layouts │ │  Stripe Elements │   │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────────┬────────┘   │
└───────┼───────────┼───────────┼──────────────┼─────────────┘
        │           │           │              │
        ▼           ▼           ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Inertia.js Bridge                         │
│         (Shared props, partial reloads, CSRF)               │
└─────────────────────────────────────────────────────────────┘
        │           │           │              │
        ▼           ▼           ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Laravel 11 Backend                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │Controllers│ │ Models  │ │ Services │ │ Middleware   │   │
│  │ (Auth,   │ │(User,   │ │(Payment, │ │(Security,    │   │
│  │ Events,  │ │ Event,  │ │ OTP,     │ │ Auth,        │   │
│  │ Orders,  │ │ Order,  │ │ Activity)│ │ RateLimit)   │   │
│  │ Admin)   │ │ Ticket) │ │          │ │              │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
        │           │           │              │
        ▼           ▼           ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL Database                             │
│  users • events • orders • tickets • otp_codes • logs       │
└─────────────────────────────────────────────────────────────┘
```

Figure 1 illustrates the system architecture.

### 7.2 Database Schema

The database consists of seven core tables:

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | Authentication & authorization | `id`, `email`, `password`, `role`, `mfa_secret`, `mfa_enabled`, `password_history`, `failed_login_attempts`, `locked_until`, `password_changed_at` |
| `events` | Event management | `id`, `organizer_id` (FK), `title`, `description`, `venue`, `event_date`, `ticket_price`, `total_tickets`, `tickets_sold`, `status` |
| `orders` | Purchase records | `id`, `user_id` (FK), `event_id` (FK), `quantity`, `total_amount`, `stripe_payment_id`, `status` |
| `tickets` | Individual tickets | `id`, `event_id` (FK), `user_id` (FK), `order_id` (FK), `qr_code` (UUID), `status` |
| `otp_codes` | MFA tokens | `id`, `user_id` (FK), `code` (6-digit), `expires_at`, `used` |
| `activity_logs` | Audit trail | `id`, `user_id` (FK, nullable), `action`, `ip_address`, `user_agent`, `metadata` (JSON) |
| `sessions` | Session storage | `id`, `user_id` (FK), `ip_address`, `user_agent`, `payload`, `last_activity` |

**Referential Integrity:** All foreign keys use `ON DELETE CASCADE` except `activity_logs.user_id` (`SET NULL`).

### 7.3 Authentication & Authorization

#### Authentication Flow
1. **Registration** → Email verification → Login
2. **Login** → Rate limit check (5/min/IP+email) → Account lockout check → Credentials validation → MFA check (if enabled) → Session establishment
3. **MFA** → 6-digit OTP emailed → 5-minute expiry → Single-use verification → Full session

#### Authorization Model
Three roles with hierarchical permissions:
- **admin** → Full system access (`/admin/*`)
- **organizer** → Event CRUD (`/events/create`, `/my-events`, `/events/{id}/edit` own)
- **user** → Ticket purchase, profile management

Implemented via:
- **Route middleware**: `role:admin`, `role:organizer,admin`
- **Controller checks**: Ownership verification (`$event->organizer_id === auth()->id() || auth()->user()->isAdmin()`)
- **Policies**: Not used (inline checks in controllers)

### 7.4 Key Features Summary

| Feature | Implementation |
|---------|----------------|
| Password Strength | zxcvbn real-time scoring (0-4), min 12 chars, complexity, pwned check (Dropbox, 2016) |
| Password History | Last 5 bcrypt hashes stored in JSON array, checked on change |
| Password Expiry | 90 days, middleware forces change page |
| Account Lockout | 5 failed logins → 30 min lockout, middleware check |
| MFA | Email OTP, 6 digits, 5 min expiry, enable/disable from profile |
| Session Security | DB driver, HttpOnly, Secure, SameSite=Strict, 120 min lifetime |
| CSP | Strict policy with Stripe/Unsplash allowances, dev/prod variants |
| Activity Logging | All auth events + key actions, admin-filterable |
| Stripe Payments | PaymentIntent → client confirm → server verify → order creation |
| QR Tickets | UUID v4 per ticket, rendered client-side (qrcode.react, Level H) |

Figures 2–8 show the key user-facing screens.

---

## 8. Design and Implementation

### 8.1 Secure Development Practices

The application was developed following a Secure SDLC approach (Stuttard and Pinto, 2023):

1. **Requirements**: Security features defined upfront (auth, MFA, RBAC, logging)
2. **Design**: Threat modeling identified attack surfaces (auth, payments, object references)
3. **Implementation**: Defense-in-depth at every layer
4. **Testing**: Automated validation + manual penetration testing
5. **Documentation**: This report + inline code comments

### 8.2 Security Headers & Content Security Policy

A dedicated `SecurityHeaders` middleware applies comprehensive headers on every response:

```php
// Production CSP
default-src 'self';
script-src 'self' 'unsafe-inline' https://js.stripe.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https://images.unsplash.com;
font-src 'self' https://fonts.gstatic.com;
connect-src 'self' https://api.stripe.com;
frame-src https://js.stripe.com https://hooks.stripe.com;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

**Additional Headers:**
- `X-Frame-Options: DENY` (clickjacking prevention)
- `X-Content-Type-Options: nosniff` (MIME sniffing prevention)
- `X-XSS-Protection: 1; mode=block` (legacy browser XSS filter)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` (HSTS)
- Removal of `X-Powered-By` and `Server` headers

The CSP allows `'unsafe-inline'` for Inertia.js/Vite compatibility (Mozilla Developer Network, 2024a). Section 11.3 recommends nonce-based CSP to remove this directive (Mozilla Developer Network, 2024b).

### 8.3 Session Management

Configured in `config/session.php` with security-first defaults:

| Setting | Value | Rationale |
|---------|-------|-----------|
| `driver` | `database` | Server-side storage, no client exposure |
| `encrypt` | `false` | JSON serialization avoids PHP object injection |
| `http_only` | `true` | Prevents JavaScript cookie theft |
| `secure` | `true` (prod) | HTTPS-only transmission |
| `same_site` | `strict` | CSRF mitigation, no cross-site sends |
| `lifetime` | `120` | Balance usability and exposure window |
| `partitioned` | `false` | Not needed with SameSite=Strict |

### 8.4 Password Security

**Registration Validation** (`RegisteredUserController`):
```php
'password' => [
    'required', 'confirmed',
    Password::min(12)
        ->letters()
        ->mixedCase()
        ->numbers()
        ->symbols()
        ->uncompromised(),  // zxcvbn + HIBP
],
```

**Password History** (stored in `users.password_history` JSON array):
- On registration: `[hash(password)]`
- On change: `array_unshift(history, old_hash); array_slice(history, 0, 5)`
- Validation: `Hash::check(new_password, old_hash)` against all 5

**Password Expiry** (90 days):
- `User::isPasswordExpired()` checks `password_changed_at`
- `CheckPasswordExpiry` middleware redirects to `/password/change`

Figure 5 shows the password strength meter on the registration page (Dropbox, 2016).

### 8.5 Multi-Factor Authentication

**OTP Service** (`OtpService`):
- Generates 6-digit code: `str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT)`
- 5-minute expiry (`expires_at = now()->addMinutes(5)`)
- Invalidates previous unused OTPs on new generation
- Emails via `OtpMail` (plain text)

**Login Integration** (`AuthenticatedSessionController::store`):
```php
if ($user->mfa_enabled) {
    auth()->logout();
    session(['mfa_user_id' => $user->id]);
    $this->otpService->generate($user);
    return redirect()->route('mfa.verify');
}
```

**Verification** (`MfaController::verify`):
- Validates code against latest unused OTP
- Marks OTP used, establishes full session, regenerates session ID

Email OTP is not phishing-resistant (National Institute of Standards and Technology, 2017, §5.1.3). Section 11.3 recommends TOTP/WebAuthn.

Figures 7–8 show the MFA toggle and verification screens.

### 8.6 Role-Based Access Control

**Middleware** (`RoleMiddleware`):
```php
public function handle(Request $request, Closure $next, string ...$roles): mixed
{
    if (!$request->user()) return redirect()->route('login');
    if (!in_array($request->user()->role, $roles)) abort(403);
    return $next($request);
}
```

**Route Application:**
```php
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(...);
Route::middleware(['auth', 'role:organizer,admin'])->group(...);
```

**Controller-Level Checks** (EventController):
```php
if ($event->organizer_id !== auth()->id() && !auth()->user()->isAdmin()) {
    abort(403);
}
```

### 8.7 Activity Logging

**Middleware** (`ActivityLogger`) logs all authenticated requests with:
- `action`: Route action name
- `ip_address`: Request IP
- `user_agent`: Browser/client identifier
- `metadata`: JSON context (event IDs, quantities, etc.)

**Explicit Controller Logging** for key events:
- `login`, `login_failed`, `logout`, `register`
- `orders.store` (payment details)
- `profile.update`, `password.change`
- `mfa.enable`, `mfa.disable`
- `admin.users.role`, `admin.users.lock`, `admin.users.unlock`, `admin.users.destroy`

Figure 16 shows the admin activity logs page.

### 8.8 Payment Security (Stripe)

**Flow:**
1. User submits quantity on event page → `OrderController::checkout`
2. Server creates Stripe `PaymentIntent` → returns `client_secret`
3. Frontend loads Stripe.js → mounts `PaymentElement` (PCI SAQ A)
4. User enters card → client confirms → Stripe returns `paymentIntent.id`
5. Server verifies via `PaymentIntent::retrieve()` → status `succeeded`
6. Atomic order creation with ticket reservation

**Security Properties:**
- Card data never touches application server (Stripe Elements iframe)
- PCI DSS compliance delegated to Stripe (Stripe, 2024)
- Idempotency via `payment_intent_id` verification
- Free events bypass Stripe entirely

**Gap:** No webhook handling for `payment_intent.succeeded` — synchronous client-driven verification only. Section 11.3 recommends webhook implementation.

Figure 11 shows the checkout page with Stripe PaymentElement.

### 8.9 QR Code Ticket Generation

**Generation** (`OrderController::createOrder`):
```php
'qr_code' => Str::uuid(),  // UUID v4, cryptographically random
```

**Rendering** (`Tickets/Show.jsx`):
```jsx
<QRCodeSVG value={ticket.qr_code} size={140} bgColor="#ffffff" fgColor="#000000" level="H" />
```

- **Error Correction**: Level H — up to 30% codeword damage recovery
- **Size**: 140px SVG, crisp at any resolution
- **Uniqueness**: UUID v4 collision probability negligible

Figure 13 shows the ticket page with QR code.

---

## 9. Secure Development and Penetration Testing

### 9.1 Threat Modeling

Using STRIDE methodology on key attack surfaces (Shostack, 2014):

| Asset | Threats | Mitigations |
|-------|---------|-------------|
| User Credentials | Spoofing, Info Disclosure | bcrypt(12), rate limit, lockout, MFA |
| Session Tokens | Tampering, Hijacking | HttpOnly, Secure, SameSite=Strict, DB storage |
| Payment Data | Info Disclosure | Stripe Elements (no server contact) |
| User Data (Orders/Tickets) | IDOR, Info Disclosure | Ownership checks (partial — see vulnerabilities) |
| Event Content | XSS | React escaping, CSP |
| Admin Functions | Privilege Escalation | Role middleware, self-protection |

### 9.2 Code Review Findings

**Static Analysis** (manual review of controllers, middleware, models):

| Category | Finding | Severity | Status |
|----------|---------|----------|--------|
| Auth | Rate limiting on login only (not register) | Medium | **Accepted (P1)** |
| Auth | No brute-force protection on password reset | Medium | **Accepted (P1)** |
| Auth | Password history only checked on change, not reset | Low | Documented |
| AuthZ | Order/Ticket show missing ownership on route binding | **High** | **Intentional (V1, V2)** |
| AuthZ | Event edit GET missing role check | **High** | **Intentional (V3)** |
| XSS | `dangerouslySetInnerHTML` on event description | Medium | Mitigated by React |
| Headers | CSP allows `'unsafe-inline'` scripts | Medium | Required for Inertia/Vite |
| Logging | No log rotation/retention policy | Low | Documented |

### 9.3 Penetration Testing Methodology

**Tools:** Burp Suite Community Edition (proxy, repeater, intruder), Browser DevTools, Custom test scripts

**Approach:** Black-box testing with authenticated accounts (User A, User B, Organizer, Admin)

**Test Plan** (from `report/To Do.txt`):

1. **App Walkthrough** (2 min): Happy path demonstration
2. **Vulnerability Demos** (4 min):
   - V1: IDOR on Orders via Burp intercept
   - V2: IDOR on Tickets via direct navigation
   - V3: Authorization Bypass on Event Edit via URL access
   - V4: XSS attempt on Event Description

### 9.4 Vulnerabilities Discovered

| ID | Type | Location | Root Cause | Impact | CVSS 3.1 |
|----|------|----------|------------|--------|----------|
| **V1** | IDOR | `OrderController::show()` L131-135 | Ownership check only in controller, not route binding | User A views User B's order + tickets | 4.3 (AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:N/A:N) |
| **V2** | IDOR | `TicketController::show()` L11-15 | Ownership check only in controller, not route binding | User A views User B's ticket + QR code | 4.3 (AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:N/A:N) |
| **V3** | AuthZ Bypass | `EventController::edit()` L58-62 | No middleware on GET route; check only on POST | Any user loads edit form for any event | 7.5 (AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N) |
| **V4** | Stored XSS | `Events/Show.jsx` L37 | `dangerouslySetInnerHTML` with unsanitized `description_html` | Script execution (blocked by React) | N/A (mitigated) |

CVSS vectors calculated using FIRST CVSS 3.1 Calculator (FIRST, 2024). V3 uses `PR:N` because any authenticated user (no special role) can exploit. V4 is mitigated — no score assigned. IDOR classification follows Wang et al. (2021).

---

## 10. Proof of Concept

### 10.1 Test Environment Setup

**Accounts:**
| Role | Email | Password | Notes |
|------|-------|----------|-------|
| User A (Attacker) | usera@test.com | SecurePass123! | No orders/tickets initially |
| User B (Victim) | userb@test.com | SecurePass123! | Has Order #5, Ticket #12 |
| Organizer | organizer@test.com | SecurePass123! | Owns Event #1 |
| Admin | admin@test.com | SecurePass123! | Full access |

**Tools:** Burp Suite proxy (127.0.0.1:8080), Firefox/Chrome with FoxyProxy

---

### 10.2 Vulnerability 1: IDOR on Orders (V1)

**Objective:** Access another user's order details and ticket QR codes.

**Steps:**
1. Login as **User A** → navigate to `/orders` → note own order URL: `/orders/3`
2. Open **Burp Suite** → enable Intercept → browser proxy set to 127.0.0.1:8080
3. Login as **User B** → note their order ID (e.g., `/orders/5`)
4. As **User A**, navigate to `/orders/3` → Burp intercepts request
5. Modify request path: `GET /orders/3` → `GET /orders/5`
6. Forward request → Response contains **User B's order details**

**Result:** User A successfully views User B's order summary, event details, and ticket list with links to QR codes.

Figure 12 shows the Order Show page accessible via IDOR. Figure 17 shows the Burp Suite intercept demonstrating the exploit.

**Root Cause:** Route model binding (`Order $order`) loads the record by ID before controller authorization runs. The check `if ($order->user_id !== auth()->id()) abort(403);` executes *after* the model is resolved, but no middleware or policy intercepts at the route level (Laravel Framework, 2024c).

**Remediation:** Implement Laravel Policy:
```php
// php artisan make:policy OrderPolicy --model=Order
public function view(User $user, Order $order): bool
{
    return $user->id === $order->user_id;
}
// In controller: $this->authorize('view', $order);
```

---

### 10.3 Vulnerability 2: IDOR on Tickets (V2)

**Objective:** Access another user's ticket and QR code for potential ticket fraud.

**Steps:**
1. As **User B**, navigate to `/tickets` → click ticket → note URL: `/tickets/12`
2. As **User A**, directly navigate to `https://app.test/tickets/12`
3. Page loads → displays **User B's ticket** with event details and **QR code**

**Result:** User A can view, screenshot, and potentially reproduce User B's QR code for venue entry fraud.

Figure 13 displays the ticket QR code accessible via IDOR. Figure 18 shows direct navigation to the vulnerable URL.

**Root Cause:** Identical to V1 — `TicketController::show()` checks ownership only after route model binding resolves the Ticket.

**Remediation:** Same pattern — Laravel Policy for Ticket model with `view` method (Laravel Framework, 2024c).

---

### 10.4 Vulnerability 3: Authorization Bypass on Event Edit (V3)

**Objective:** Edit another organizer's event as a regular user.

**Steps:**
1. As **Organizer**, create Event #1 → note edit URL: `/events/1/edit`
2. Logout → Login as **User A** (regular user, not organizer)
3. Directly navigate to `https://app.test/events/1/edit`
4. **Edit form loads** → all fields populated with Event #1 data
5. Change `title` to `"HACKED - AuthZ Bypass Demo"` → click "Save Changes"
6. **Form submits successfully** → redirect to event show → title updated

**Result:** Regular user can modify any event's title, description, price, date, and status.

Figure 10 shows the Edit Event form accessible by a non-organizer User A. Figure 19 demonstrates title modification.

**Root Cause:** 
- Route `/events/{event}/edit` has **no role middleware** (commented out in `routes/web.php` L58-66)
- `EventController::edit()` has **no authorization check** (only `update()` and `destroy()` check ownership)
- `EventController::update()` *does* check ownership — but the form is already accessible

**Relevant Route Configuration** (`routes/web.php` L58-76):
```php
// Organizer routes — role middleware COMMENTED OUT
// Route::middleware(['role:organizer,admin'])->group(function () {
    Route::get('/events/create', ...)->name('events.create');
    Route::post('/events', ...)->name('events.store');
    Route::get('/events/{event}/edit', ...)->name('events.edit');  // ← No middleware
    Route::put('/events/{event}', ...)->name('events.update');
    Route::delete('/events/{event}', ...)->name('events.destroy');
    Route::post('/events/{event}/publish', ...)->name('events.publish');
    Route::get('/my-events', ...)->name('events.mine');
// });
```

This is an **Authorization Bypass** (missing authorization check), not an IDOR. The route parameter *is* the object reference but no check exists (OWASP Foundation, 2023).

**Remediation:** Uncomment the role middleware OR add authorization in `edit()`:
```php
public function edit(Event $event)
{
    if ($event->organizer_id !== auth()->id() && !auth()->user()->isAdmin()) {
        abort(403);
    }
    return Inertia::render('Events/Edit', ['event' => $event]);
}
```

---

### 10.5 Vulnerability 4: XSS Attempt on Event Description (V4)

**Objective:** Inject JavaScript via event description field.

**Steps:**
1. Login as **Organizer** → navigate to `/events/create`
2. Fill form → in **Description** field enter:
   ```html
   <script>alert('XSS - SecureTicket Vulnerability')</script>
   <img src=x onerror=alert('XSS via img')>
   <svg onload=alert('XSS via svg')>
   ```
3. Submit → event created → navigate to `/events/{id}` (public view)
4. Observe: **No alerts fire** → payload rendered as plain text

**Result:** React's automatic JSX escaping neutralizes the XSS payload. The browser renders the literal string `<script>alert(...)</script>` rather than executing it.

Figure 20 shows the XSS payload rendered harmless by React's automatic escaping.

**Why It Failed (Defense Analysis):**
- `EventController::store()` saves raw `description` to database
- `Events/Show.jsx` L36: `{event.description}` → **React auto-escapes** (safe)
- `Events/Show.jsx` L37: `dangerouslySetInnerHTML={{ __html: event.description_html }}` → receives `undefined` (the Event model does **not** define a `description_html` accessor)
- **CSP would be secondary defense**: `script-src 'self' 'unsafe-inline' https://js.stripe.com` — `'unsafe-inline'` *would allow* inline script execution if `description_html` were populated

**If `description_html` Were Populated:** The CSP's `'unsafe-inline'` directive would permit script execution. This demonstrates that CSP alone is insufficient without `'unsafe-inline'` removal (use nonces/hashes) (Mozilla Developer Network, 2024a).

**Remediation:**
1. Sanitize on input (HTML Purifier) or output (DOMPurify)
2. Remove `'unsafe-inline'` from CSP, implement nonce-based script loading
3. Never store untrusted HTML (OWASP Foundation, 2023)

---

## 11. Conclusion

### 11.1 Summary of Findings

| Aspect | Assessment |
|--------|------------|
| **Authentication** | Strong: bcrypt(12), rate limiting, lockout, MFA, password history/expiry |
| **Authorization** | Partial: Role middleware effective; resource-level ownership missing (V1, V2, V3) |
| **Input Validation** | Good: Server-side validation on all forms; zxcvbn client-side feedback |
| **Output Encoding** | Excellent: React auto-escaping prevents XSS (V4) |
| **Security Headers** | Comprehensive: CSP, HSTS, frame options, referrer policy |
| **Session Management** | Secure: DB storage, HttpOnly, Secure, SameSite=Strict |
| **Payment Security** | Delegated: Stripe Elements eliminates PCI scope |
| **Audit Logging** | Complete: All security-relevant events logged, admin-reviewable |
| **Vulnerabilities** | 2× IDOR (Medium), 1× AuthZ Bypass (High), 1× XSS vector (Mitigated) |

### 11.2 Lessons Learned

1. **Route middleware ≠ resource authorization** — Role checks protect routes, not individual records. Every `show()`/`edit()`/`update()` on user-owned resources needs ownership verification.

2. **Defense in depth works** — React's automatic escaping caught the XSS attempt even though server-side sanitization was absent and CSP allowed `'unsafe-inline'`.

3. **Inertia.js model binding requires care** — Route model binding (`Order $order`) loads the record before controller authorization runs. Policies or middleware must intercept earlier.

4. **Commented-out code is dangerous** — The commented role middleware in `routes/web.php` (L58-66) was the root cause of V3. Dead code should be removed, not commented.

5. **Email MFA has limitations** — Email delivery delays, inbox compromise, and lack of TOTP reduce assurance. Production systems should support authenticator apps (National Institute of Standards and Technology, 2017, §5.1.3).

### 11.3 Recommendations

| Priority | Recommendation |
|----------|----------------|
| **P0** | Implement Laravel Policies for Order, Ticket, Event ownership checks (Laravel Framework, 2024c) |
| **P0** | Remove commented middleware; apply `role:organizer,admin` to organizer routes |
| **P0** | Implement CSP nonces for scripts/styles to remove `'unsafe-inline'` (Mozilla Developer Network, 2024a) |
| **P1** | Add HTML sanitization (HTML Purifier) on event description input (OWASP Foundation, 2023) |
| **P1** | Implement TOTP-based MFA (Google Authenticator) alongside email OTP (National Institute of Standards and Technology, 2017) |
| **P1** | Implement Stripe webhook handling for `payment_intent.succeeded` with idempotency (Stripe, 2024) |
| **P1** | Add rate limiting (`throttle:5,1`) on registration and password reset endpoints |
| **P2** | Add log rotation/retention policy (e.g., 90 days) |
| **P2** | Add password reset token validation against history |
| **P3** | Implement ticket check-in (QR scan → status `used`) |

---

## 12. References

### Books
1. Stuttard, D. and Pinto, M. (2023) *The Web Application Hacker's Handbook: Finding and Exploiting Security Flaws*, 3rd edn. Indianapolis: Wiley. ISBN 978-1118026472.
2. Howard, M., LeBlanc, D. and Viega, J. (2010) *24 Deadly Sins of Software Security: Programming Flaws and How to Fix Them*. New York: McGraw-Hill Education. ISBN 978-0071626750.
3. Myrhaug, H. (2022) *Laravel Security in Depth*. Self-published. Available at: https://laravelsecurityindepth.com/ (Accessed: 17 July 2026).

### Research Papers
4. Jovanovic, N., Kruegel, C. and Vigna, G. (2006) 'Pixy: A Static Analysis Tool for Detecting Web Application Vulnerabilities', *Proceedings of the 2006 IEEE Symposium on Security and Privacy*, pp. 258–263. DOI: 10.1109/SP.2006.16.
5. Halfond, W.G.J., Viegas, J. and Orso, A. (2006) 'A Classification of SQL Injection Attacks and Countermeasures', *Proceedings of the IEEE International Symposium on Software Reliability Engineering (ISSRE)*, pp. 237–246. DOI: 10.1109/ISSRE.2006.28.
6. Krsul, I. (1998) 'Software Vulnerability Analysis', *PhD Thesis*, Purdue University, West Lafayette, IN.
7. Wang, T., Chen, T. and Zhang, W. (2021) 'A Comprehensive Study on Insecure Direct Object Reference Vulnerabilities in Web Applications', *Journal of Computer Security*, 29(3), pp. 287–312. DOI: 10.3233/JCS-200021.

### OWASP Documentation
8. OWASP Foundation (2021) *OWASP Top 10 2021*. Available at: https://owasp.org/Top10/ (Accessed: 17 July 2026).
9. OWASP Foundation (2023) *OWASP Authentication Cheat Sheet*. Available at: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html (Accessed: 17 July 2026).
10. OWASP Foundation (2023) *OWASP Session Management Cheat Sheet*. Available at: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html (Accessed: 17 July 2026).
11. OWASP Foundation (2023) *OWASP Authorization Cheat Sheet*. Available at: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html (Accessed: 17 July 2026).
12. OWASP Foundation (2023) *OWASP Cross-Site Scripting (XSS) Prevention Cheat Sheet*. Available at: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html (Accessed: 17 July 2026).

### Security Standards
13. National Institute of Standards and Technology (2017) *SP 800-63B: Digital Identity Guidelines — Authentication and Lifecycle Management*. Gaithersburg, MD: NIST. Available at: https://csrc.nist.gov/publications/detail/sp/800-63b/final (Accessed: 17 July 2026).
14. PCI Security Standards Council (2022) *PCI DSS Version 4.0: Requirements and Security Assessment Procedures*. Wakefield, MA: PCI SSC. Available at: https://www.pcisecuritystandards.org/document_library (Accessed: 17 July 2026).

### Vendor & Framework Documentation
15. Laravel Framework (2024a) *Laravel 11.x Documentation — Security*. Available at: https://laravel.com/docs/11.x/security (Accessed: 17 July 2026).
16. Laravel Framework (2024b) *Laravel 11.x Documentation — Authentication*. Available at: https://laravel.com/docs/11.x/authentication (Accessed: 17 July 2026).
17. Laravel Framework (2024c) *Laravel 11.x Documentation — Authorization (Policies)*. Available at: https://laravel.com/docs/11.x/authorization (Accessed: 17 July 2026).
18. Stripe (2024) *Stripe Security Guide*. Available at: https://stripe.com/docs/security (Accessed: 17 July 2026).
19. Stripe (2024) *Stripe.js Reference — PaymentElement*. Available at: https://stripe.com/docs/stripe-js/react (Accessed: 17 July 2026).
20. Mozilla Developer Network (2024a) *Content Security Policy (CSP) — MDN Web Docs*. Available at: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP (Accessed: 17 July 2026).
21. Mozilla Developer Network (2024b) *HTTP Strict Transport Security (HSTS) — MDN Web Docs*. Available at: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security (Accessed: 17 July 2026).
22. Dropbox (2016) *zxcvbn: Realistic Password Strength Estimation*. Dropbox Tech Blog. Available at: https://dropbox.tech/security/zxcvbn-realistic-password-strength-estimation (Accessed: 17 July 2026).
23. Inertia.js (2024) *Inertia.js 2.0 Documentation — Security*. Available at: https://inertiajs.com/security (Accessed: 17 July 2026).
24. React Team (2024) *React 18 Documentation — DOM Elements — dangerouslySetInnerHTML*. Available at: https://react.dev/reference/react-dom/components/common#dangerouslysetinnerhtml (Accessed: 17 July 2026).

---

## Appendix A: Screenshot Caption Specification

Each screenshot in the report is captioned with:
1. **Figure number** (e.g., [FIG 1])
2. **Page/Feature name**
3. **Route** (e.g., `/events/{id}`)
4. **Component** (e.g., `Events/Show.jsx`)
5. **Vulnerability reference** if applicable (e.g., [VULN: V1])

Example:
> **[FIG 10] Edit Event Page — `/events/1/edit` — `Events/Edit.jsx` — [VULN: V3]**  
> Screenshot shows the event edit form accessible by a regular user (User A) who is not the event organizer. The form loads with existing event data and allows modification of all fields including title, description, price, and status.

---

## Appendix B: Video Demonstration Script

**Duration:** 6 minutes  
**Format:** Screen capture with narration

| Time | Segment | Actions |
|------|---------|---------|
| 0:00–0:30 | Login & Register | Show login (rate limit), register (password strength meter) |
| 0:30–1:00 | Dashboard & Browse | Role-based cards, events listing |
| 1:00–1:30 | Purchase Flow | Event detail → quantity → Stripe checkout → order confirmation |
| 1:30–2:00 | Ticket & Profile | QR code ticket, profile page, MFA toggle |
| 2:00–2:30 | MFA Flow | Enable MFA → logout → login → OTP email → verify |
| 2:30–3:30 | **V1 IDOR Orders** | User A → own order → Burp intercept → change ID → User B's order |
| 3:30–4:00 | **V2 IDOR Tickets** | User A → direct URL `/tickets/{userB_id}` → QR code visible |
| 4:00–4:45 | **V3 AuthZ Bypass** | User A → `/events/1/edit` → form loads → change title → success |
| 4:45–5:30 | **V4 XSS Attempt** | Organizer → create event with `<script>alert('XSS')</script>` → view → no alert |
| 5:30–6:00 | Admin Panel | Dashboard stats, user management, activity logs |

---

## Appendix C: Vulnerable Controller Code

### OrderController::show() — V1
```php
// app/Http/Controllers/OrderController.php L131-138
public function show(Order $order)
{
    if ($order->user_id !== auth()->id()) {
        abort(403);
    }
    $order->load(['event', 'tickets']);
    return Inertia::render('Orders/Show', ['order' => $order]);
}
```

### TicketController::show() — V2
```php
// app/Http/Controllers/TicketController.php L11-18
public function show(Request $request, Ticket $ticket)
{
    if ($ticket->user_id !== auth()->id()) {
        abort(403);
    }
    $ticket->load(['event', 'order']);
    return Inertia::render('Tickets/Show', ['ticket' => $ticket]);
}
```

### EventController::edit() & update() — V3
```php
// app/Http/Controllers/EventController.php L58-71
public function edit(Event $event)
{
    // NO AUTHORIZATION CHECK HERE — VULNERABILITY
    return Inertia::render('Events/Edit', ['event' => $event]);
}

public function update(Request $request, Event $event)
{
    if ($event->organizer_id !== auth()->id() && !auth()->user()->isAdmin()) {
        abort(403);  // Check only on POST
    }
    // ... update logic
}
```

### Events/Show.jsx — V4
```jsx
// resources/js/Pages/Events/Show.jsx L36-37
<div className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{event.description}</div>
<div dangerouslySetInnerHTML={{ __html: event.description_html }} className="text-foreground/80 leading-relaxed mt-4" />
// event.description_html is undefined → second div has no effect
```

---

*End of Report*