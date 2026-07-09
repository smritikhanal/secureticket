# Glossary (Terms & Abbreviations)

## Technical Terms

| Term | Definition |
|------|------------|
| **Laravel** | PHP web application framework (v11) |
| **Inertia.js** | Bridge between Laravel backend and React/Vue frontend; enables SPA without API |
| **React** | JavaScript library for building user interfaces (v18) |
| **Tailwind CSS** | Utility-first CSS framework (v3.4) |
| **PostgreSQL** | Open-source relational database |
| **Stripe** | Payment processing platform (test mode used) |
| **MFA / 2FA** | Multi-Factor Authentication / Two-Factor Authentication |
| **OTP** | One-Time Password (6-digit, email-delivered, 5-min expiry) |
| **RBAC** | Role-Based Access Control |
| **IDOR** | Insecure Direct Object Reference (OWASP API1:2023) |
| **XSS** | Cross-Site Scripting (OWASP A03:2021) |
| **CSP** | Content Security Policy |
| **HSTS** | HTTP Strict Transport Security |
| **CSRF** | Cross-Site Request Forgery |
| **CORS** | Cross-Origin Resource Sharing |
| **JWT** | JSON Web Token (not used; Laravel sessions) |
| **UUID** | Universally Unique Identifier (v4 for QR codes) |
| **QR Code** | Quick Response code (bacon-qr-code, level H error correction) |
| **zxcvbn** | Password strength estimator (Dropbox) |
| **PCI DSS** | Payment Card Industry Data Security Standard |

## Laravel-Specific

| Term | Definition |
|------|------------|
| **Eloquent** | Laravel's ActiveRecord ORM |
| **Migration** | Database schema version control |
| **Seeder** | Database test data population |
| **Middleware** | HTTP request filter layers |
| **Route Model Binding** | Auto-inject model instances from route params |
| **Form Request** | Validation + authorization class |
| **Policy** | Authorization logic class |
| **Sanctum** | Laravel's API token authentication (installed, not used) |
| **Breeze** | Minimal auth scaffolding (used as base) |
| **Vite** | Frontend build tool (dev server + production build) |

## Security Concepts

| Term | Definition |
|------|------------|
| **OWASP Top 10** | Standard awareness document for web app security risks |
| **OWASP ASVS** | Application Security Verification Standard |
| **Secure SDLC** | Secure Software Development Life Cycle |
| **Threat Modeling** | Structured approach to identifying security threats |
| **Penetration Testing** | Authorized simulated attack to find vulnerabilities |
| **Burp Suite** | Web vulnerability scanner / proxy tool |
| **Rate Limiting** | Restricting request frequency to prevent abuse |
| **Account Lockout** | Temporary disable after failed attempts |
| **Password Rotation** | Forced periodic password change |
| **Password History** | Preventing reuse of recent passwords |
| **Session Fixation** | Attack forcing known session ID; prevented by regeneration |
| **Session Hijacking** | Stealing session cookie; mitigated by HttpOnly, Secure, SameSite |
| **Clickjacking** | UI redress attack; prevented by X-Frame-Options: DENY |
| **MIME Sniffing** | Browser guessing content type; prevented by X-Content-Type-Options: nosniff |

## Abbreviations

| Abbrev | Full Form |
|--------|-----------|
| **CW2** | Coursework 2 |
| **API** | Application Programming Interface |
| **SPA** | Single Page Application |
| **SSR** | Server-Side Rendering (not used; Inertia is client-side) |
| **SSG** | Static Site Generation (not used) |
| **DB** | Database |
| **PK** | Primary Key |
| **FK** | Foreign Key |
| **PKCE** | Proof Key for Code Exchange (OAuth) |
| **TLS** | Transport Layer Security |
| **HTTPS** | HTTP over TLS |
| **SQL** | Structured Query Language |
| **ORM** | Object-Relational Mapping |
| **MVC** | Model-View-Controller |
| **CI/CD** | Continuous Integration / Continuous Deployment |
| **SLA** | Service Level Agreement |
| **GDPR** | General Data Protection Regulation |
| **ISO 27001** | Information security management standard |

## Project-Specific

| Term | Definition |
|------|------------|
| **SecureTicket** | The event ticketing application name |
| **Organizer** | User role that can create/manage events |
| **Attendee** | User role that purchases tickets (default 'user' role) |
| **Draft Event** | Unpublished event, not visible to public |
| **Published Event** | Live event, tickets available for purchase |
| **Cancelled Event** | Event cancelled, no new tickets sold |
| **Valid Ticket** | Unused, unexpired ticket |
| **Used Ticket** | QR code scanned at entry |
| **Order** | Completed purchase record |
| **PaymentIntent** | Stripe object representing payment flow |
| **Client Secret** | Stripe key for client-side payment confirmation |