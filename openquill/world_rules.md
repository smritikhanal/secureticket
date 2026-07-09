# World Rules (Security Policies & Business Logic)

## Authentication Rules

### Password Policy
- **Minimum Length**: 12 characters
- **Complexity**: At least 1 uppercase, 1 lowercase, 1 number, 1 symbol
- **Compromised Check**: Rejected if found in HaveIBeenPwned (via zxcvbn)
- **History**: Last 5 passwords cannot be reused
- **Expiry**: 90 days forced rotation
- **Hashing**: bcrypt (cost 12, configurable via `BCRYPT_ROUNDS=12`)

### Login Security
- **Rate Limit**: 5 attempts per minute per IP + email combination
- **Account Lockout**: After 5 failed attempts → locked for 30 minutes
- **Lockout Check**: Middleware `CheckAccountLockout` runs on every authenticated request
- **Session Regeneration**: On successful login and logout

### Multi-Factor Authentication (MFA)
- **Type**: Email-based 6-digit OTP (Time-based, 5-minute expiry)
- **Trigger**: Required on every login when `mfa_enabled = true`
- **Flow**: 
  1. User submits credentials → valid
  2. If MFA enabled: logout, store `mfa_user_id` in session, send OTP, redirect to `/mfa/verify`
  3. User enters code → verified → full login established
  4. If invalid: error, allow resend (new OTP generated, old invalidated)
- **Enable/Disable**: User-controlled from Profile page (POST `/mfa/enable|disable`)

### Session Management
- **Driver**: Database (`sessions` table)
- **Lifetime**: 120 minutes (configurable `SESSION_LIFETIME`)
- **Encryption**: Disabled (`SESSION_ENCRYPT=false`) - JSON serialization
- **Cookie Settings**:
  - `HttpOnly: true`
  - `Secure: true` (production only)
  - `SameSite: strict`
  - `Path: /`
  - `Domain: null` (current domain only)
  - `Partitioned: false`
- **Expire on Close**: false
- **Lottery**: 2/100 (garbage collection)

## Authorization Rules

### Role Hierarchy
```
admin > organizer > user
```

### Route Protection Matrix

| Route Pattern | Middleware | Access |
|--------------|------------|--------|
| `/` | none | Public |
| `/events*` | none | Public (read) |
| `/login`, `/register` | `guest` | Unauthenticated only |
| `/dashboard` | `auth`, `verified` | All authenticated |
| `/profile*` | `auth`, `verified` | Own profile only |
| `/mfa/*` | `auth` + session `mfa_user_id` | MFA flow only |
| `/events/create` | `auth`, `role:organizer,admin` | Organizer+ |
| `/events/{event}/edit` | `auth` + **controller check** | Owner or admin |
| `/events/{event}/publish` | `auth` + **controller check** | Owner or admin |
| `/my-events` | `auth`, `role:organizer,admin` | Organizer+ |
| `/checkout` | `auth`, `verified` | Authenticated |
| `/orders*`, `/tickets*` | `auth` + **controller check** | Owner only |
| `/admin/*` | `auth`, `role:admin` | Admin only |

### Controller-Level Authorization
- **EventController**: `edit`, `update`, `destroy`, `publish` check `$event->organizer_id === auth()->id() || auth()->user()->isAdmin()`
- **OrderController::show**: `$order->user_id === auth()->id()` — **VULNERABLE: IDOR**
- **TicketController::show**: `$ticket->user_id === auth()->id()` — **VULNERABLE: IDOR**
- **AdminController**: Self-protection checks (`$user->id === auth()->id()`)

## Data Integrity Rules

### Event Management
- **Ticket Price**: ≥ 0 (free events allowed)
- **Total Tickets**: 1-10,000
- **Event Date**: Must be in future (at creation)
- **Status Transitions**: draft → published → cancelled (no revert to draft)
- **Sold Counter**: Atomic increment via `DB::raw` with check constraint

