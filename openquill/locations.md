# Locations (Application Pages & Screens)

## Public Routes (Guest Accessible)

### 1. Homepage (`/`)
- **Component**: `resources/js/Pages/Welcome.jsx`
- **Layout**: `GuestLayout` (minimal nav)
- **Data**: `events` (6 latest published), `canLogin`, `canRegister`
- **Features**: Hero, stats bar, features grid, featured events (3), testimonials, FAQ, CTA
- **UI**: Glass-morphism cards, animated background mesh, unsplash images
- **Screenshot**: [SCREENSHOT: Homepage - hero section with stats and featured events]

### 2. Events Listing (`/events`)
- **Component**: `resources/js/Pages/Events/Index.jsx`
- **Layout**: `GuestLayout`
- **Data**: `events` (all published, with organizer)
- **Features**: Grid of event cards, sold-out badges, price display
- **Screenshot**: [SCREENSHOT: Events listing page - grid of event cards]

### 3. Event Detail (`/events/{event}`)
- **Component**: `resources/js/Pages/Events/Show.jsx`
- **Layout**: `GuestLayout`
- **Data**: `event` (with organizer), `auth` (current user)
- **Features**: 
  - Hero image, event metadata (date, venue, availability, price)
  - Description (rendered with `dangerouslySetInnerHTML` for `description_html` - **XSS vector**)
  - Ticket purchase form (if authenticated & not sold out)
  - Edit button (if organizer/admin)
- **Screenshot**: [SCREENSHOT: Event detail page - with purchase form visible]

### 4. Login (`/login`)
- **Component**: `resources/js/Pages/Auth/Login.jsx`
- **Layout**: Standalone centered card
- **Features**: Email/password, remember me, forgot password link, register link
- **Security**: Rate limited (5/min/IP+email), account lockout check
- **Screenshot**: [SCREENSHOT: Login page - form with email/password fields]

### 5. Register (`/register`)
- **Component**: `resources/js/Pages/Auth/Register.jsx`
- **Layout**: Standalone centered card
- **Features**: Name, email, password, confirm password
- **Password Strength Meter**: **zxcvbn** real-time scoring (0-4), visual bar, feedback suggestions
- **Validation**: Min 12 chars, uppercase, lowercase, number, symbol, not pwned
- **Screenshot**: [SCREENSHOT: Register page - password strength meter showing "Strong" with green bar]

### 6. Forgot Password (`/forgot-password`)
- **Component**: `resources/js/Pages/Auth/ForgotPassword.jsx`

### 7. Reset Password (`/reset-password/{token}`)
- **Component**: `resources/js/Pages/Auth/ResetPassword.jsx`

### 8. Verify Email (`/verify-email`)
- **Component**: `resources/js/Pages/Auth/VerifyEmail.jsx`

## Authenticated Routes (Requires: `auth`, `verified`)

### 9. Dashboard (`/dashboard`)
- **Component**: `resources/js/Pages/Dashboard.jsx`
- **Layout**: `AuthenticatedLayout` (sidebar + top bar)
- **Data**: `auth.user`
- **Features**: Role-based quick links:
  - All: Browse Events, My Tickets, Profile & Security
  - Organizer+: Manage Events
  - Admin: Admin Panel
- **Screenshot**: [SCREENSHOT: Dashboard - showing role-based navigation cards]

### 10. Profile & Security (`/profile`)
- **Component**: `resources/js/Pages/Profile/Edit.jsx`
- **Layout**: `AuthenticatedLayout`
- **Data**: `auth.user`, `status` (flash messages)
- **Features**:
  - **Profile**: Name, email (PATCH `/profile`)
  - **Change Password**: Current, new, confirm (PUT `/password`) - checks last 5 passwords
  - **Two-Factor Authentication**: Toggle MFA (POST `/mfa/enable|disable`)
  - **Danger Zone**: Delete account (DELETE `/profile`)
- **Screenshot**: [SCREENSHOT: Profile page - MFA toggle and password change sections visible]

### 11. MFA Verification (`/mfa/verify`)
- **Component**: `resources/js/Pages/Auth/MfaVerify.jsx`
- **Layout**: Standalone centered card
- **Flow**: After successful login with MFA enabled → session stores `mfa_user_id` → redirects here
- **Features**: 6-digit code input (auto-focus, monospace), resend button, verify submit
- **Session**: `mfa_user_id` cleared on success, full login established
- **Screenshot**: [SCREENSHOT: MFA verification page - 6-digit code input field]

