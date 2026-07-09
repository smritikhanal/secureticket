# Characters (User Roles & Test Accounts)

## Primary Roles

### 1. Admin (Superuser)
- **Key**: `role = 'admin'`
- **Capabilities**: Full system access, user management (role changes, lock/unlock, delete), activity log viewing, system statistics
- **Routes**: `/admin/*` (dashboard, users, logs)
- **Self-Protection**: Cannot change own role, lock own account, or delete self
- **Test Account**: Create via seeder or admin panel → `admin@secureticket.test` / `SecurePass123!`

### 2. Organizer (Event Creator)
- **Key**: `role = 'organizer'`
- **Capabilities**: Create events, edit own events, publish events, view own events list
- **Routes**: `/events/create`, `/events/{id}/edit` (own), `/my-events`, `/events/{id}/publish`
- **Authorization**: Event ownership checked in controller (`organizer_id === auth()->id() || isAdmin()`)
- **Test Account**: Register → promote via admin panel → `organizer@secureticket.test` / `SecurePass123!`

### 3. User / Attendee (Default)
- **Key**: `role = 'user'`
- **Capabilities**: Browse events, purchase tickets, view own tickets/orders, manage profile, toggle MFA, change password
- **Routes**: `/events`, `/events/{id}`, `/checkout`, `/orders`, `/orders/{id}`, `/tickets`, `/tickets/{id}`, `/profile`, `/mfa/verify`
- **Test Accounts**: 
  - **User A (Attacker)**: `usera@test.com` / `SecurePass123!`
  - **User B (Victim)**: `userb@test.com` / `SecurePass123!`

## Supporting Entities

### 4. OtpCode (MFA Token)
- **Fields**: `user_id`, `code` (6-digit), `expires_at` (5 min), `used` (boolean)
- **Lifecycle**: Generated on login (if MFA enabled) or MFA enable; consumed on verify; auto-cleanup of unused
- **Delivery**: Email via `OtpMail` (plain text, 6-digit code)

### 5. ActivityLog (Audit Trail)
- **Fields**: `user_id` (nullable), `action` (string), `ip_address`, `user_agent`, `metadata` (JSON)
- **Logged Actions**: `login`, `login_failed`, `logout`, `register`, `orders.store`, `profile.update`, `password.change`, `mfa.enable`, `mfa.disable`, `events.store`, `events.update`, `events.publish`, `admin.users.role`, `admin.users.lock`, `admin.users.unlock`, `admin.users.destroy`
- **Admin Access**: Filterable, paginated, sortable in `/admin/logs`

### 6. Event (Core Entity)
- **Fields**: `organizer_id`, `title`, `description`, `venue`, `event_date`, `ticket_price`, `total_tickets`, `tickets_sold`, `status`
- **Relationships**: belongsTo Organizer (User), hasMany Tickets, hasMany Orders
- **Status Values**: `draft`, `published`, `cancelled`
- **Helper**: `availableTickets()`, `isSoldOut()`

### 7. Order (Purchase Record)
- **Fields**: `user_id`, `event_id`, `quantity`, `total_amount`, `stripe_payment_id`, `status`
- **Relationships**: belongsTo User, belongsTo Event, hasMany Tickets
- **Status Values**: `completed` (only status used currently)

### 8. Ticket (Individual Entry)
- **Fields**: `event_id`, `user_id`, `order_id`, `qr_code` (UUID v4), `status`
- **Relationships**: belongsTo User, Event, Order
- **Status Values**: `valid`, `used`, `cancelled`
- **QR Code**: Generated via `Str::uuid()` at purchase, rendered via `qrcode.react` (level H)

## Test Account Setup for Penetration Testing

```sql
-- User A (Attacker)
INSERT INTO users (name, email, password, role, password_changed_at, password_history) 
VALUES ('User A', 'usera@test.com', '$2y$12$...', 'user', NOW(), '["$2y$12$..."]');

-- User B (Victim) - has orders and tickets
INSERT INTO users (name, email, password, role, password_changed_at, password_history) 
VALUES ('User B', 'userb@test.com', '$2y$12$...', 'user', NOW(), '["$2y$12$..."]');

-- Organizer
INSERT INTO users (name, email, password, role, password_changed_at, password_history) 
VALUES ('Event Org', 'organizer@test.com', '$2y$12$...', 'organizer', NOW(), '["$2y$12$..."]');

-- Admin
INSERT INTO users (name, email, password, role, password_changed_at, password_history) 
VALUES ('Admin User', 'admin@test.com', '$2y$12$...', 'admin', NOW(), '["$2y$12$..."]');
```

## Relationship Diagram
```
User (1) ─────< (M) Event (organizer)
User (1) ─────< (M) Order
User (1) ─────< (M) Ticket
User (1) ─────< (M) OtpCode
User (1) ─────< (M) ActivityLog

Event (1) ────< (M) Ticket
Event (1) ────< (M) Order

Order (1) ───< (M) Ticket
```