### Order Processing
- **Atomicity**: `DB::transaction` not used; uses `whereRaw` atomic update
- **Race Condition Protection**: `whereRaw('tickets_sold + ? <= total_tickets')`
- **Payment Verification**: Stripe PaymentIntent status `succeeded` required
- **Free Events**: Bypass Stripe, create order directly
- **Ticket Generation**: One QR code (UUID v4) per quantity unit

### Ticket Lifecycle
- **Statuses**: `valid` → `used` (on check-in, not implemented) → `cancelled`
- **QR Code**: Unique, UUID v4, rendered at 140px, error correction Level H
- **Ownership**: Immutable after creation (`user_id`, `event_id`, `order_id`)

## Security Headers (Middleware: `SecurityHeaders`)

### Production CSP
```
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

### Development CSP (additional)
- `script-src`: adds `'unsafe-eval'`, `http://127.0.0.1:5173`, `http://localhost:5173`
- `style-src`: adds `https://fonts.bunny.net`, `https://fonts.googleapis.com`
- `connect-src`: adds WebSocket (`ws://`) and Vite HMR origins

### Other Headers
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- Removed: `X-Powered-By`, `Server`

## Activity Logging Rules

### Logged Events (Automatic via `ActivityLogger` middleware)
- All authenticated requests: `action`, `ip`, `user_agent`, `metadata`
- **Explicit Logging** in controllers:
  - `login`, `login_failed`, `logout`, `register`
  - `orders.store` (with event_id, quantity, total)
  - `profile.update`, `password.change`, `password.reset`
  - `mfa.enable`, `mfa.disable`
  - `events.store`, `events.update`, `events.publish`
  - `admin.users.role`, `admin.users.lock`, `admin.users.unlock`, `admin.users.destroy`

### Log Retention
- No automatic cleanup (manual/admin responsibility)
- Admin panel: filterable, paginated (50/page)

## Vulnerability Rules (Intentional for CW2)

### V1: IDOR on Orders
- **Location**: `OrderController::show(Order $order)` line 131-135
- **Check**: `if ($order->user_id !== auth()->id()) abort(403);`
- **Bypass**: Direct object reference `/orders/{id}` — no ownership check on route model binding
- **Impact**: View any user's order, ticket list, QR codes

### V2: IDOR on Tickets
- **Location**: `TicketController::show(Request $request, Ticket $ticket)` line 11-15
- **Check**: `if ($ticket->user_id !== auth()->id()) abort(403);`
- **Bypass**: Direct object reference `/tickets/{id}`
- **Impact**: View any user's ticket + QR code (ticket fraud)

### V3: Missing Authorization on Event Edit (GET)
- **Location**: `EventController::edit(Event $event)` line 58-62
- **Check**: Only on `edit` (GET) and `update` (PUT) — but route accessible without role middleware
- **Vulnerability**: Any authenticated user can GET `/events/{id}/edit` and see form
- **Impact**: Information disclosure; combined with V4 could allow edits

### V4: Stored XSS Attempt (Event Description)
- **Location**: `EventController::store` / `update` — `description` field stored raw
- **Render**: `Events/Show.jsx` line 37: `dangerouslySetInnerHTML={{ __html: event.description_html }}`
- **Mitigation**: React JSX auto-escapes; `description_html` not sanitized server-side
- **Test**: `<script>alert('XSS')</script>` in description
- **Result**: React renders as text (escaped) — **demonstrates defense-in-depth**

## Payment Rules
- **Provider**: Stripe (test mode)
- **Flow**: PaymentIntent → client confirms → server verifies → order created
- **Currency**: USD (cents internally), display as Rs (Nepalese Rupees)
- **Webhooks**: Not implemented (synchronous verification only)
- **Refunds**: Not implemented

## Admin Panel Rules
- **User Management**: Search, paginate (20), role dropdown, lock/unlock, delete
- **Self-Protection**: Admin cannot modify own role, lock self, delete self
- **Lock Mechanism**: `locked_until = now()->addYears(10)` (effectively permanent)
- **Unlock**: `locked_until = null`, `failed_login_attempts = 0`
- **Activity Logs**: Filter by action, user; paginate 50; distinct action list for filter dropdown