### 12. Password Expired (`/password/change`)
- **Component**: `resources/js/Pages/Auth/PasswordExpired.jsx`
- **Trigger**: Middleware `CheckPasswordExpiry` detects `password_changed_at > 90 days`
- **Features**: Forced password change with same strength requirements

## Organizer Routes (Requires: `auth`, `role:organizer,admin`)

### 13. Create Event (`/events/create`)
- **Component**: `resources/js/Pages/Events/Create.jsx`
- **Layout**: `AuthenticatedLayout`
- **Fields**: Title, Description, Venue, Date/Time, Ticket Price, Total Tickets
- **Validation**: Required, date after now, price ≥ 0, tickets 1-10000
- **Default Status**: `draft`
- **Screenshot**: [SCREENSHOT: Create event form - all fields visible]

### 14. Edit Event (`/events/{event}/edit`) — **VULNERABLE: IDOR V3**
- **Component**: `resources/js/Pages/Events/Edit.jsx`
- **Layout**: `AuthenticatedLayout`
- **Data**: `event` (full object)
- **Authorization Check**: **ONLY in `update()` and `destroy()` controller methods**, NOT in `edit()` GET route
- **Vulnerability**: Any authenticated user can access `/events/{id}/edit` and load the form
- **Fields**: All create fields + Status (draft/published/cancelled)
- **Screenshot**: [SCREENSHOT: Edit event form - accessible by non-organizer (VULN V3)]

### 15. My Events (`/my-events`)
- **Component**: `resources/js/Pages/Events/MyEvents.jsx`
- **Layout**: `AuthenticatedLayout`
- **Data**: User's events (all statuses)

### 16. Publish Event (`POST /events/{event}/publish`)
- **Controller**: `EventController@publish`
- **Auth**: Organizer or admin only

## Order & Ticket Routes (Authenticated Users)

### 17. Checkout (`/checkout`)
- **Component**: `resources/js/Pages/Orders/Checkout.jsx`
- **Layout**: `AuthenticatedLayout`
- **Data**: `event`, `quantity`, `total_amount`, `client_secret`, `stripe_key`
- **Features**: Order summary (left), Stripe PaymentElement (right)
- **Payment Flow**: `loadStripe` → `Elements` → `PaymentElement` → `confirmPayment` → redirect if required → `router.post('/orders')`
- **Free Events**: Bypass Stripe, direct to order creation
- **Screenshot**: [SCREENSHOT: Checkout page - Stripe payment form on right, order summary on left]

### 18. Order Confirmation / Order Show (`/orders/{order}`) — **VULNERABLE: IDOR V1**
- **Component**: `resources/js/Pages/Orders/Show.jsx`
- **Layout**: `AuthenticatedLayout`
- **Data**: `order` (with `event`, `tickets`)
- **Authorization**: `$order->user_id === auth()->id()` — **only checked in `show()`**
- **Vulnerability**: User A can access `/orders/{userB_order_id}` and see order + ticket links
- **Features**: Order summary, ticket list with QR codes (links to `/tickets/{id}`)
- **Screenshot**: [SCREENSHOT: Order show page - with ticket list and QR code links (VULN V1)]

### 19. Order History (`/orders`)
- **Component**: `resources/js/Pages/Orders/Index.jsx`
- **Layout**: `AuthenticatedLayout`
- **Data**: User's orders (with events), paginated

### 20. Ticket Detail (`/tickets/{ticket}`) — **VULNERABLE: IDOR V2**
- **Component**: `resources/js/Pages/Tickets/Show.jsx`
- **Layout**: `AuthenticatedLayout`
- **Data**: `ticket` (with `event`, `order`)
- **Authorization**: `$ticket->user_id === auth()->id()` — **only checked in `show()`**
- **Vulnerability**: User A can access `/tickets/{userB_ticket_id}` and view QR code
- **Features**: Ticket card with event info, **QR code (140px, level H)**, QR code value (UUID)
- **Screenshot**: [SCREENSHOT: Ticket detail page - large QR code visible (VULN V2)]

### 21. My Tickets (`/tickets`)
- **Component**: `resources/js/Pages/Tickets/Index.jsx`
- **Layout**: `AuthenticatedLayout`
- **Data**: User's tickets (with events)

## Admin Routes (Requires: `auth`, `role:admin`)

### 22. Admin Dashboard (`/admin`)
- **Component**: `resources/js/Pages/Admin/Dashboard.jsx`
- **Layout**: `AuthenticatedLayout`
- **Data**: `stats` (users, events, orders, revenue), `recent_logs` (10)
- **Features**: Stat cards, quick links to Users/Logs, recent activity table

### 23. User Management (`/admin/users`)
- **Component**: `resources/js/Pages/Admin/Users.jsx`
- **Layout**: `AuthenticatedLayout`
- **Data**: `users` (paginated, searchable), `search` query
- **Features**: Search, role dropdown (user/organizer/admin), lock/unlock button, delete button
- **Self-Protection**: Buttons disabled/hidden for current admin

### 24. Activity Logs (`/admin/logs`)
- **Component**: `resources/js/Pages/Admin/Logs.jsx`
- **Layout**: `AuthenticatedLayout`
- **Data**: `logs` (paginated), `actions` (distinct list), `filters`
- **Features**: Filter by action, filter by user, pagination, timestamp formatting

## API/Action Routes (No UI)

| Method | URI | Controller | Purpose |
|--------|-----|------------|---------|
| POST | `/events` | EventController@store | Create event |
| PUT | `/events/{event}` | EventController@update | Update event |
| DELETE | `/events/{event}` | EventController@destroy | Delete event |
| POST | `/checkout` | OrderController@checkout | Create Stripe intent |
| POST | `/orders` | OrderController@store | Confirm payment, create order |
| POST | `/mfa/enable` | MfaController@enable | Enable MFA |
| POST | `/mfa/disable` | MfaController@disable | Disable MFA |
| POST | `/mfa/verify` | MfaController@verify | Verify OTP |
| POST | `/mfa/resend` | MfaController@resend | Resend OTP |
| PATCH | `/admin/users/{user}/role` | AdminController@updateRole | Change role |
| POST | `/admin/users/{user}/toggle-lock` | AdminController@toggleLock | Lock/unlock |
| DELETE | `/admin/users/{user}` | AdminController@destroyUser | Delete user |

## Screenshot Requirements for Report (Video + Document)

### App Walkthrough (2 min) — Screenshots Needed:
1. [ ] Homepage with hero and featured events
2. [ ] Register page — **password strength meter** (show "Strong" green bar)
3. [ ] Login page
4. [ ] Dashboard — role-based cards
5. [ ] Events listing
6. [ ] Event detail — ticket purchase form
7. [ ] Checkout — Stripe payment form
8. [ ] Order confirmation — ticket list
9. [ ] Ticket detail — **QR code visible**
10. [ ] Profile page — **MFA toggle** shown
11. [ ] MFA enable → verify flow (email sent, code entered)
12. [ ] Logout → Login again → **MFA challenge page**

### Vulnerability Demos (4 min) — Screenshots Needed:
13. [ ] **V1 IDOR Orders**: User A at `/orders/{UserB_order_id}` — shows User B's order
14. [ ] **V1 IDOR Orders**: Burp Suite intercept showing URL manipulation
15. [ ] **V2 IDOR Tickets**: User A at `/tickets/{UserB_ticket_id}` — shows User B's QR code
16. [ ] **V3 IDOR Event Edit**: Regular user at `/events/1/edit` — edit form loads
17. [ ] **V3 IDOR Event Edit**: Change title to "HACKED", submit → success
18. [ ] **V4 XSS Attempt**: Organizer creates event with `<script>alert('XSS')</script>` in description
19. [ ] **V4 XSS Result**: View event page — alert fires OR React escapes (document both)

### Security Features Evidence:
20. [ ] Security headers (browser dev tools Network tab → Response Headers)
21. [ ] CSP header value visible
22. [ ] Session cookie flags (HttpOnly, Secure, SameSite=Strict)
23. [ ] Rate limit response (5 failed logins → lockout message)
24. [ ] Password expiry redirect
25. [ ] Admin panel - user management
26. [ ] Admin panel - activity logs
27. [ ] Database: password_history array, mfa_secret, locked_until columns